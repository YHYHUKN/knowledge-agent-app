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

/** 格式化日期字符串为 YYYY-MM-DD HH:mm */
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

/* 检索资产卡片：展示完整字段（title + content + tags + createdAt + score） */
function RetrievedAssetCard({
  result,
  rank,
}: {
  result: AgentTrace["retrievedAssets"][number];
  rank: number;
}) {
  const pct = Math.round(result.score * 100);
  const isHighScore = result.score >= 0.08;

  return (
    <div
      style={{
        borderRadius: 8,
        border: `1px solid ${isHighScore ? "#D9F7E9" : "#FFE7D4"}`,
        background: isHighScore ? "#FAFFFE" : "#FFFBF7",
        overflow: "hidden",
      }}
    >
      {/* 卡片头部：标题 + 排名 + 分数 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          borderBottom: `1px solid ${isHighScore ? "#D9F7E9" : "#FFE7D4"}`,
          background: isHighScore ? "#F0FFF4" : "#FFF7F0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: isHighScore ? "#00B42A" : "#FF7D00",
              flexShrink: 0,
            }}
          >
            #{rank}
          </Text>
          <Text
            strong
            style={{
              fontSize: 13,
              color: "#1D2129",
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {result.title}
          </Text>
        </div>
        <Space size={4}>
          <Tooltip title={`相似度分数: ${result.score.toFixed(4)}`}>
            <Tag
              style={{
                borderRadius: 6,
                border: "none",
                fontSize: 11,
                fontWeight: 600,
                color: isHighScore ? "#00B42A" : "#FF7D00",
                background: isHighScore ? "#D9F7E9" : "#FFE7D4",
                margin: 0,
              }}
            >
              {pct}%
            </Tag>
          </Tooltip>
        </Space>
      </div>

      {/* 正文内容（完整展示） */}
      <div style={{ padding: "8px 12px" }}>
        <Text
          style={{
            fontSize: 12,
            color: "#4E5969",
            lineHeight: 1.7,
            display: "block",
            marginBottom: 8,
          }}
        >
          {result.content}
        </Text>

        {/* 底部标签 + 创建时间 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space size={4}>
            {result.tags.map((tag) => (
              <Tag
                key={tag}
                style={{
                  borderRadius: 4,
                  border: "none",
                  background: "#EEF2FF",
                  color: "#4F46E5",
                  fontSize: 11,
                  padding: "0 6px",
                  margin: 0,
                }}
              >
                {tag}
              </Tag>
            ))}
          </Space>
          <Text style={{ fontSize: 11, color: "#BCC1CC" }}>
            {formatDate(result.createdAt)}
          </Text>
        </div>
      </div>

      {/* 分数进度条（始终展示） */}
      <div style={{ padding: "0 12px 8px" }}>
        <div style={{ height: 4, borderRadius: 2, background: "#F0F2F5", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 2,
              background: isHighScore
                ? "linear-gradient(90deg, #00B42A, #52C41A)"
                : "linear-gradient(90deg, #FF7D00, #FFA940)",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
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

      {/* 检索结果详情：展示完整资产字段（title + content + tags + createdAt + score） */}
      {hasResults && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8, paddingLeft: 48 }}>
          {trace.retrievedAssets.map((result, idx) => (
            <RetrievedAssetCard key={result.assetId} result={result} rank={idx + 1} />
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
