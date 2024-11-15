import React, { useEffect } from "react";
import { Form, Input, Button, Card } from "antd";
import { App } from "antd";
import { schema, SchemaType } from "@/schema";
import { KeyOutlined } from "@ant-design/icons";
import { useStorageLocal } from "@webextkits/storage-local";

const { getBucket, updateBucket } = useStorageLocal<SchemaType>(schema);

const APITokenForm = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<{
    chatGPTAPIToken: string;
  }>();

  useEffect(() => {
    getBucket("config").then((res) => {
      form.setFieldValue("chatGPTAPIToken", res.chatGPTAPIToken);
    });
  }, []);

  const onFinish = (values) => {
    updateBucket("config", (bucket) => {
      bucket.chatGPTAPIToken = values.chatGPTAPIToken;
      return bucket;
    }).then((res) => {
      message.success("保存成功！");
    });
  };

  return (
    <Card title="API 配置" size={"small"}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="chatGPTAPIToken"
          label="ChatGPT API Token"
          rules={[
            {
              required: true,
              message: "请输入 API Token",
            },
          ]}
          extra="请输入您的 ChatGPT API Token，它将被安全地存储"
        >
          <Input.Password
            prefix={<KeyOutlined />}
            placeholder="请输入 API Token"
            allowClear
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default APITokenForm;
