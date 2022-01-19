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
} from "@ant-design/icons";
const { SubMenu } = Menu;
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import User from "../lib/user";
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
        return <p>inlets</p>;
        break;
      case "user":
        return <User />;
        break;
      default:
        return <p>users</p>;
        break;
    }
  };
  return (
    <>
      {!session && (
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
      )}
      <Menu onClick={handleClick} selectedKeys={[currMenu]} mode="horizontal">
        <Menu.Item key="inlets" icon={<MailOutlined />}>
          Inlets
        </Menu.Item>
        <Menu.Item key="outlets" icon={<AppstoreOutlined />}>
          Outlets
        </Menu.Item>

        <Menu.Item key="variable" icon={<CalculatorOutlined />}>
          Variable
        </Menu.Item>
        <Menu.Item key="user" icon={<UserOutlined />}>
          User
        </Menu.Item>
      </Menu>
      {loadContent()}
    </>
  );
}
