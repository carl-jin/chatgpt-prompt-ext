import React, { useEffect, useRef, useState } from "react";
import { Modal, Input, Button, Space, App, InputRef } from "antd";
import { schema, SchemaType } from "@/schema";
import { CopyOutlined, LoadingOutlined } from "@ant-design/icons";
import { useStorageLocal } from "@webextkits/storage-local";

interface NamingModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

const { getBucket } = useStorageLocal<SchemaType>(schema);

const NamingModal: React.FC<NamingModalProps> = ({ show, setShow }) => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const InputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (show && InputRef.current) {
      InputRef.current.focus();
    }
  }, [show, InputRef.current]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (window.command === "naming_variable") {
        setShow(true);
        setTimeout(() => {
          InputRef.current?.focus();
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
      const response = await getNamingSuggestions(value);
      setSuggestions(response);
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
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchValue);
    }
  };

  // 处理模态框关闭
  const handleClose = () => {
    setShow(false);
    setSearchValue("");
    setSuggestions([]);
  };

  return (
    <>
      <Modal
        title="命名建议"
        open={show}
        onCancel={handleClose}
        footer={null}
        width={600}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Input
            placeholder="请输入关键词，按回车继续"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            suffix={loading && <LoadingOutlined />}
            size={"large"}
            ref={InputRef}
          />

          {suggestions.length > 0 && (
            <Space size={12} direction={"vertical"}>
              {suggestions.map((suggestion, index) => (
                <Button
                  size={"large"}
                  key={index}
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </Space>
          )}
        </Space>
      </Modal>
      <Button onClick={() => setShow(true)}>命名弹框</Button>
    </>
  );
};

export default NamingModal;

async function getNamingSuggestions(text: string) {
  const config = await getBucket("config");

  return new Promise<string[]>((res, rej) => {
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
            content: `As an experienced programmer with strong code standards, I need your help naming variables and methods. I will provide descriptions in Chinese explaining the functionality of each variable or method. Based on these descriptions, please suggest 3 appropriate English names using camelCase. \n\n please return the data in a json array like ["name1", "name2", ...]`,
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

          res(
            typeof filteredResArr === "string"
              ? [filteredResArr]
              : filteredResArr,
          );
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
