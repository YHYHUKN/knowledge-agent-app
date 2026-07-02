"use client";

import { useEffect, useState, useCallback } from "react";
import { Row, Col, Typography, Button, Space, Tag, FloatButton } from "antd";
import { PlusOutlined, RobotOutlined, SearchOutlined, FileTextOutlined } from "@ant-design/icons";
import { KnowledgeAsset, AgentTrace } from "@/lib/types";
import { AssetList } from "@/components/app/asset-list";
import { AssetFormDialog } from "@/components/app/asset-form-dialog";
import { ChatPanel } from "@/components/app/chat-panel";
import { VisualizationPanels } from "@/components/app/visualization-panels";
import { loadAssets, saveAssets } from "@/lib/client-storage";

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

  /* 加载资产列表：优先读 localStorage（无闪烁），后台静默同步 API */
  const syncFromApi = useCallback(async () => {
    try {
      const res = await fetch("/api/assets");
      const data = await res.json();
      const apiAssets: KnowledgeAsset[] = data.assets ?? [];
      // API 数据覆盖到 localStorage，保持一致性（清除本地脏数据）
      saveAssets(apiAssets);
      setAssets(apiAssets);
    } catch {
      // API 失败时，保留本地 localStorage 数据（不覆盖）
    }
  }, []);

  useEffect(() => {
    // 第一步：立即从 localStorage 读取（同步，无闪烁）
    const cached = loadAssets();
    setAssets(cached);
    setLoading(cached.length === 0); // 有缓存时不显示骨架屏

    // 第二步：后台从 API 同步（异步，失败不影响已有数据）
    syncFromApi().finally(() => setLoading(false));
  }, [syncFromApi]);

  /* 新增资产回调：立即写入 localStorage，刷新列表，同步调用 API */
  const handleAssetCreated = () => {
    setFormOpen(false);
    syncFromApi(); // API 返回后会自动写入 localStorage
  };

  /* 发送消息回调 */
  const handleSend = async (query: string) => {
    const res = await fetch("/api/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error ?? `请求失败 (${res.status})`);
    }
    const json = await res.json();
    // 调试：确认接口返回的 trace 结构
    console.log("[handleSend] query:", query, "=> trace:", JSON.stringify(json.trace?.finalAnswer)?.slice(0, 80));
    return json;
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
                {assets.length}条记录 · localStorage 持久化
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
            onRefresh={syncFromApi}
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
