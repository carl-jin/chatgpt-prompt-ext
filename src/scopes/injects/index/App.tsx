import "./index.less";
import { extId } from "@/const";
import { BackgroundMessageType, InjectMessageType } from "@/messageType";
import { MessagesInstance } from "@webextkits/messages-center/inject";
import { Modal, Space, Button, Input, message } from "antd";
import { useEffect, useState } from "react";

const mc = new MessagesInstance<InjectMessageType, BackgroundMessageType>(
  extId,
  true,
);

export function App() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  useEffect(() => {
    handleReadName();
  }, []);

  async function handleReadName() {
    const name = await mc.send("readUserName");
    setName(name);
  }

  function handleSave() {
    mc.send("setUserName", name).then(() => {
      message.success("保存成功！");
      setOpen(false);
    });
  }

  return (
    <div className={"inject-h1"}>
      <Modal
        open={open}
        title={"请输入你的名称"}
        onOk={() => {
          handleSave();
        }}
        okText={"保存"}
        onCancel={() => setOpen(false)}
      >
        <Space size={12} direction={"vertical"}>
          <Input value={name} onChange={(ev) => setName(ev.target.value)} />
          defines 注入：foo
        </Space>
      </Modal>
      <Button onClick={() => setOpen(true)}>Show</Button>
    </div>
  );
}
