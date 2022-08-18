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
  const [form] = Form.useForm();

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
      title: "delete",
      dataIndex: "_id",
      render: (_id) => (
        <Button key="delete" onClick={() => handleDelete(_id)}>
          delete
        </Button>
      ),
    },
  ];
  useEffect(() => {
    fetchinlet(0);
  }, []);
  const fetchinlet = async (selectIdx) => {
    if (session) {
      // setLoading(true);
      const req = await fetch(`/api/inlets?email=${session.user.email}`);
      const data = await req.json();
      setInlets(data.message);
      // Set the selected inlet
      if (!data.message || data.message.length === 0) {
        // No inlets
        setSelectedInlet({id:0});
      } else if (selectIdx !== undefined && data.message && data.message.length > 0) {
        // We were told to select a differen inlet, i.e., because we deleted the selected one or created a new one.
        setSelectedInlet(data.message.at(selectIdx));
      } else {
        // We already have an inlet selected, so let's select the newest version of it (the code might have changed).
        let r = data.message.find(x => x._id === inlet._id);
        if (r) setSelectedInlet(r);
      }
    }
  };
  const handleDelete = async (id) => {
    try {
      const req = await fetch(`/api/inlets?id=${id}`, { method: "DELETE" });
      const data = await req.json();

      // Select the first inlet if we delete the currently selected inlet
      inlet._id === id ? fetchinlet(0) : fetchinlet();
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

      if (res.status == 200) {
        fetchinlet(-1);
        message.success(values.name + " added to my list");
      } else
        message.error(
          values.name + " fail to create:( Did your inlet has a duplicate name?"
        );
    });

    setIsModalVisible(false);
  };
  return (
    <>
      <Modal
        title="Create An Inlet"
        visible={isModalVisible}
        onOk={()=>form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={(values) => {
            onFinish(values);
            form.resetFields();
          }}
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

          { /*
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        */ }
        </Form>
      </Modal>
      <Row>
        <Col span={24}>
          <Collapse bordered={false} defaultActiveKey={["0"]} ghost>
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
                          onClick={
                            (e) => {
                              e.stopPropagation();
                              handleDelete(item._id)}
                          }
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
                  Create An Inlet
                </Button>
              </List>
            </Panel>
            <hr style={{"marginBottom": 22}} />
            {
            // <Paragraph copyable={{ text: inlet._id }}>
            //   Inlet ID: {inlet._id}
            // </Paragraph>
            }
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
