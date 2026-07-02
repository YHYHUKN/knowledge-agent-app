"use client";

import { Card, Space, Typography, Tag, Tooltip } from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { AgentTrace } from "@/lib/types";

const { Text } = Typography;

/* 相似度进度条 */
function ScoreBar({ score, label }: { score: number; label: string }) {
  const pct = Math.round(score * 100);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 8,
        background: score >= 0.08 ? "#F0FFF4" : "#FFF7F0",
        border: `1px solid ${score >= 0.08 ? "#D9F7E9" : "#FFE7D4"}`,
      }}
    >
      <Text style={{ fontSize: 12, color: "#4E5969", flexShrink: 0, maxWidth: 100 }} ellipsis>
        {label}
      </Text>
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "#F0F2F5",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 3,
              background: score >= 0.08
                ? "linear-gradient(90deg, #00B42A, #52C41A)"
                : "linear-gradient(90deg, #FF7D00, #FFA940)",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
      <Tooltip title={`相似度分数: ${score.toFixed(4)}`}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: score >= 0.08 ? "#00B42A" : "#FF7D00",
            fontFamily: "ui-monospace, monospace",
            minWidth: 40,
            textAlign: "right",
          }}
        >
          {score.toFixed(2)}
        </Text>
      </Tooltip>
    </div>
  );
}

/* 流动连接线 */
function FlowConnector() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
      <div
        className="flow-line"
        style={{
          width: 2,
          height: 24,
          borderRadius: 1,
        }}
      />
    </div>
  );
}

/* 步骤节点 */
function StepNode({
  icon,
  label,
  detail,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  detail?: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <Text strong style={{ fontSize: 13, display: "block" }}>
          {label}
        </Text>
        {detail && (
          <Text style={{ fontSize: 11, color: "#86909C" }}>{detail}</Text>
        )}
      </div>
    </div>
  );
}

export function TracePanel({ trace }: { trace: AgentTrace }) {
  const hasResults = trace.retrievedAssets.length > 0;

  return (
    <Card
      size="small"
      style={{ borderRadius: 12, background: "#FAFBFC" }}
      styles={{ body: { padding: 16 } }}
    >
      <Space size={4} style={{ marginBottom: 12 }}>
        <ThunderboltOutlined style={{ fontSize: 13, color: "#165DFF" }} />
        <Text strong style={{ fontSize: 13, color: "#1D2129" }}>
          Agent Trace · 审计链路
        </Text>
      </Space>

      {/* 用户提问 */}
      <StepNode
        icon={<SearchOutlined style={{ fontSize: 16 }} />}
        label="用户提问"
        detail={`"${trace.query}"`}
        color="#165DFF"
      />

      <FlowConnector />

      {/* 检索阶段 */}
      <StepNode
        icon={<FileTextOutlined style={{ fontSize: 16 }} />}
        label="向量检索"
        detail={`匹配 ${trace.retrievedAssets.length} 条文档`}
        color="#722ED1"
      />

      {/* 检索结果详情 */}
      {hasResults && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6, paddingLeft: 48 }}>
          {trace.retrievedAssets.map((result) => (
            <ScoreBar key={result.assetId} score={result.score} label={result.title} />
          ))}
        </div>
      )}

      {!hasResults && (
        <div style={{ marginTop: 10, paddingLeft: 48 }}>
          <Tag
            style={{
              borderRadius: 6,
              border: "none",
              background: "#FFECEC",
              color: "#F53F3F",
              fontSize: 12,
            }}
          >
            <CloseCircleOutlined /> 无匹配文档
          </Tag>
        </div>
      )}

      <FlowConnector />

      {/* 生成阶段 */}
      <StepNode
        icon={<ThunderboltOutlined style={{ fontSize: 16 }} />}
        label="模型生成"
        detail={hasResults ? "基于 Top-3 检索片段生成回答" : "无可用片段，提示用户补充知识"}
        color="#00B42A"
      />

      {/* 回答摘要 */}
      <div style={{ marginTop: 10, paddingLeft: 48, display: "flex", alignItems: "flex-start", gap: 6 }}>
        <CheckCircleOutlined style={{ fontSize: 13, color: "#00B42A", marginTop: 2 }} />
        <div
          style={{
            fontSize: 12,
            color: "#4E5969",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {trace.finalAnswer}
        </div>
      </div>
    </Card>
  );
}
