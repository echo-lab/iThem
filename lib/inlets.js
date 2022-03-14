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
} from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  CalculatorOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import Editor from "./editor";
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Inlet(props) {
  const [inlets, setInlets] = useState([]);
  const { data: session, status } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inlet, setSelectedInlet] = useState({id:0});

  useEffect(() => {
    fetchinlet();
  }, []);
  const fetchinlet = async (query) => {
    if (session) {
      // setLoading(true);
      const req = await fetch(`/api/inlets?email=${session.user.email}`);
      const data = await req.json();
      setInlets(data.message);
    }
  };
  const handleDelete = async (query) => {
    try {
      const req = await fetch(`/api/inlets?id=${query}`, { method: "DELETE" });
      const data = await req.json();
      fetchinlet();
      message.success("inlet deleted");
    } catch (error) {
      message.warning(error);
    }
  };
  const onFinish = (values) => {
    fetch(
      `/api/inlets/create?email=${session.user.email}&name=${values.name}&description=${values.description}`,
      {
        method: "POST",
      }
    )
      .then((res) => {
        fetchinlet();
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
        // onOk={handleOk}
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

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Row>
        <Col span={12}>
          <Row
            style={{ marginTop: "5px", marginBottom: "5px" }}
            justify="center"
          >
            <Button
              type="primary"
              style={{ width: "95%" }}
              icon={<PlusCircleFilled />}
              onClick={() => setIsModalVisible(true)}
            ></Button>
          </Row>
          <List
            itemLayout="horizontal"
            dataSource={inlets}
            renderItem={(item) => (
              
              <List.Item
                key={item.id}
              >
              <Card
              onClick={()=>{setSelectedInlet(item);}}
              style={inlet._id==item._id?{width: "95%" , borderColor:'#1890ff' }:{ width: "95%" }}
              hoverable
              actions={[
                <Button key="edit">edit</Button>,
                <Button key="delete" onClick={() => handleDelete(item._id)}>
                  delete
                </Button>,
              ]}>
              <Card.Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={item.name}
                  description={item.description}
                />
              </Card>
                
                
              </List.Item>
            )}
          />
          Current Inlet ID: {inlet._id}
        </Col>

        <Col span={12}>
          <Editor code={inlet.description}></Editor>
        </Col>
      </Row>
    </>
  );
}
