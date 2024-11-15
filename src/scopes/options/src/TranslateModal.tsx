import React, { useEffect, useRef, useState } from "react";
import { Modal, Input, Button, Space, App, InputRef } from "antd";
import { schema, SchemaType } from "@/schema";
import { useStorageLocal } from "@webextkits/storage-local";

interface TranslateModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

const { getBucket } = useStorageLocal<SchemaType>(schema);

const TranslateModal: React.FC<TranslateModalProps> = ({ show, setShow }) => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const TextAreaRef = useRef<InputRef>(null);

  useEffect(() => {
    if (show && TextAreaRef.current) {
      TextAreaRef.current.focus();
    }
  }, [show, TextAreaRef.current]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (window.command === "translate") {
        setShow(true);
        setTimeout(() => {
          TextAreaRef.current?.focus();
        }, 500);
        window.command = "";
      }
    }, 400);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  // 处理API请求
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      message.warning("请输入搜索内容");
      return;
    }

    setLoading(true);
    try {
      // 这里替换为实际的API请求
      const response = await getTranslate(value);
      setSuggestion(response);
    } catch (error) {
      message.error(`请求失败，请重试: ${error}`);
      console.error("API request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理复制功能
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("复制成功");
    } catch (err) {
      message.error("复制失败");
      console.error("Copy failed:", err);
    }
  };

  // 处理输入框回车
  const handleKeyPress = () => {
    handleSearch(searchValue);
  };

  // 处理模态框关闭
  const handleClose = () => {
    setShow(false);
    setSearchValue("");
    setSuggestion("");
  };

  return (
    <>
      <Modal
        title="翻译成英文"
        open={show}
        onCancel={handleClose}
        footer={null}
        width={600}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Input.TextArea
            ref={TextAreaRef}
            placeholder="请输入要翻译的内容，按回车继续"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleKeyPress}
            disabled={loading}
            autoSize={{
              maxRows: 4,
              minRows: 4,
            }}
            size={"large"}
          />

          {suggestion.length > 0 && (
            <div onClick={() => handleCopy(suggestion)}>{suggestion}</div>
          )}
        </Space>
      </Modal>
      <Button onClick={() => setShow(true)}>翻译弹框</Button>
    </>
  );
};

export default TranslateModal;

async function getTranslate(text: string) {
  const config = await getBucket("config");

  return new Promise<string>((res, rej) => {
    const controller = new AbortController();
    const signal = controller.signal;

    text = text.slice(0, 5000);
    const apiLink = `https://api.openai.com/v1/chat/completions`;

    fetch(apiLink, {
      signal: signal,
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
        Authorization: `Bearer ${config.chatGPTAPIToken}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Your task is to translate all sentences from their original language into English (US).\n\n please return the data in a json.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        stream: false,
        response_format: {
          type: "json_object",
        },
      }),
    })
      .then((_res) => _res.json())
      .then((_res) => {
        if (_res?.choices?.[0]?.message?.content) {
          const filteredRes = JSON.parse(
            _res.choices[0].message.content.trim(),
          );

          //  有时候 chatgpt 会返回一个数组，有时候会返回一个 json 里面第一个 key 包含了一个数组结果
          const filteredResArr = Array.isArray(filteredRes)
            ? filteredRes
            : filteredRes[Object.keys(filteredRes)[0]];

          res(filteredResArr);
        } else {
          if (_res?.error?.message) {
            if (_res.error.code === "invalid_api_key") {
              throw new Error(`ChatGPT API Key Incorrect`);
            } else {
              throw new Error("ChatGPT " + _res.error.message);
            }
          }
          throw new Error("ChatGPT API Request Failed code:5821");
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
        } else {
          rej("ChatGPT API Request Failed code:9923");
        }
      });
  });
}
