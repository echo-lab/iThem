import { Layout, Menu, Typography, Space, Input, Row, Col } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import styles from "../styles/Home.module.css";
const { SubMenu } = Menu;
const { Title } = Typography;
import Controller from "../lib/controller"
const { Header, Content, Sider } = Layout;
import "antd/dist/antd.css";

export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <title>iThem</title>
        <Row align="middle">
          <Col span={6}></Col>
          <Col align="middle" span={12}>
            <Title>iThem</Title>
            <p>GENERATING MORE STRUCTURED RULES</p>
            <Controller></Controller>
          </Col>
          <Col span={6}></Col>
        </Row>
      </div>
    </>
  );
}
