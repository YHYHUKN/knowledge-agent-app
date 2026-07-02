"use client";

import { useState } from "react";
import {
  Card,
  Collapse,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Tooltip,
  Empty,
} from "antd";
import {
  QuestionCircleOutlined,
  SearchOutlined,
  FileTextOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  ShareAltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  EyeOutlined,
  SafetyOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const { Title, Text } = Typography;
const { Panel } = Collapse;

/* ─── Trace 链路时序卡片 ─── */

const traceSteps = [
  { icon: <QuestionCircleOutlined />, label: "用户提问", desc: "接收自然语言问题" },
  { icon: <SearchOutlined />, label: "向量检索", desc: "Embedding 向量相似度召回" },
  { icon: <FileTextOutlined />, label: "文档匹配", desc: "Top-K 文档片段匹配" },
  { icon: <BarChartOutlined />, label: "分数召回", desc: "按相似度阈值筛选" },
  { icon: <ThunderboltOutlined />, label: "模型生成", desc: "基于检索结果生成答案" },
  { icon: <ShareAltOutlined />, label: "引用溯源", desc: "标注来源资产" },
];

function TraceFlowCard() {
  return (
    <Card
      title={
        <Space>
          <ShareAltOutlined style={{ color: "#165DFF" }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>Trace 链路时序</span>
        </Space>
      }
      style={{ borderRadius: 12, borderColor: "#E5E6EB", height: "100%" }}
    >
      <div className="trace-flow">
        <div className="trace-flow-line" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
            zIndex: 1,
          }}
        >
          {traceSteps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 8,
                width: 80,
              }}
            >
              <Tooltip title={step.desc}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    background: "#E8F3FF",
                    color: "#165DFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    boxShadow: "0 2px 6px rgba(22, 93, 255, 0.15)",
                  }}
                >
                  {step.icon}
                </div>
              </Tooltip>
              <Text style={{ fontSize: 11, color: "#4E5969", fontWeight: 500 }}>
                {step.label}
              </Text>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: "#86909C" }}>召回 Top-1 相似度</Text>
            <Text style={{ fontSize: 12, color: "#165DFF", fontWeight: 600 }}>0.82</Text>
          </div>
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
                width: "82%",
                borderRadius: 3,
                background: "linear-gradient(90deg, #165DFF, #4080FF)",
              }}
            />
          </div>
        </div>

        <Tag
          style={{
            borderRadius: 6,
            border: "none",
            color: "#00B42A",
            background: "#D9F7E9",
          }}
        >
          <CheckCircleOutlined /> 已 grounded
        </Tag>
      </div>
    </Card>
  );
}

/* ─── 权限控制矩阵卡片 ─── */

const roles = ["管理员", "普通用户", "只读访客"];
const operations = ["新增资产", "删除资产", "检索资产", "查看 Trace"];

const permissions: Record<string, ("Y" | "N" | "R")[]> = {
  管理员: ["Y", "Y", "Y", "Y"],
  普通用户: ["Y", "N", "Y", "Y"],
  只读访客: ["N", "N", "Y", "R"],
};

const roleColors: Record<string, { bg: string; color: string }> = {
  管理员: { bg: "#D6E8FF", color: "#165DFF" },
  普通用户: { bg: "#E9E5FF", color: "#722ED1" },
  只读访客: { bg: "#D9F7E9", color: "#00B42A" },
};

function PermissionMatrixCard() {
  return (
    <Card
      title={
        <Space>
          <SafetyOutlined style={{ color: "#722ED1" }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>权限控制矩阵</span>
        </Space>
      }
      style={{ borderRadius: 12, borderColor: "#E5E6EB", height: "100%" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px repeat(3, 1fr)",
          gap: 1,
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid #E5E6EB",
        }}
      >
        <div
          style={{
            padding: "10px 12px",
            background: "#F7F8FA",
            fontSize: 12,
            color: "#86909C",
            fontWeight: 500,
          }}
        >
          操作 \ 角色
        </div>
        {roles.map((role) => (
          <div
            key={role}
            style={{
              padding: "10px 12px",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              background: roleColors[role].bg,
              color: roleColors[role].color,
            }}
          >
            {role}
          </div>
        ))}

        {operations.map((op, opIdx) => (
          <>
            <div
              key={op}
              style={{
                padding: "10px 12px",
                background: "#FAFBFC",
                fontSize: 12,
                color: "#4E5969",
                display: "flex",
                alignItems: "center",
              }}
            >
              {op}
            </div>
            {roles.map((role) => {
              const p = permissions[role][opIdx];
              return (
                <div
                  key={`${op}-${role}`}
                  style={{
                    padding: "10px 12px",
                    textAlign: "center",
                    background: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {p === "Y" ? (
                    <CheckCircleOutlined style={{ color: "#00B42A" }} />
                  ) : p === "N" ? (
                    <CloseCircleOutlined style={{ color: "#F53F3F" }} />
                  ) : (
                    <MinusCircleOutlined style={{ color: "#86909C" }} />
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </Card>
  );
}

/* ─── 可观测统计微型图表 ─── */

const chartData = [
  { time: "09:00", calls: 12, latency: 230, recalls: 8 },
  { time: "10:00", calls: 18, latency: 210, recalls: 12 },
  { time: "11:00", calls: 25, latency: 260, recalls: 15 },
  { time: "12:00", calls: 20, latency: 190, recalls: 11 },
  { time: "13:00", calls: 32, latency: 240, recalls: 20 },
  { time: "14:00", calls: 28, latency: 200, recalls: 18 },
  { time: "15:00", calls: 36, latency: 220, recalls: 22 },
];

function ObsMetricsCard() {
  return (
    <Card
      title={
        <Space>
          <LineChartOutlined style={{ color: "#00B42A" }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>可观测统计</span>
        </Space>
      }
      style={{ borderRadius: 12, borderColor: "#E5E6EB", height: "100%" }}
    >
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#86909C" }} axisLine={{ stroke: "#E5E6EB" }} />
            <YAxis tick={{ fontSize: 11, fill: "#86909C" }} axisLine={{ stroke: "#E5E6EB" }} />
            <ReTooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E5E6EB",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="calls"
              name="调用量"
              stroke="#165DFF"
              strokeWidth={2}
              dot={{ r: 3, fill: "#165DFF" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="latency"
              name="检索耗时(ms)"
              stroke="#FF7D00"
              strokeWidth={2}
              dot={{ r: 3, fill: "#FF7D00" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="recalls"
              name="召回文档数"
              stroke="#00B42A"
              strokeWidth={2}
              dot={{ r: 3, fill: "#00B42A" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

/* ─── 主入口：折叠式特色可视化面板 ─── */

export function VisualizationPanels() {
  const [activeKey, setActiveKey] = useState<string | string[]>(["visual"]);

  return (
    <div style={{ marginTop: 24 }}>
      <Collapse
        activeKey={activeKey}
        onChange={(keys) => setActiveKey(keys)}
        style={{ borderRadius: 12, overflow: "hidden", borderColor: "#E5E6EB" }}
        bordered={false}
      >
        <Panel
          header={
            <Space>
              <EyeOutlined style={{ color: "#165DFF" }} />
              <span style={{ fontWeight: 600, fontSize: 15 }}>产品特色可视化</span>
            </Space>
          }
          key="visual"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <TraceFlowCard />
            </Col>
            <Col xs={24} lg={8}>
              <PermissionMatrixCard />
            </Col>
            <Col xs={24} lg={8}>
              <ObsMetricsCard />
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </div>
  );
}
