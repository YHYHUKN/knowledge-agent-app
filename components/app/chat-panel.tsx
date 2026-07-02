"use client";

import { FormEvent, useRef, useEffect, useState } from "react";
import { Bot, ChevronDown, ChevronUp, CornerDownLeft, Sparkles } from "lucide-react";
import { AgentTrace } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Badge } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { TracePanel } from "@/components/app/trace-panel";

/** 单条对话记录 */
interface ChatEntry {
  id: string;
  trace: AgentTrace;
  traceOpen: boolean;
}

/**
 * @component ChatPanel
 * @description Agent 问答面板 —— RAG 链路的交互入口。
 *
 *   交互流程：
 *   1. 输入问题 → POST /api/agent/chat
 *   2. 返回 AgentTrace → 新 ChatEntry 插到列表顶部
 *   3. 每条 entry 展示：问题 → 回答 → 引用 → 可展开 Trace
 *
 *   视觉策略：
 *   - 回答区域左侧用 2px 品牌色竖线区分于用户问题
 *   - 每条 entry 入场时 slide-up + fade-in
 */
export function ChatPanel({ hasAssets }: { hasAssets: boolean }) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 新消息到达时自动滚动到底部
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [entries, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;

    setError(null);
    setLoading(true);
    setQuery("");

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "提问失败，请重试");

      const trace = data.trace as AgentTrace;
      setEntries((prev) => [
        { id: `${Date.now()}`, trace, traceOpen: false },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提问失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  function toggleTrace(id: string) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, traceOpen: !e.traceOpen } : e))
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* ── 面板头部 ── */}
      <div className="border-b border-border-light px-5 py-3.5">
        <h2 className="font-display text-sm font-semibold tracking-tight text-ink-900">
          Agent 问答
        </h2>
        <p className="mt-0.5 text-2xs text-ink-400">
          基于检索结果生成 · 不凭空编造
        </p>
      </div>

      {/* ── 对话列表 ── */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {/* Loading 骨架 */}
        {loading && (
          <div className="rounded-xl border border-border-light bg-surface p-5 animate-slide-up">
            <div className="animate-shimmer mb-3 h-4 w-2/5 rounded" />
            <div className="mb-3 ml-3 border-l-2 border-canvas-muted pl-3">
              <div className="animate-shimmer mb-2 h-3.5 w-full rounded" />
              <div className="animate-shimmer mb-2 h-3.5 w-11/12 rounded" />
              <div className="animate-shimmer h-3.5 w-3/4 rounded" />
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!loading && entries.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon={<Bot size={32} strokeWidth={1.5} />}
              title="开始对话"
              description="输入问题，Agent 会先在知识库中检索相关内容，再基于检索结果生成回答"
            />
          </div>
        )}

        {/* 对话记录 */}
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-xl border border-border-light bg-surface p-5 shadow-card animate-slide-up"
          >
            {/* 用户问题 */}
            <div className="mb-4 flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-canvas-muted">
                <span className="text-2xs font-semibold text-ink-500">Q</span>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-ink-800">
                {entry.trace.query}
              </p>
            </div>

            {/* Agent 回答 —— 左侧品牌色竖线强调 */}
            <div className="relative mb-4 ml-2.5 border-l-2 border-brand/30 bg-brand-soft/30 px-4 py-3">
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">
                {entry.trace.finalAnswer}
              </p>
            </div>

            {/* 引用来源 */}
            {entry.trace.references.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="text-2xs font-medium text-ink-400">
                  引用
                </span>
                {entry.trace.retrievedAssets.map((r) => (
                  <Badge key={r.assetId} tone="brand">
                    {r.title}
                  </Badge>
                ))}
              </div>
            )}

            {/* Trace 切换 */}
            <button
              onClick={() => toggleTrace(entry.id)}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-2xs font-medium text-ink-400 transition-colors hover:bg-canvas-muted hover:text-ink-600"
            >
              {entry.traceOpen ? (
                <ChevronUp size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
              {entry.traceOpen ? "收起" : "Agent Trace"}
            </button>

            {/* Trace 面板 */}
            {entry.traceOpen && (
              <div className="mt-3">
                <TracePanel trace={entry.trace} />
              </div>
            )}
          </article>
        ))}
      </div>

      {/* ── 错误提示 ── */}
      {error && (
        <div className="mx-5 mb-2 rounded-lg border border-danger/20 bg-danger-soft px-4 py-2.5 text-xs text-danger animate-slide-up">
          {error}
        </div>
      )}

      {/* ── 底部输入栏（固定） ── */}
      <div className="border-t border-border-light bg-surface px-5 py-3.5">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              hasAssets
                ? "向知识库提问，例如：Agent 如何协作？"
                : "知识库为空，请先在左侧新增资产"
            }
            disabled={loading}
            className="h-10"
          />
          <Button type="submit" disabled={loading || !query.trim()} size="sm" className="h-10 px-4">
            {loading ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                思考中
              </>
            ) : (
              <>
                <CornerDownLeft size={14} />
                发送
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
