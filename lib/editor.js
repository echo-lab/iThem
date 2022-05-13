import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
import { Space, Button, message, Typography } from "antd";

import { CaretRightOutlined, SaveOutlined } from "@ant-design/icons";
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
  const [outlets, setoutlets] = useState([]);
  const [data, setData] = useState();

  useEffect(() => {
    setCode(props.inlet.code);
  }, [props.inlet.code]);

  useEffect(() => {
    fetchVariable();
  }, []);

  useEffect(() => {
    fetchOutlets();
  }, []);

  const onSave = (values) => {
    const encoded = code.replace("+", "%2B");
    fetch(`/api/inlets/update?code=${encoded}&id=${props.inlet._id}`, {
      method: "POST",
    })
      .then((res) => {
        message.success("Inlet Code Save Success");
      })
      .catch((error) => {
        message.error("Inlet Code Save Failed");
      });
    props.fetchinlet();
    props.inlet.code = code;
  };

  const fetchVariable = async (query) => {
    if (session) {
      const req = await fetch(`/api/var?email=${session.user.email}`);
      const data = await req.json();
      setVariable(data.message);
    }
  };

  const fetchOutlets = async (query) => {
    if (session) {
      const req = await fetch(`/api/outlets?email=${session.user.email}`);
      const data = await req.json();
      setoutlets(data.message);
    }
  };

  const handleInletLog = () => {
    const msg = "Inlet Ran Manually From Code Editor";
    const type = "inlet";
    fetch(
      `/api/events/create?email=${session.user.email}&name=${props.inlet.name}&note=${msg}&type=${type}`,
      {
        method: "POST",
      }
    );
  };

  return (
    <div>
      <Space>
        <Button
          disabled={!props.inlet.name}
          onClick={() => {
            onSave();
            fetch(
              `/api/ifttt/v1/actions/trigger_a_inlet?email=${session.user.email}`,
              {
                method: "POST",
                body: JSON.stringify({
                  actionFields: {
                    inlet: props.inlet.name,
                    data: data,
                  },
                }),
              }
            ).then((res) =>
              res.status == 200
                ? message.success("Inlet Executed Successfully")
                : message.error("Inlet Execution Failed")
            );
            handleInletLog();
          }}
          type="primary"
        >
          <CaretRightOutlined /> Run
        </Button>
        <Button
          disabled={!props.inlet.name}
          onClick={() => {
            onSave();
          }}
          type="primary"
        >
          <SaveOutlined /> Save My Code
        </Button>
      </Space>
      <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code. //const data = '...'"
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
      <Typography.Title level={5} style={{ margin: 2 }}>
        Data Attachment
      </Typography.Title>
      <CodeEditor
        value={data}
        language="js"
        placeholder="// {'field':'some data'}"
        onChange={(evn) => {
          setData(evn.target.value);
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
