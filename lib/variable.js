import {
  Space,
  Input,
  Button,
  Modal,
  Form,
  message,
  Table,
  Select,
} from "antd";
const { Option } = Select;

import { RedoOutlined, PlusCircleFilled } from "@ant-design/icons";
import Editor from "./editor";
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Variable(props) {
  const [variables, setVariable] = useState([]);
  const { data: session, status } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchVariable();
  }, []);
  const fetchVariable = async (query) => {
    if (session) {
      const req = await fetch(`/api/var?email=${session.user.email}`);
      const data = await req.json();
      setVariable(data.message);
    }
  };
  const handleDelete = async (query) => {
    try {
      const req = await fetch(`/api/var?id=${query}`, { method: "DELETE" });
      const data = await req.json();
      fetchVariable();
      message.success("variable deleted");
    } catch (error) {
      message.warning(error);
    }
  };
  const onFinish = (values) => {
    fetch(
      `/api/var/create?email=${session.user.email}&name=${values.name}&type=${values.type}&value=${values.value}`,
      {
        method: "POST",
      }
    ).then((res) => {
      fetchVariable();
      if (res.status == 200) message.success(values.name + " added to my list");
      else
        message.error(
          values.name + " fail to create:( Did your state has a duplicate name?"
        );
    });

    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          danger
          type="primary"
          key="delete"
          onClick={() => handleDelete(record._id)}
        >
          delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16, marginTop: 16 }}>
        <Button
          type="primary"
          icon={<RedoOutlined />}
          onClick={() => {
            fetchVariable();
            message.success("Refresh Successful! Variable Table Is Up To Date");
          }}
        >
          Refresh
        </Button>

        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={() => setIsModalVisible(true)}
        >
          Create A State
        </Button>
      </Space>

      <Table columns={columns} dataSource={variables} />

      <Modal
        title="Create A State"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="name"
            name="name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="type"
            name="type"
            rules={[{ required: true, message: "Please input type!" }]}
          >
            <Select>
              <Select.Option value="double">double</Select.Option>
              <Select.Option value="boolean">boolean</Select.Option>
              <Select.Option value="int">int</Select.Option>
              <Select.Option value="string">string</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="value"
            name="value"
            rules={[
              {
                required: true,
                message:
                  "Please input value! Use TRUE or FALSE for boolean value",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

const data = [
  {
    key: "1",
    name: "var1",
    type: "boolean",
    value: "true",
  },
  {
    key: "2",
    name: "var1",
    type: "int",
    value: 23,
  },
  {
    key: "3",
    name: "var1",
    type: "double",
    value: 32.0,
  },
];
