"use client";

import { AgentTrace } from "@/lib/types";
import { Badge } from "@/components/ui/card";
import { AlertTriangle, CircleDot } from "lucide-react";

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-canvas">
        <div
          className="h-full rounded-full bg-signal"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[11px] text-signal">{score.toFixed(3)}</span>
    </div>
  );
}

/**
 * 检索全流程时间轴：Query → Retrieval（含相似度分数）→ Generation。
 * 用竖向 stepper 编码真实的处理顺序，而非装饰性的编号。
 */
export function TracePanel({ trace }: { trace: AgentTrace }) {
  return (
    <div className="rounded-md border border-border bg-canvas/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[13px] font-medium text-ink-900">Agent Trace</h3>
        <span className="font-mono text-[11px] text-ink-300">
          {new Date(trace.createdAt).toLocaleTimeString("zh-CN")}
        </span>
      </div>

      <ol className="relative space-y-4 border-l border-border pl-4">
        {/* Step 1: Query */}
        <li className="relative">
          <CircleDot
            size={14}
            className="absolute -left-[21px] top-0.5 text-brand"
          />
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-300">
            Query
          </p>
          <p className="mt-0.5 text-[13px] text-ink-900">{trace.query}</p>
        </li>

        {/* Step 2: Retrieval */}
        <li className="relative">
          <CircleDot
            size={14}
            className="absolute -left-[21px] top-0.5 text-brand"
          />
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-300">
            Retrieval · Top {trace.retrievedAssets.length}
          </p>
          {trace.retrievedAssets.length === 0 ? (
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-danger">
              <AlertTriangle size={13} />
              未召回任何相关资产
            </p>
          ) : (
            <ul className="mt-1.5 space-y-2">
              {trace.retrievedAssets.map((r, i) => (
                <li
                  key={r.assetId}
                  className="flex items-center justify-between gap-3 rounded-sm bg-white px-2.5 py-1.5 border border-border"
                >
                  <span className="truncate text-[12.5px] text-ink-700">
                    <span className="mr-1.5 font-mono text-[11px] text-ink-300">
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

        {/* Step 3: Generation */}
        <li className="relative">
          <CircleDot
            size={14}
            className="absolute -left-[21px] top-0.5 text-brand"
          />
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-300">
            Generation
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <Badge tone={trace.grounded ? "brand" : "neutral"}>
              {trace.grounded ? "grounded=true" : "grounded=false"}
            </Badge>
            <span className="text-[12px] text-ink-500">
              引用 {trace.references.length} 个来源
            </span>
          </div>
        </li>
      </ol>
    </div>
  );
}
