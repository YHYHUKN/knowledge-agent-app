"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Input, Button, Space, Typography, Tag, Empty, Spin } from "antd";
import { SendOutlined, SearchOutlined, RobotOutlined, FileTextOutlined, InboxOutlined } from "@ant-design/icons";
import { AgentTrace } from "@/lib/types";
import { TracePanel } from "@/components/app/trace-panel";

const { Text, Paragraph } = Typography;

interface ChatEntry {
  id: string;
  query: string;
  trace: AgentTrace;
  streaming?: boolean;
  streamedAnswer?: string;
}

interface ChatPanelProps {
  hasAssets: boolean;
  chatHistory: ChatEntry[];
  onSend: (query: string) => Promise<{ trace: AgentTrace }>;
  onHistoryChange: React.Dispatch<React.SetStateAction<ChatEntry[]>>;
}

export function ChatPanel({ hasAssets, chatHistory, onSend, onHistoryChange }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* 自动滚动到底部 */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  /* 发送消息 */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || sending) return;

    setInput("");
    setSending(true);

    const entryId = Date.now().toString();
    const newEntry: ChatEntry = { id: entryId, query, trace: null as any, streaming: true, streamedAnswer: "" };
    const updated = [...chatHistory, newEntry];
    onHistoryChange(updated);

    try {
      const { trace } = await onSend(query);
      const finalEntry: ChatEntry = { id: entryId, query, trace, streaming: true, streamedAnswer: trace.finalAnswer };
      onHistoryChange(updated.map((e) => (e.id === entryId ? finalEntry : e)));
      // 打字光效：先出内容，光标延迟消失（视觉上像在打字，实为即时响应）
      setTimeout(() => {
        onHistoryChange((prev) =>
          prev.map((entry) =>
            entry.id === entryId ? { ...entry, streaming: false } : entry
          )
        );
      }, 600);
    } catch {
      const errEntry: ChatEntry = {
        id: entryId,
        query,
        trace: {
          query,
          retrievedAssets: [],
          finalAnswer: "抱歉，服务暂时不可用，请稍后重试。",
          references: [],
          createdAt: new Date().toISOString(),
          grounded: false,
        },
        streaming: false,
      };
      onHistoryChange(updated.map((e) => (e.id === entryId ? errEntry : e)));
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 240px)",
        minHeight: 480,
        borderRadius: 12,
        border: "1px solid #E5E6EB",
        background: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* 对话消息区 */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {!hasAssets && chatHistory.length === 0 && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text style={{ fontSize: 14, color: "#86909C", display: "block", marginBottom: 8 }}>
                    暂无对话记录
                  </Text>
                  <Text style={{ fontSize: 12, color: "#BCC1CC" }}>
                    先添加知识资产，再发起提问
                  </Text>
                </div>
              }
            />
          </div>
        )}

        {chatHistory.map((entry) => (
          <div key={entry.id} style={{ animation: "slide-up 0.3s ease both" }}>
            {/* 用户提问气泡 */}
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
              <div
                style={{
                  maxWidth: "85%",
                  borderRadius: 12,
                  borderTopLeftRadius: 2,
                  background: "#F2F3F5",
                  padding: "12px 16px",
                }}
              >
                <Space size={6} style={{ marginBottom: 6 }}>
                  <SearchOutlined style={{ fontSize: 13, color: "#86909C" }} />
                  <Text style={{ fontSize: 11, color: "#86909C", fontWeight: 500 }}>Q</Text>
                </Space>
                <Text style={{ fontSize: 14, color: "#1D2129", lineHeight: 1.6 }}>{entry.query}</Text>
              </div>
            </div>

            {/* AI 回答气泡 */}
            {entry.trace && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    maxWidth: "90%",
                    width: "100%",
                    borderRadius: 12,
                    borderTopRightRadius: 2,
                    background: "linear-gradient(135deg, #F0F5FF 0%, #FFFFFF 100%)",
                    border: "1px solid #E8F3FF",
                    borderLeft: "3px solid #165DFF",
                    padding: "16px",
                  }}
                >
                  <Space size={6} style={{ marginBottom: 8 }}>
                    <RobotOutlined style={{ fontSize: 13, color: "#165DFF" }} />
                    <Text style={{ fontSize: 11, color: "#165DFF", fontWeight: 500 }}>Agent</Text>
                  </Space>

                  {/* 加载中 */}
                  {!entry.streamedAnswer && entry.streaming && (
                    <Spin size="small" style={{ display: "block" }} />
                  )}

                  {/* 流式打字输出 */}
                  {(entry.streamedAnswer || (!entry.streaming && entry.trace)) && (
                    <Paragraph
                      style={{
                        fontSize: 14,
                        color: "#4E5969",
                        lineHeight: 1.7,
                        marginBottom: 8,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {entry.streamedAnswer ?? entry.trace.finalAnswer}
                      {entry.streaming && <span className="typing-cursor" />}
                    </Paragraph>
                  )}

                  {/* 引用来源 */}
                  {!entry.streaming && entry.trace.references.length > 0 && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed #E5E6EB" }}>
                      <Space size={4} style={{ marginBottom: 6 }}>
                        <FileTextOutlined style={{ fontSize: 12, color: "#86909C" }} />
                        <Text style={{ fontSize: 11, color: "#86909C" }}>引用来源</Text>
                      </Space>
                      <Space size={6} wrap>
                        {entry.trace.references.map((ref) => (
                          <Tag
                            key={ref.assetId}
                            style={{
                              borderRadius: 6,
                              border: "none",
                              background: "#E8F3FF",
                              color: "#165DFF",
                              fontSize: 11,
                              padding: "1px 8px",
                              cursor: "default",
                            }}
                          >
                            {ref.title}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trace 面板 */}
            {entry.trace && !entry.streaming && (
              <div style={{ marginTop: 12 }}>
                <TracePanel trace={entry.trace} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 底部输入栏 */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #E5E6EB",
          background: "#FAFBFC",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hasAssets ? "输入问题，基于知识库检索生成回答..." : "请先添加知识资产"}
            disabled={!hasAssets || sending}
            prefix={<SearchOutlined style={{ color: "#BCC1CC" }} />}
            suffix={
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={sending}
                disabled={!input.trim() || !hasAssets}
                size="small"
                style={{ borderRadius: 8 }}
              />
            }
            style={{
              borderRadius: 12,
              height: 44,
              fontSize: 14,
            }}
          />
          <div
            style={{
              marginTop: 8,
              textAlign: "center",
              fontSize: 11,
              color: "#BCC1CC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <InboxOutlined style={{ fontSize: 12 }} />
            支持拖拽文件导入知识库
          </div>
        </form>
      </div>
    </div>
  );
}
