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
export default function Controller() {
  const [currMenu, setCurrMenu] = useState("user");
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const handleClick = (e) => {
    setCurrMenu(e.key);
  };

  const loadContent = () => {
    switch (currMenu) {
      case "inlets":
        return <Inlet />;
        break;
      case "outlets":
        return <Outlet />;
        break;
      case "user":
        return <User />;
        break;
      case "variable":
        return <Variable />;
        break;
      case "log":
        return <Event />;
        break;
      default:
        return <p>users</p>;
        break;
    }
  };

  if (session) {
    return (
      <>
        <Row>
          <Col span={12}>
            <Menu mode="horizontal">
              <Menu.Item key="outlets" icon={<AppstoreOutlined />}>
                Inlets
              </Menu.Item>
            </Menu>
          </Col>
          <Col span={12}>
            <Menu
              onClick={handleClick}
              selectedKeys={[currMenu]}
              mode="horizontal"
            >
              <Menu.Item key="outlets" icon={<AppstoreOutlined />}>
                Outlets
              </Menu.Item>
              <Menu.Item key="variable" icon={<CalculatorOutlined />}>
                Variable
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
          <Col span={12}>
            <Inlet />
          </Col>
          <Col span={12}> {loadContent()}</Col>
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
