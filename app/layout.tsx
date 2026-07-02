"use client";

import { ConfigProvider, theme, Layout, Space, Tag, Dropdown, Avatar, Badge, Button, Tooltip } from "antd";
import {
  DatabaseOutlined,
  SunOutlined,
  MoonOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import "./globals.css";

const { Header } = Layout;

const userMenuItems: MenuProps["items"] = [
  { key: "settings", icon: <SettingOutlined />, label: "账号设置" },
  { type: "divider" },
  { key: "logout", icon: <LogoutOutlined />, label: "退出登录" },
];

const lightTokens = {
  colorPrimary: "#165DFF",
  colorPrimaryHover: "#4080FF",
  colorPrimaryBg: "#E8F3FF",
  borderRadius: 12,
  borderRadiusSM: 6,
  borderRadiusLG: 16,
  fontFamily: `Inter, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif`,
  fontSize: 14,
  fontSizeLG: 16,
  fontSizeXL: 20,
  colorBgContainer: "#FFFFFF",
  colorBgLayout: "#F7F8FA",
  colorText: "#1D2129",
  colorTextSecondary: "#4E5969",
  colorTextTertiary: "#86909C",
  colorBorder: "#E5E6EB",
  colorBorderSecondary: "#E5E6EB",
  colorSuccess: "#00B42A",
  colorWarning: "#FF7D00",
  colorError: "#F53F3F",
  colorInfo: "#165DFF",
  controlHeight: 36,
  controlHeightLG: 44,
  controlHeightSM: 28,
  lineHeight: 1.5715,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  boxShadowSecondary: "0 3px 12px rgba(22, 93, 255, 0.12)",
  wireframe: false,
};

const darkTokens = {
  colorPrimary: "#4080FF",
  colorPrimaryHover: "#5C9AFF",
  colorPrimaryBg: "#1A2D5A",
  borderRadius: 12,
  borderRadiusSM: 6,
  borderRadiusLG: 16,
  fontFamily: `Inter, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif`,
  fontSize: 14,
  fontSizeLG: 16,
  fontSizeXL: 20,
  colorBgContainer: "#23272E",
  colorBgLayout: "#15171A",
  colorText: "#C9CDD4",
  colorTextSecondary: "#86909C",
  colorTextTertiary: "#6B7685",
  colorBorder: "#323842",
  colorBorderSecondary: "#323842",
  colorSuccess: "#00B42A",
  colorWarning: "#FF7D00",
  colorError: "#F53F3F",
  colorInfo: "#4080FF",
  controlHeight: 36,
  controlHeightLG: 44,
  controlHeightSM: 28,
  lineHeight: 1.5715,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  boxShadowSecondary: "0 3px 12px rgba(22, 93, 255, 0.12)",
  wireframe: false,
};

function AppHeader() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Header
      style={{
        height: 64,
        padding: "0 24px",
        background: isDark
          ? "linear-gradient(135deg, #1a1e26 0%, #1d2230 100%)"
          : "linear-gradient(135deg, #f0f5ff 0%, #ffffff 100%)",
        borderBottom: `1px solid ${isDark ? "#323842" : "#E5E6EB"}`,
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* 左侧：品牌标识 */}
      <Space size={12} align="center" style={{ flexShrink: 0 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#165DFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DatabaseOutlined style={{ fontSize: 20, color: "#fff" }} />
        </div>
        <div style={{ lineHeight: 1.3 }} className="desktop-only">
          <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#C9CDD4" : "#1D2129" }}>
            知识资产问答工作台
          </div>
          <div style={{ fontSize: 11, color: "#86909C" }}>Knowledge Asset Q&A Workbench</div>
        </div>
        <Space size={6} align="center">
          <span
            className="animate-breathe"
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#00B42A",
            }}
          />
          <span style={{ fontSize: 11, color: "#86909C" }} className="desktop-only">
            在线
          </span>
        </Space>
      </Space>

      <div style={{ flex: 1 }} />

      {/* 右侧：功能区域 */}
      <Space size={16}>
        <Tag
          className="desktop-only"
          style={{
            borderRadius: 6,
            border: "none",
            background: isDark ? "rgba(22,93,255,0.15)" : "#E8F3FF",
            color: "#165DFF",
            fontSize: 12,
            padding: "2px 10px",
          }}
        >
          内存存储 · 单租户演示
        </Tag>

        <Tooltip title={isDark ? "切换亮色模式" : "切换暗色模式"}>
          <Button
            type="text"
            shape="circle"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ color: isDark ? "#C9CDD4" : "#4E5969" }}
            className="touch-safe"
          />
        </Tooltip>

        <Tooltip title="消息通知">
          <Badge dot offset={[-2, 4]}>
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined />}
              style={{ color: isDark ? "#C9CDD4" : "#4E5969" }}
              className="touch-safe"
            />
          </Badge>
        </Tooltip>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar
            style={{ backgroundColor: "#E8F3FF", color: "#165DFF", cursor: "pointer" }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Space>
    </Header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <title>知识资产问答工作台</title>
        <meta name="description" content="基于检索增强生成（RAG）的企业知识资产问答工作台" />
      </head>
      <body>
        <ThemeProvider>
          <ThemeAwareLayout>{children}</ThemeAwareLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

function ThemeAwareLayout({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();

  return (
    <ConfigProvider
      theme={{
        token: isDark ? darkTokens : lightTokens,
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />
        <Layout.Content
          style={{
            padding: "24px",
            maxWidth: 1400,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}
