# Employee Management System

A full-stack employee management application with authentication, built as a learning project.

## Structure

This repo contains both frontend and backend in one place:

- **`/employee-management-web`** — Frontend (Next.js, React, TypeScript, Ant Design)
- **`/` (root)** — Backend (Fastify, TypeScript, Prisma, PostgreSQL)

## Tech Stack

**Frontend:** Next.js, React, TypeScript, Ant Design, Tailwind CSS
**Backend:** Fastify, Prisma ORM, PostgreSQL
**Auth:** JWT tokens, bcrypt password hashing

## Features

- Secure login with hashed passwords and JWT-based authentication
- Protected dashboard (redirects unauthenticated users to login)
- Employee management: add, edit, delete, search — fully connected to PostgreSQL
- Department management: same full CRUD functionality
- Persistent data storage (PostgreSQL database via Prisma)

## Running Locally

**Backend** (from repo root):
\`\`\`bash
npm install
npx prisma generate
npm run dev
\`\`\`
Runs on `http://localhost:4000`

**Frontend** (from `/employee-management-web`):
\`\`\`bash
npm install
npm run dev
\`\`\`
Runs on `http://localhost:3000`

You'll need a `.env` file in the root with your own `DATABASE_URL` (see `.env` — not committed to this repo for security).