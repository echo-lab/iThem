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
} from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  UserOutlined,
  CalculatorOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
const { SubMenu } = Menu;
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import User from "../lib/user";
import Inlet from "./inlets";
import Outlet from "./outlets";
import Event from "./events";
import Variable from "./variable";
import Scheduled from "./scheduled";
export default function Controller() {
  const [currMenu, setCurrMenu] = useState("user");
  const { data: session, status } = useSession();
  const loading = status === "loading";
  // This is kind of a stupid way to do this, but I want to update the variables every time we run code...
  const [runCount, setRunCount] = useState(0);
  const onCodeRan = () => {
    console.log("Ran your code!");
    setRunCount(runCount+1);
  };

  const handleClick = (e) => {
    setCurrMenu(e.key);
  };

  const loadContent = () => {
    switch (currMenu) {
      case "inlets":
        return <Inlet onCodeRan={onCodeRan} />;
      case "outlets":
        return <Outlet />;
      case "scheduled":
        return <Scheduled runCount={runCount} />
      case "user":
        return <User />;
      case "variable":
        return <Variable runCount={runCount}/>;
      case "log":
        return <Event />;
      default:
        return <p>users</p>;
    }
  };

  if (session) {
    return (
      <>
        <Row>
          <Col span={14}>
            <Menu mode="horizontal">
              <Menu.Item key="outlets" icon={<AppstoreOutlined />}>
                Inlets
              </Menu.Item>
            </Menu>
          </Col>
          <Col span={10}>
            <Menu
              onClick={handleClick}
              selectedKeys={[currMenu]}
              mode="horizontal"
            >
              <Menu.Item key="outlets" icon={<AppstoreOutlined />}>
                Outlets
              </Menu.Item>
              <Menu.Item key="variable" icon={<CalculatorOutlined />}>
                States
              </Menu.Item>
              <Menu.Item key="scheduled" icon={<ClockCircleOutlined />}>
                Scheduled
              </Menu.Item>
              <Menu.Item key="log" icon={<CalendarOutlined />}>
                Log
              </Menu.Item>
              <Menu.Item key="user" icon={<UserOutlined />}>
                User
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
        <Row>
          <Col span={14}>
            <Inlet onCodeRan={onCodeRan} />
          </Col>
          <Col span={10}> {loadContent()}</Col>
        </Row>
      </>
    );
  } else {
    return (
      <Alert
        description="You are not signed in! Please sign in to use the app!"
        type="warning"
        showIcon
        action={
          <Button size="small" type="primary" onClick={() => signIn()}>
            Sign In
          </Button>
        }
      />
    );
  }
}
