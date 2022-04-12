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
  Card,
  Avatar,
} from "antd";
const { Meta } = Card;
import { useSession, signIn, signOut } from "next-auth/react";

export default function User() {
  const { data: session, status } = useSession();
  if (session)
    return (
      <Row>
        <Col span={7}></Col>
        <Col span={10}>
          <Card bordered={false}>
            <Meta title={session.user.name} description={session.user.email} />
          </Card>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </Col>
        <Col span={7}></Col>
      </Row>
    );
  else return <p>You Have not Signed In!</p>;
}
