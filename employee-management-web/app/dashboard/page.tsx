"use client";

import { useEffect, useState } from "react";
import {
  TeamOutlined,
  ApartmentOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const API_URL = "http://localhost:4000";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  status: string;
}

interface Department {
  id: number;
  name: string;
  manager: string;
  employeeCount: number;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [employeeResponse, departmentResponse] = await Promise.all([
          fetch(`${API_URL}/employees`),
          fetch(`${API_URL}/departments`),
        ]);

        if (!employeeResponse.ok || !departmentResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const employeeData = await employeeResponse.json();
        const departmentData = await departmentResponse.json();

        setEmployees(employeeData);
        setDepartments(departmentData);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculate real values from database data
  const totalEmployees = employees.length;

  const totalDepartments = departments.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status?.toLowerCase() === "active"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status?.toLowerCase() === "inactive"
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "35px",
        background:
          "linear-gradient(135deg, #eef5ff 0%, #f8fbff 50%, #eaf2ff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background circles */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(22, 119, 255, 0.08)",
          top: "-100px",
          right: "-80px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "rgba(22, 119, 255, 0.06)",
          bottom: "-100px",
          left: "-80px",
        }}
      />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Welcome Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #1677ff, #003eb3)",
            borderRadius: "22px",
            padding: "35px",
            color: "white",
            marginBottom: "30px",
            boxShadow: "0 12px 30px rgba(22, 119, 255, 0.20)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            Welcome back, Admin User 👋
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              fontSize: "16px",
              opacity: 0.9,
            }}
          >
             Overview of Employee Management System.
          </p>
        </div>

        {/* Statistics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Total Employees */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "14px",
                background: "#eaf3ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                color: "#1677ff",
              }}
            >
              <TeamOutlined />
            </div>

            <p
              style={{
                color: "#777",
                marginTop: "15px",
                marginBottom: "5px",
              }}
            >
              Total Employees
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              {loading ? "..." : totalEmployees}
            </h2>
          </div>

          {/* Departments */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "14px",
                background: "#f1ebff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                color: "#722ed1",
              }}
            >
              <ApartmentOutlined />
            </div>

            <p
              style={{
                color: "#777",
                marginTop: "15px",
                marginBottom: "5px",
              }}
            >
              Departments
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              {loading ? "..." : totalDepartments}
            </h2>
          </div>

          {/* Active Employees */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "14px",
                background: "#eafff3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                color: "#16a34a",
              }}
            >
              <CheckCircleOutlined />
            </div>

            <p
              style={{
                color: "#777",
                marginTop: "15px",
                marginBottom: "5px",
              }}
            >
              Active Employees
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              {loading ? "..." : activeEmployees}
            </h2>
          </div>

          {/* Inactive Employees */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "14px",
                background: "#fff1f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                color: "#ff4d4f",
              }}
            >
              <UserOutlined />
            </div>

            <p
              style={{
                color: "#777",
                marginTop: "15px",
                marginBottom: "5px",
              }}
            >
              Inactive Employees
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              {loading ? "..." : inactiveEmployees}
            </h2>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
          }}
        >
          {/* Departments List */}
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "18px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              Departments
            </h2>

            {loading ? (
              <p>Loading departments...</p>
            ) : departments.length === 0 ? (
              <p style={{ color: "#888" }}>
                No departments found.
              </p>
            ) : (
              departments.map((department) => (
                <div
                  key={department.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <strong>{department.name}</strong>

                    <div
                      style={{
                        color: "#888",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      Manager: {department.manager}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#eaf3ff",
                      color: "#1677ff",
                      padding: "7px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {department.employeeCount} employees
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Employee Summary */}
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "18px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "25px",
              }}
            >
              Employee Summary
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <span>Total Employees</span>
              <strong>{totalEmployees}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <span style={{ color: "#16a34a" }}>
                Active
              </span>

              <strong style={{ color: "#16a34a" }}>
                {activeEmployees}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <span style={{ color: "#ff4d4f" }}>
                Inactive
              </span>

              <strong style={{ color: "#ff4d4f" }}>
                {inactiveEmployees}
              </strong>
            </div>

            <div
              style={{
                height: "10px",
                background: "#eee",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width:
                    totalEmployees > 0
                      ? `${(activeEmployees / totalEmployees) * 100}%`
                      : "0%",
                  background: "#16a34a",
                  borderRadius: "10px",
                }}
              />
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#888",
                marginTop: "10px",
              }}
            >
              {totalEmployees > 0
                ? `${Math.round(
                    (activeEmployees / totalEmployees) * 100
                  )}% of employees are active`
                : "No employees available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}