"use client";

import { useEffect, useState, useCallback } from "react";
import { Row, Col, Typography, Button, Space, Tag, FloatButton } from "antd";
import { PlusOutlined, RobotOutlined, SearchOutlined, FileTextOutlined } from "@ant-design/icons";
import { KnowledgeAsset, AgentTrace } from "@/lib/types";
import { AssetList } from "@/components/app/asset-list";
import { AssetFormDialog } from "@/components/app/asset-form-dialog";
import { ChatPanel } from "@/components/app/chat-panel";
import { VisualizationPanels } from "@/components/app/visualization-panels";

const { Title, Text } = Typography;

export interface ChatEntry {
  id: string;
  query: string;
  trace: AgentTrace;
  streaming?: boolean;
  streamedAnswer?: string;
}

export function Workbench() {
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);

  /* 加载资产列表 */
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assets");
      const data = await res.json();
      setAssets(data.assets ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  /* 新增资产回调 */
  const handleAssetCreated = () => {
    setFormOpen(false);
    fetchAssets();
  };

  /* 发送消息回调 */
  const handleSend = async (query: string) => {
    const res = await fetch("/api/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    return res.json();
  };

  return (
    <>
      {/* 主内容双栏布局 */}
      <Row gutter={[24, 24]}>
        {/* 左栏：知识资产 */}
        <Col xs={24} lg={14}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Space size={8} align="center">
              <Title
                level={4}
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1D2129",
                }}
              >
                <FileTextOutlined style={{ color: "#165DFF", marginRight: 8 }} />
                知识资产
              </Title>
              <Text style={{ fontSize: 12, color: "#86909C" }}>
                {assets.length}条记录 · 内存存储
              </Text>
            </Space>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setFormOpen(true)}
              className="desktop-only"
              style={{
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              新增
            </Button>
          </div>

          <AssetList
            assets={assets}
            loading={loading}
            onRefresh={fetchAssets}
          />
        </Col>

        {/* 右栏：Agent 问答 */}
        <Col xs={24} lg={10}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Space direction="vertical" size={0}>
              <Title
                level={4}
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1D2129",
                }}
              >
                <RobotOutlined style={{ color: "#165DFF", marginRight: 8 }} />
                Agent 问答
              </Title>
              <Text style={{ fontSize: 12, color: "#86909C" }}>
                基于检索结果生成 · 不凭空编造
              </Text>
            </Space>

            <Tag
              style={{
                borderRadius: 6,
                border: "none",
                color: "#165DFF",
                background: "#E8F3FF",
              }}
            >
              <SearchOutlined style={{ marginRight: 4 }} />
              RAG
            </Tag>
          </div>

          <ChatPanel
            hasAssets={assets.length > 0}
            chatHistory={chatHistory}
            onSend={handleSend}
            onHistoryChange={setChatHistory}
          />
        </Col>
      </Row>

      {/* 折叠式特色可视化面板 */}
      <VisualizationPanels />

      {/* 新增资产弹窗 */}
      <AssetFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={handleAssetCreated}
      />

      {/* 移动端悬浮新增按钮 */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        tooltip="新增知识资产"
        onClick={() => setFormOpen(true)}
        className="mobile-only-float"
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(22, 93, 255, 0.25)",
        }}
      />
    </>
  );
}
