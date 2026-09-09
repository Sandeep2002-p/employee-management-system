"use client"; // needed because we use interactive Ant Design components

import { useEffect, useState } from "react"; // hooks for running code on load + storing state
import { useRouter } from "next/navigation"; // lets us redirect programmatically
import { Layout, Menu, Spin } from "antd"; // Layout = page structure, Menu = sidebar links, Spin = loading spinner
import {
  DashboardOutlined,
  TeamOutlined,
  ApartmentOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true); // true while we're still verifying login
  const [userName, setUserName] = useState(""); // holds the logged-in user's name for the topbar

  // this runs once when the dashboard layout first loads
  useEffect(() => {
    const token = localStorage.getItem("token"); // check if a token was saved during login

    if (!token) {
      // no token means the user never logged in — send them back to the login page
      router.push("/login");
      return;
    }

    // token exists — load the saved user info to show their name
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.name);
    }

    setChecking(false); // done checking, safe to show the dashboard now
  }, [router]);

  // logs the user out by clearing storage and redirecting
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // while we're still checking for a token, show a full-screen spinner
  // instead of briefly flashing the dashboard content to unauthorized users
  if (checking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: "16px",
            fontWeight: "bold",
          }}
        >
          EMS
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: <Link href="/dashboard">Dashboard</Link>,
            },
            {
              key: "employees",
              icon: <TeamOutlined />,
              label: <Link href="/dashboard/employees">Employees</Link>,
            },
            {
              key: "departments",
              icon: <ApartmentOutlined />,
              label: <Link href="/dashboard/departments">Departments</Link>,
            },
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Logout",
              onClick: handleLogout, // clicking this logs the user out
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", padding: "0 16px" }}>
          Welcome, {userName || "Admin"} {/* shows the real logged-in user's name */}
        </Header>
        <Content style={{ margin: "16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}