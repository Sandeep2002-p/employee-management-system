import "dotenv/config"; // loads variables from .env into process.env
import Fastify from "fastify"; // import the Fastify framework
import cors from "@fastify/cors"; // import the CORS plugin
import { PrismaClient } from "./generated/prisma/client"; // import Prisma's database client
import { PrismaPg } from "@prisma/adapter-pg"; // adapter that connects Prisma to PostgreSQL
import bcrypt from "bcrypt"; // for hashing passwords
import jwt from "@fastify/jwt"; // for creating/verifying login tokens

const app = Fastify({ logger: true }); // create the server, logger:true prints request logs

// create the adapter using our database connection string from .env
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter }); // create a connection to our database

// allow our frontend to call this API
app.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"], // explicitly allow all methods our app uses
});

// register JWT support — used to sign/verify login tokens
app.register(jwt, {
  secret: process.env.JWT_SECRET || "dev-only-fallback-secret", // real secret comes from Render's env vars
});

// simple health check route
app.get("/health", async () => {
  return { status: "ok", message: "Backend is running!" };
});

// TEMPORARY route — creates a test user. We'll remove this once login works.
app.post("/register-test-user", async (request, reply) => {
  const { email, password, name } = request.body as {
    email: string;
    password: string;
    name: string;
  };

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  reply.code(201);
  return { id: user.id, email: user.email, name: user.name };
});

// POST /login — checks email + password, returns a token if correct
app.post("/login", async (request, reply) => {
  const { email, password } = request.body as { email: string; password: string };

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    reply.code(401);
    return { error: "Invalid email or password" };
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    reply.code(401);
    return { error: "Invalid email or password" };
  }

  const token = app.jwt.sign({ id: user.id, email: user.email, name: user.name });

  return { token, user: { id: user.id, email: user.email, name: user.name } };
});

// ===== EMPLOYEE ROUTES =====

app.get("/employees", async () => {
  const employees = await prisma.employee.findMany();
  return employees;
});

app.post("/employees", async (request, reply) => {
  const { name, email, phone, department, status } = request.body as {
    name: string;
    email: string;
    phone: string;
    department: string;
    status: string;
  };

  const newEmployee = await prisma.employee.create({
    data: { name, email, phone, department, status },
  });

  reply.code(201);
  return newEmployee;
});

app.put("/employees/:id", async (request) => {
  const { id } = request.params as { id: string };
  const { name, email, phone, department, status } = request.body as {
    name: string;
    email: string;
    phone: string;
    department: string;
    status: string;
  };

  const updatedEmployee = await prisma.employee.update({
    where: { id: Number(id) },
    data: { name, email, phone, department, status },
  });

  return updatedEmployee;
});

app.delete("/employees/:id", async (request) => {
  const { id } = request.params as { id: string };

  await prisma.employee.delete({
    where: { id: Number(id) },
  });

  return { success: true };
});

// ===== DEPARTMENT ROUTES =====

app.get("/departments", async () => {
  const departments = await prisma.department.findMany();
  return departments;
});

app.post("/departments", async (request, reply) => {
  const { name, manager, employeeCount } = request.body as {
    name: string;
    manager: string;
    employeeCount: number;
  };

  const newDepartment = await prisma.department.create({
    data: { name, manager, employeeCount },
  });

  reply.code(201);
  return newDepartment;
});

app.put("/departments/:id", async (request) => {
  const { id } = request.params as { id: string };
  const { name, manager, employeeCount } = request.body as {
    name: string;
    manager: string;
    employeeCount: number;
  };

  const updatedDepartment = await prisma.department.update({
    where: { id: Number(id) },
    data: { name, manager, employeeCount },
  });

  return updatedDepartment;
});

app.delete("/departments/:id", async (request) => {
  const { id } = request.params as { id: string };

  await prisma.department.delete({
    where: { id: Number(id) },
  });

  return { success: true };
});

// start the server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000; // Render provides its own PORT
    await app.listen({ port, host: "0.0.0.0" }); // 0.0.0.0 makes it reachable from outside the container
    console.log(`Server running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();