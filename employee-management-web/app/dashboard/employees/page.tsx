"use client"; // needed for interactive components (table, input, state, modal)

import { useState, useEffect } from "react"; // useEffect runs code when the page loads
import { Table, Input, Button, Tag, Space, Modal, Form, Select, Popconfirm, message, Spin } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

// Shape of one employee object (matches our Prisma model)
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  status: "Active" | "Inactive";
}

// the base URL of our backend API — one place to change it later if needed
const API_URL = "http://localhost:4000";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]); // starts EMPTY now, not mock data
  const [loading, setLoading] = useState(true); // tracks whether we're still fetching
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  // fetch employees from the real backend
  const fetchEmployees = async () => {
    try {
      setLoading(true); // show loading spinner
      const res = await fetch(`${API_URL}/employees`); // call our GET /employees route
      const data = await res.json(); // parse the JSON response
      setEmployees(data); // store it in state so the table can display it
    } catch (error) {
      message.error("Failed to load employees. Is the backend running?");
      console.error(error);
    } finally {
      setLoading(false); // hide loading spinner either way
    }
  };

  // useEffect with an empty [] dependency array runs ONCE when the page first loads
  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredData = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setIsModalOpen(true);
  };

  // DELETE — now calls the real API instead of just updating local state
  const handleDeleteEmployee = async (id: number) => {
    try {
      await fetch(`${API_URL}/employees/${id}`, { method: "DELETE" }); // call DELETE route
      message.success("Employee deleted");
      fetchEmployees(); // re-fetch the list so the table reflects the real database
    } catch (error) {
      message.error("Failed to delete employee");
      console.error(error);
    }
  };

  // ADD/EDIT — now calls the real API instead of just updating local state
  const handleFormSubmit = async (values: {
    name: string;
    email: string;
    phone: string;
    department: string;
    status: "Active" | "Inactive";
  }) => {
    try {
      if (editingEmployee) {
        // EDIT MODE — call PUT to update the existing employee
        await fetch(`${API_URL}/employees/${editingEmployee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        message.success("Employee updated");
      } else {
        // ADD MODE — call POST to create a new employee
        await fetch(`${API_URL}/employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        message.success("Employee added");
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      form.resetFields();
      fetchEmployees(); // re-fetch so the table shows the real updated data
    } catch (error) {
      message.error("Something went wrong");
      console.error(error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Department", dataIndex: "department", key: "department" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Employee) => (
        <Space>
          <Button size="small" onClick={() => handleEditClick(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this employee?"
            onConfirm={() => handleDeleteEmployee(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <Input
          placeholder="Search by name"
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingEmployee(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Employee
        </Button>
      </div>

      {/* Spin shows a loading spinner while "loading" is true */}
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredData} rowKey="id" />
      </Spin>

      <Modal
        title={editingEmployee ? "Edit Employee" : "Add New Employee"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onOk={() => form.submit()}
        okText={editingEmployee ? "Save" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="e.g. Alice Johnson" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter an email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="e.g. alice@company.com" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter a phone number" },
              { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" },
            ]}
          >
            <Input placeholder="e.g. 9876543210" />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: "Please select a department" }]}
          >
            <Select
              placeholder="Select department"
              options={[
                { value: "Engineering", label: "Engineering" },
                { value: "HR", label: "HR" },
                { value: "Sales", label: "Sales" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              placeholder="Select status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}