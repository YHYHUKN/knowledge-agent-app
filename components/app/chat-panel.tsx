"use client";

import { FormEvent, useState } from "react";
import { Bot, ChevronDown, ChevronUp, Send, Sparkles } from "lucide-react";
import { AgentTrace } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Badge } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { TracePanel } from "@/components/app/trace-panel";

interface ChatEntry {
  id: string;
  trace: AgentTrace;
  traceOpen: boolean;
}

export function ChatPanel({ hasAssets }: { hasAssets: boolean }) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <section className="flex h-full flex-col">
      <div className="px-1 pb-3">
        <h2 className="font-display text-sm font-medium text-ink-900">Agent 问答</h2>
        <p className="text-[12px] text-ink-500">
          回答严格基于检索到的知识资产，未检索到内容时不会编造
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-3 flex gap-2 px-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={hasAssets ? "向知识库提问，例如：Agent 如何协作？" : "知识库为空，请先新增资产"}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !query.trim()}>
          <Send size={15} />
          {loading ? "生成中" : "提问"}
        </Button>
      </form>

      {error && (
        <p className="mx-1 mb-3 rounded-md bg-danger/5 px-3 py-2 text-[13px] text-danger">
          {error}
        </p>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto px-1 pb-1">
        {loading && (
          <Card className="p-3.5">
            <Skeleton className="mb-2 h-3.5 w-1/3" />
            <Skeleton className="mb-1.5 h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </Card>
        )}

        {!loading && entries.length === 0 && (
          <EmptyState
            icon={<Bot size={28} strokeWidth={1.5} />}
            title="还没有提问记录"
            description="输入问题后，Agent 会先检索知识库，再基于检索结果生成回答。"
          />
        )}

        {entries.map((entry) => (
          <Card key={entry.id} className="p-3.5">
            <div className="mb-2 flex items-start gap-2">
              <Sparkles size={14} className="mt-0.5 shrink-0 text-brand" />
              <p className="text-[13px] font-medium leading-snug text-ink-900">
                {entry.trace.query}
              </p>
            </div>

            <p className="mb-3 whitespace-pre-line text-[13.5px] leading-relaxed text-ink-700">
              {entry.trace.finalAnswer}
            </p>

            {entry.trace.references.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-ink-300">引用来源：</span>
                {entry.trace.retrievedAssets.map((r) => (
                  <Badge key={r.assetId} tone="brand">
                    {r.title}
                  </Badge>
                ))}
              </div>
            )}

            <button
              onClick={() => toggleTrace(entry.id)}
              className="flex items-center gap-1 text-[12px] font-medium text-ink-500 hover:text-brand"
            >
              {entry.traceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {entry.traceOpen ? "收起 Trace" : "查看 Agent Trace"}
            </button>

            {entry.traceOpen && (
              <div className="mt-3">
                <TracePanel trace={entry.trace} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
