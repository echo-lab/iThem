import {
  Layout,
  Menu,
  Typography,
  Space,
  Input,
  Row,
  Col,
  Alert,
  Button,
  List,
  Avatar,
  Card,
  Modal,
  Form,
  message,
  Tooltip,
} from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  CalculatorOutlined,
  PlusCircleFilled,
  CaretRightOutlined,
} from "@ant-design/icons";
import Editor from "./editor";
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Outlet(props) {
  const [outlets, setoutlets] = useState([]);
  const { data: session, status } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchOutlets();
  }, []);
  const fetchOutlets = async (query) => {
    if (session) {
      const req = await fetch(`/api/outlets?email=${session.user.email}`);
      const data = await req.json();
      setoutlets(data.message);
    }
  };
  const handleDelete = async (query) => {
    try {
      const req = await fetch(`/api/outlets?id=${query}`, { method: "DELETE" });
      const data = await req.json();
      fetchOutlets();
      message.success("outlets deleted");
    } catch (error) {
      message.warning(error);
    }
  };

  const handleTestOutlet = (name) => {
    const msg = "Outlet Triggered Manually From Button";
    const type = "outlet";
    fetch(
      `/api/events/create?email=${session.user.email}&name=${name}&note=${msg}&type=${type}`,
      {
        method: "POST",
      }
    )
      .then((res) => {
        message.success(`Outlet ${name} is triggered`);
      })
      .catch((error) => {
        message.error("Failed");
      });
  };

  const onFinish = (values) => {
    fetch(
      `/api/outlets/create?email=${session.user.email}&name=${values.name}&description=${values.description}&state=${values.state}`,
      {
        method: "POST",
      }
    )
      .then((res) => {
        fetchOutlets();
        message.success(values.name + " added to my list");
      })
      .catch((error) => {
        message.error(values.name + " fail to create");
      });
    setIsModalVisible(false);
  };
  return (
    <>
      <Modal
        title="Add a new inlet"
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
            label="description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="state"
            name="state"
            rules={[{ required: true, message: "Please input state!" }]}
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
      <Row>
        <Col span={24}>
          <Row
            style={{ marginTop: "5px", marginBottom: "5px" }}
            justify="center"
          >
            <Button
              type="primary"
              icon={<PlusCircleFilled />}
              onClick={() => setIsModalVisible(true)}
            >
              add a new outlet
            </Button>
          </Row>
          <List
            itemLayout="horizontal"
            dataSource={outlets}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <Tooltip
                    key="1"
                    title="Test this outlet! The result will appear on log if successful."
                  >
                    <Button
                      key="run"
                      type="primary"
                      onClick={() => handleTestOutlet(item.name)}
                    >
                      <CaretRightOutlined />
                    </Button>
                  </Tooltip>,
                  <Button
                    danger
                    key="delete"
                    type="primary"
                    onClick={() => handleDelete(item._id)}
                  >
                    delete
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
}
