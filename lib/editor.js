import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
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
const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

function Editor(props) {
  const [code, setCode] = useState(props.inlet.code);
  const [variables, setVariable] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    setCode(props.inlet.code);
  }, [props.inlet.code]);

  useEffect(() => {
    fetchVariable();
  }, []);

  const onSave = (values) => {
    const encoded = code.replace("+", "%2B");
    console.log(code);
    console.log(encoded);

    fetch(`/api/inlets/update?code=${encoded}&id=${props.inlet._id}`, {
      method: "POST",
    })
      .then((res) => {
        message.success("Operation Success");
      })
      .catch((error) => {
        message.error("Operation Failed");
      });
    props.fetchinlet();
    props.inlet.code = code;
  };

  const fetchVariable = async (query) => {
    if (session) {
      // setLoading(true);
      const req = await fetch(`/api/var?email=${session.user.email}`);
      const data = await req.json();
      setVariable(data.message);
    }
  };

  const load = (value) => {
    const found = variables.find((elm) => elm.name == value);
    switch (found.type) {
      case "int":
        return +found.value;
      case "double":
        return +found.value;
      case "boolean":
        return found.value == "TRUE";
      default:
        return found.value;
    }
  };

  const save = (value, name) => {
    const found = variables.find((elm) => elm.name == name);
    fetch(`/api/var/update?id=${found._id}&value=${value}`, {
      method: "POST",
    })
      .then((res) => {
        message.success("Success");
      })
      .catch((error) => {
        message.error("Failed");
      });
  };

  return (
    <div>
      <Button
        onClick={() => {
          eval(code);
        }}
      >
        Run
      </Button>
      <Button
        onClick={() => {
          onSave();
        }}
      >
        Save My Code
      </Button>
      <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code."
        onChange={(evn) => {
          setCode(evn.target.value);
        }}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
    </div>
  );
}

export default Editor;
