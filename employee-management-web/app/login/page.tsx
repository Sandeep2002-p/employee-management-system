"use client"; // required for interactive/client-side components

import { Form, Input, Button, Card, Typography, message } from "antd"; // Ant Design UI components
import { UserOutlined, LockOutlined } from "@ant-design/icons"; // icons for input fields
import { useRouter } from "next/navigation"; // lets us redirect the user after login

const { Title } = Typography; // shortcut to use <Title> for headings

const API_URL = "http://localhost:4000"; // base URL of our backend API

export default function LoginPage() {
  const router = useRouter(); // gives us a way to navigate to another page in code

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // note: our backend expects "email", but our form field is named "username" —
        // so we map it here
        body: JSON.stringify({ email: values.username, password: values.password }),
      });

      const data = await res.json(); // parse the response

      if (!res.ok) {
        // res.ok is false for 401 errors etc. — show the backend's error message
        message.error(data.error || "Login failed");
        return;
      }

      // save the token in the browser's localStorage so we can use it on future requests
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      message.success(`Welcome, ${data.user.name}!`);
      router.push("/dashboard"); // redirect to the dashboard
    } catch (error) {
      message.error("Something went wrong. Is the backend running?");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 350 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Employee Management System
        </Title>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            label="Email" // updated label since we're really using email now
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}