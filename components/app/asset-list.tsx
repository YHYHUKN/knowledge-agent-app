"use client";

import { FileStack, Plus } from "lucide-react";
import { KnowledgeAsset } from "@/lib/types";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton, EmptyState } from "@/components/ui/feedback";
import { formatDateTime } from "@/lib/utils";

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
    <section className="flex h-full flex-col">
      <div className="flex items-center justify-between px-1 pb-3">
        <div>
          <h2 className="font-display text-sm font-medium text-ink-900">知识资产</h2>
          <p className="text-[12px] text-ink-500">
            {loading ? "加载中…" : `共 ${assets.length} 条 · 内存存储`}
          </p>
        </div>
        <Button size="sm" onClick={onAdd}>
          <Plus size={15} />
          新增资产
        </Button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-3">
              <Skeleton className="mb-2 h-4 w-2/3" />
              <Skeleton className="mb-1.5 h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </Card>
          ))}

        {!loading && assets.length === 0 && (
          <EmptyState
            icon={<FileStack size={28} strokeWidth={1.5} />}
            title="知识库还是空的"
            description="新增第一条知识资产，Agent 才能检索到内容并作答。"
            action={
              <Button size="sm" variant="secondary" onClick={onAdd}>
                <Plus size={15} />
                新增资产
              </Button>
            }
          />
        )}

        {!loading &&
          assets.map((asset) => (
            <Card key={asset.id} className="p-3">
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="text-[13.5px] font-medium leading-snug text-ink-900">
                  {asset.title}
                </h3>
                <span className="shrink-0 font-mono text-[11px] text-ink-300">
                  {formatDateTime(asset.createdAt)}
                </span>
              </div>
              <p className="mb-2 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
                {asset.content}
              </p>
              {asset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {asset.tags.map((tag) => (
                    <Badge key={tag} tone="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))}
      </div>
    </section>
  );
}
