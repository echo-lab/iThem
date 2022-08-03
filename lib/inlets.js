import {
  Typography,
  Space,
  Input,
  Row,
  Col,
  Button,
  List,
  Card,
  Modal,
  Form,
  message,
  Collapse,
} from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

import Editor from "./editor";
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
const { Paragraph } = Typography;
const { Panel } = Collapse;

export default function Inlet(props) {
  const [inlets, setInlets] = useState([]);
  const { data: session, status } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inlet, setSelectedInlet] = useState({ id: 0 });
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "description",
      dataIndex: "description",
    },
    {
      title: "Address",
      dataIndex: "_id",
      render: (_id) => (
        <Button key="delete" onClick={() => handleDelete(_id)}>
          delete
        </Button>
      ),
    },
  ];
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
    ).then((res) => {
      fetchinlet();

      if (res.status == 200) message.success(values.name + " added to my list");
      else
        message.error(
          values.name + " fail to create:( Did your inlet has a duplicate name?"
        );
    });

    setIsModalVisible(false);
  };
  return (
    <>
      <Modal
        title="Create A Inlet"
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
        <Col span={24}>
          <Collapse bordered={false} defaultActiveKey={["1"]} ghost>
            <Panel
              header={
                <Space
                  direction="horizontal"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                >
                  {inlet.id == 0
                    ? "Select a inlet to view the code"
                    : inlet.name}
                </Space>
              }
            >
              <List
                key={"1"}
                grid={{ gutter: 16, column: 3 }}
                itemLayout="horizontal"
                dataSource={inlets}
                renderItem={(item) => (
                  <List.Item key={item.id}>
                    <Card
                      onClick={() => {
                        setSelectedInlet(item);
                      }}
                      style={
                        inlet._id == item._id
                          ? { width: "95%", borderColor: "#1890ff" }
                          : { width: "95%" }
                      }
                      hoverable
                      actions={[
                        <Button
                          key="delete"
                          onClick={() => handleDelete(item._id)}
                        >
                          delete
                        </Button>,
                      ]}
                    >
                      <Card.Meta
                        title={item.name}
                        description={item.description}
                      />
                    </Card>
                  </List.Item>
                )}
              >
                <Button
                  type="primary"
                  icon={<PlusCircleFilled />}
                  onClick={() => setIsModalVisible(true)}
                >
                  Create A Inlet
                </Button>
              </List>
            </Panel>
            <Paragraph copyable={{ text: inlet._id }}>
              Inlet ID: {inlet._id}
            </Paragraph>
          </Collapse>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Editor inlet={inlet} fetchinlet={fetchinlet}></Editor>
        </Col>
      </Row>
    </>
  );
}
