"use client";

import { FileStack, Plus } from "lucide-react";
import { KnowledgeAsset } from "@/lib/types";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton, EmptyState } from "@/components/ui/feedback";
import { formatDateTime } from "@/lib/utils";

/**
 * @component AssetList
 * @description 知识资产列表 —— 左侧栏面板。
 *
 *   三种渲染态：
 *   1. loading  → 3 条骨架屏卡（shimmer 动画）
 *   2. 空数据   → EmptyState 插画 cta 引导新增
 *   3. 有数据   → 卡片列表，hover 时微抬升 + 边框高亮
 */
export function AssetList({
  assets,
  loading,
  onAdd,
}: {
  assets: KnowledgeAsset[];
  loading: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* ── 面板头部 ── */}
      <div className="flex items-center justify-between border-b border-border-light px-5 py-3.5">
        <div>
          <h2 className="font-display text-sm font-semibold tracking-tight text-ink-900">
            知识资产
          </h2>
          <p className="mt-0.5 text-2xs text-ink-400">
            {loading ? "加载中…" : `${assets.length} 条记录 · 内存存储`}
          </p>
        </div>
        <Button size="sm" onClick={onAdd}>
          <Plus size={14} />
          新增
        </Button>
      </div>

      {/* ── 列表区 ── */}
      <div className="flex-1 space-y-1.5 overflow-y-auto px-4 py-3">
        {/* Loading 骨架屏 */}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border-light bg-surface p-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="animate-shimmer mb-3 h-4 w-2/3 rounded" />
              <div className="animate-shimmer mb-2 h-3 w-full rounded" />
              <div className="animate-shimmer mb-3 h-3 w-4/5 rounded" />
              <div className="flex gap-1.5">
                <div className="animate-shimmer h-5 w-14 rounded" />
                <div className="animate-shimmer h-5 w-10 rounded" />
              </div>
            </div>
          ))}

        {/* 空数据 */}
        {!loading && assets.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon={<FileStack size={32} strokeWidth={1.5} />}
              title="知识库为空"
              description="新增第一条资产后，Agent 即可检索并作答"
              action={
                <Button size="sm" variant="secondary" onClick={onAdd}>
                  <Plus size={14} />
                  新增资产
                </Button>
              }
            />
          </div>
        )}

        {/* 资产卡片列表 */}
        {!loading &&
          assets.map((asset, i) => (
            <article
              key={asset.id}
              className="group cursor-default rounded-lg border border-border-light bg-surface p-4 transition-all duration-200 ease-out-expo hover:border-brand/20 hover:shadow-card-hover hover:-translate-y-0.5 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* 标题行 */}
              <div className="mb-1.5 flex items-start gap-2">
                <h3 className="flex-1 text-sm font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand">
                  {asset.title}
                </h3>
              </div>

              {/* 正文摘要 */}
              <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-ink-500">
                {asset.content}
              </p>

              {/* 底部：标签 + 时间 */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {asset.tags.length > 0 ? (
                    asset.tags.map((tag) => (
                      <Badge key={tag} tone="neutral">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-2xs text-ink-300">无标签</span>
                  )}
                </div>
                <time className="shrink-0 font-mono text-2xs text-ink-300">
                  {formatDateTime(asset.createdAt)}
                </time>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}
