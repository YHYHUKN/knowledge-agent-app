"use client";

import { Card, Tag, Skeleton, Empty, Typography, Space, Button } from "antd";
import { FileTextOutlined, PlusOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { KnowledgeAsset } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const { Text, Paragraph } = Typography;

/* 标签配色映射 */
const tagColorMap: Record<string, { bg: string; color: string }> = {
  可观测: { bg: "#D6E8FF", color: "#165DFF" },
  可观测性: { bg: "#D6E8FF", color: "#165DFF" },
  权限: { bg: "#E9E5FF", color: "#722ED1" },
  权限控制: { bg: "#E9E5FF", color: "#722ED1" },
  Trace: { bg: "#D9F7E9", color: "#00B42A" },
};

function getTagStyle(tag: string) {
  return tagColorMap[tag] ?? { bg: "#F0F2F5", color: "#86909C" };
}

/* 单条资产卡片 */
function AssetCard({
  asset,
  index,
}: {
  asset: KnowledgeAsset;
  index: number;
}) {
  return (
    <div
      className="vector-dot-pattern"
      style={{
        animation: `slide-up 0.3s ease both`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <Card
        hoverable
        style={{
          borderRadius: 12,
          border: "1px solid #E5E6EB",
          transition: "all 0.25s ease",
          cursor: "pointer",
        }}
        styles={{ body: { padding: 20 } }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-2px)";
          el.style.boxShadow = "0 3px 12px rgba(22, 93, 255, 0.12)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        }}
      >
        {/* 卡片头部：标题 + 时间 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <Text
            strong
            style={{
              fontSize: 15,
              color: "#1D2129",
              lineHeight: 1.4,
              flex: 1,
              transition: "color 0.2s ease",
            }}
            className="card-title-hover"
          >
            {asset.title}
          </Text>
          <Space size={4} style={{ flexShrink: 0, marginLeft: 12 }}>
            <ClockCircleOutlined style={{ fontSize: 11, color: "#86909C" }} />
            <Text style={{ fontSize: 11, color: "#86909C", whiteSpace: "nowrap" }}>
              {formatDateTime(asset.createdAt)}
            </Text>
          </Space>
        </div>

        {/* 正文描述 */}
        <Paragraph
          style={{
            fontSize: 14,
            color: "#4E5969",
            lineHeight: 1.7,
            marginBottom: 16,
          }}
          ellipsis={{ rows: 3 }}
        >
          {asset.content}
        </Paragraph>

        {/* 底部标签行 */}
        <Space size={6} wrap>
          {asset.tags.map((tag) => {
            const style = getTagStyle(tag);
            return (
              <Tag
                key={tag}
                style={{
                  borderRadius: 6,
                  border: "none",
                  background: style.bg,
                  color: style.color,
                  fontSize: 12,
                  padding: "1px 10px",
                  margin: 0,
                }}
              >
                {tag}
              </Tag>
            );
          })}
        </Space>
      </Card>
    </div>
  );
}

/* 骨架屏 */
function AssetSkeleton() {
  return (
    <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 20 } }}>
      <Skeleton active paragraph={{ rows: 3 }} />
    </Card>
  );
}

/* 空状态 */
function AssetEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <Card style={{ borderRadius: 12, textAlign: "center", padding: "48px 24px" }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <Text style={{ fontSize: 14, color: "#86909C", display: "block", marginBottom: 8 }}>
              暂无知识资产
            </Text>
            <Text style={{ fontSize: 12, color: "#BCC1CC" }}>
              点击下方按钮添加第一条知识资产
            </Text>
          </div>
        }
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd} style={{ borderRadius: 12 }}>
          新增资产
        </Button>
      </Empty>
    </Card>
  );
}

interface AssetListProps {
  assets: KnowledgeAsset[];
  loading: boolean;
  onRefresh: () => void;
}

export function AssetList({ assets, loading, onRefresh }: AssetListProps) {
  if (loading) {
    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {[1, 2, 3].map((i) => (
          <AssetSkeleton key={i} />
        ))}
      </Space>
    );
  }

  if (assets.length === 0) {
    return <AssetEmpty onAdd={onRefresh} />;
  }

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      {assets.map((asset, i) => (
        <AssetCard key={asset.id} asset={asset} index={i} />
      ))}
    </Space>
  );
}
