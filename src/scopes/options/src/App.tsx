import { useState } from "react";
import { ConfigProvider, theme, App as AntdApp, Button, Space } from "antd";
import "antd/dist/reset.css";
import APITokenForm from "@/scopes/options/src/Config";
import NamingModal from "@/scopes/options/src/NamingModal";
import TranslateModal from "@/scopes/options/src/TranslateModal";
import "./index.less";

export function App() {
  const [showNamingModal, setShowNamingModal] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      <AntdApp>
        <div
          style={{
            margin: "0 auto",
            maxWidth: 600,
            paddingTop: 24,
            paddingBottom: 24,
          }}
        >
          <Space
            direction={"vertical"}
            size={24}
            style={{
              width: "100%",
            }}
          >
            <APITokenForm />

            <Space>
              <NamingModal
                show={showNamingModal}
                setShow={setShowNamingModal}
              />
              <TranslateModal show={showTranslate} setShow={setShowTranslate} />
            </Space>
          </Space>
        </div>
      </AntdApp>
    </ConfigProvider>
  );
}
