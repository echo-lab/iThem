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
  Table,
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

export default function Outlet(props) {
  const [events, setevents] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchEvents = async (query) => {
    if (session) {
      // setLoading(true);
      const req = await fetch(`/api/events?email=${session.user.email}`);
      const data = await req.json();
      setevents(data.message);
    }
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Table columns={columns} dataSource={events} />
        </Col>
      </Row>
    </>
  );
}

const columns = [
  {
    title: "ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Outlet Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Date",
    dataIndex: "created_at",
    key: "created_at",
    sorter: (a, b) => a.meta.timestamp - b.meta.timestamp,
  },
];
