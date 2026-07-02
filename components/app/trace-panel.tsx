"use client";

import { AgentTrace } from "@/lib/types";
import { Badge } from "@/components/ui/card";
import { AlertTriangle, Circle, Search, Brain, FileText } from "lucide-react";

/**
 * @component ScoreBar
 * @description 相似度分数条 —— 琥珀色填充 + 精确数值。
 *              score ∈ [0, 1]，按百分比渲染宽度。
 */
function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <div className="flex shrink-0 items-center gap-2">
      <div className="h-1 w-14 overflow-hidden rounded-full bg-canvas-muted">
        <div
          className="h-full rounded-full bg-signal transition-all duration-500 ease-out-expo"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-2xs tabular-nums text-signal">
        {score.toFixed(3)}
      </span>
    </div>
  );
}

/**
 * @component TracePanel
 * @description 可观测性面板 —— 竖向时间轴展示 RAG 全链路。
 *
 *   三步时间轴：
 *   ① Query       原始问题
 *   ② Retrieval   召回资产列表 + 相似度分数
 *   ③ Generation  回答生成 + grounded 状态
 *
 *   无召回时显示红色警告，grounded=false 时用 danger Badge 标记。
 */
export function TracePanel({ trace }: { trace: AgentTrace }) {
  return (
    <div className="rounded-xl border border-border-light bg-canvas/70 p-5">
      {/* 头部 */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xs font-semibold tracking-tight text-ink-800">
          Agent Trace
        </h3>
        <time className="font-mono text-2xs text-ink-400">
          {new Date(trace.createdAt).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </time>
      </div>

      {/* 时间轴 */}
      <ol className="relative space-y-0 border-l-2 border-border-light">
        {/* Step 1 — Query */}
        <li className="relative pb-5 pl-6">
          <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-border-light bg-surface">
            <Search size={10} className="text-ink-400" />
          </span>
          <p className="text-2xs font-semibold uppercase tracking-wider text-ink-400">
            Query
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-800">
            {trace.query}
          </p>
        </li>

        {/* Step 2 — Retrieval */}
        <li className="relative pb-5 pl-6">
          <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-border-light bg-surface">
            <FileText size={10} className="text-ink-400" />
          </span>
          <p className="text-2xs font-semibold uppercase tracking-wider text-ink-400">
            Retrieval · Top {trace.retrievedAssets.length}
          </p>

          {trace.retrievedAssets.length === 0 ? (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-danger/15 bg-danger-soft px-3 py-2">
              <AlertTriangle size={13} className="text-danger" />
              <span className="text-xs text-danger">未召回任何相关资产</span>
            </div>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {trace.retrievedAssets.map((r, i) => (
                <li
                  key={r.assetId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border-light bg-surface px-3 py-2 transition-colors hover:border-brand/20"
                >
                  <span className="min-w-0 truncate text-xs text-ink-700">
                    <span className="mr-2 font-mono text-2xs text-ink-300">
                      #{i + 1}
                    </span>
                    {r.title}
                  </span>
                  <ScoreBar score={r.score} />
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Step 3 — Generation */}
        <li className="relative pl-6">
          <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-border-light bg-surface">
            <Brain size={10} className="text-ink-400" />
          </span>
          <p className="text-2xs font-semibold uppercase tracking-wider text-ink-400">
            Generation
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge tone={trace.grounded ? "success" : "danger"}>
              {trace.grounded ? "grounded" : "not grounded"}
            </Badge>
            <span className="text-2xs text-ink-400">
              {trace.references.length} 个引用来源
            </span>
          </div>
        </li>
      </ol>
    </div>
  );
}
