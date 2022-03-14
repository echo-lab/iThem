import React from "react";
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

function Editor(props) {
  const [code, setCode] = React.useState(props.inlet.code);

  const onSave = (values) => {
    fetch(
      `/api/inlets/update?code=${code}&id=${props.inlet._id}`,
      {
        method: "POST",
      }
    )
      .then((res) => {
        message.success("Operation Success");
      })
      .catch((error) => {
        message.error("Operation Failed");
      });
  };

  return (
    <div>
      <Button onClick={()=>{console.log(props.inlet.code); eval("alert(`test`)")}}>Run</Button>
      <Button onClick={() => {onSave();}}>Save</Button>
      <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code."
        onChange={(evn) => setCode(evn.target.value)}
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
