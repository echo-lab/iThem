import { Layout, Menu, Typography, Space, Input, Row, Col } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  CalculatorOutlined
} from "@ant-design/icons";
const { SubMenu } = Menu;
import React, { useState } from "react";

export default function Controller() {
  const [currMenu, setCurrMenu] = useState("user");

  const handleClick = (e) => {
    setCurrMenu(e.key);
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[currMenu]} mode="horizontal">
      <Menu.Item key="inlets" icon={<MailOutlined />}>
        Inlets
      </Menu.Item>
      <Menu.Item key="outlets" icon={<AppstoreOutlined />}>
        Outlets
      </Menu.Item>

      <Menu.Item key="variable" icon={<CalculatorOutlined />}>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          Variable
        </a>
      </Menu.Item>

      <Menu.Item key="user"  icon={<UserOutlined />}>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          User
        </a>
      </Menu.Item>
    </Menu>
  );
}
