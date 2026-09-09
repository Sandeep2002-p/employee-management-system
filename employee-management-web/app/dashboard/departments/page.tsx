"use client"; // needed for interactive components

import { useState, useEffect } from "react"; // useEffect runs code when the page loads
import { Table, Button, Input, Space, Popconfirm, Modal, Form, message, Spin } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

// Shape of one department object (matches our Prisma model)
interface Department {
  id: number;
  name: string;
  manager: string;
  employeeCount: number;
}

const API_URL = "http://localhost:4000"; // base URL of our backend API

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]); // starts EMPTY, not mock data
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [form] = Form.useForm();

  // fetch departments from the real backend
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/departments`); // call our GET /departments route
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      message.error("Failed to load departments. Is the backend running?");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // run once when the page first loads
  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredData = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEditClick = (dept: Department) => {
    setEditingDept(dept);
    form.setFieldsValue(dept);
    setIsModalOpen(true);
  };

  // DELETE — calls the real API
  const handleDeleteDept = async (id: number) => {
    try {
      await fetch(`${API_URL}/departments/${id}`, { method: "DELETE" });
      message.success("Department deleted");
      fetchDepartments(); // re-fetch so the table reflects the real database
    } catch (error) {
      message.error("Failed to delete department");
      console.error(error);
    }
  };

  // ADD/EDIT — calls the real API
    const handleFormSubmit = async (values: {
    name: string;
    manager: string;
    employeeCount: number;
  }) => {
    // ensure employeeCount is a real number, since text inputs return strings
    const payload = { ...values, employeeCount: Number(values.employeeCount) };

    try {
      if (editingDept) {
        // EDIT MODE — call PUT
        await fetch(`${API_URL}/departments/${editingDept.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        message.success("Department updated");
      } else {
        // ADD MODE — call POST
        await fetch(`${API_URL}/departments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        message.success("Department added");
      }
      setIsModalOpen(false);
      setEditingDept(null);
      form.resetFields();
      fetchDepartments(); // re-fetch so the table shows real updated data
    } catch (error) {
      message.error("Something went wrong");
      console.error(error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Department Name", dataIndex: "name", key: "name" },
    { title: "Manager", dataIndex: "manager", key: "manager" },
    { title: "Employees", dataIndex: "employeeCount", key: "employeeCount" },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Department) => (
        <Space>
          <Button size="small" onClick={() => handleEditClick(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this department?"
            onConfirm={() => handleDeleteDept(record.id)}
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
          placeholder="Search by department"
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingDept(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Department
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredData} rowKey="id" />
      </Spin>

      <Modal
        title={editingDept ? "Edit Department" : "Add New Department"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingDept(null);
        }}
        onOk={() => form.submit()}
        okText={editingDept ? "Save" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Department Name"
            rules={[{ required: true, message: "Please enter a department name" }]}
          >
            <Input placeholder="e.g. Marketing" />
          </Form.Item>

          <Form.Item
            name="manager"
            label="Manager"
            rules={[{ required: true, message: "Please enter a manager name" }]}
          >
            <Input placeholder="e.g. Ravi Kumar" />
          </Form.Item>

          <Form.Item
            name="employeeCount"
            label="Employee Count"
            rules={[{ required: true, message: "Please enter the number of employees" }]}
          >
            {/* type="number" gives a numeric input */}
            <Input type="number" placeholder="e.g. 5" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}