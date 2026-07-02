"use client";

import { useEffect, useState } from "react";
import { KnowledgeAsset } from "@/lib/types";
import { AssetList } from "@/components/app/asset-list";
import { AssetFormDialog } from "@/components/app/asset-form-dialog";
import { ChatPanel } from "@/components/app/chat-panel";

/**
 * @component Workbench
 * @description 工作台主容器。
 *
 *   双栏布局：
 *   左侧 372px 固定宽度 —— 知识资产管理面板
 *   右侧 flex-1          —— Agent 问答面板
 *
 *   全局状态：
 *   - assets:  知识资产列表（GET /api/assets）
 *   - loading: 骨架屏控制
 *   - dialogOpen: 新增资产弹窗
 */
export function Workbench() {
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/assets");
        const data = await res.json();
        if (!cancelled) setAssets(data.assets ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCreated(asset: KnowledgeAsset) {
    setAssets((prev) => [asset, ...prev]);
  }

  return (
    <>
      <main className="mx-auto grid h-[calc(100vh-48px)] max-w-[1280px] grid-cols-1 gap-5 px-5 py-5 lg:grid-cols-[372px_1fr] animate-fade-in">
        {/* 左侧：资产管理 */}
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border-light bg-surface shadow-card transition-shadow hover:shadow-card-hover">
          <AssetList
            assets={assets}
            loading={loading}
            onAdd={() => setDialogOpen(true)}
          />
        </aside>

        {/* 右侧：Agent 问答 */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border-light bg-surface shadow-card">
          <ChatPanel hasAssets={assets.length > 0} />
        </section>
      </main>

      <AssetFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
