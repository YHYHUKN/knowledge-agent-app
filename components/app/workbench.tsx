"use client";

import { useEffect, useState } from "react";
import { KnowledgeAsset } from "@/lib/types";
import { AssetList } from "@/components/app/asset-list";
import { AssetFormDialog } from "@/components/app/asset-form-dialog";
import { ChatPanel } from "@/components/app/chat-panel";

/**
 * @component Workbench
 * @description 工作台主容器 —— 首页的核心组件，管理全局状态。
 *
 *   【布局】双栏响应式：左侧 380px 资产列表 + 右侧弹性问答面板
 *   【状态管理】
 *   - assets: 当前全部知识资产（从 GET /api/assets 加载）
 *   - loading: 资产列表加载态（用于骨架屏）
 *   - dialogOpen: 新增资产弹窗开关
 *   【数据流】
 *   1. mount 时 fetch 资产列表 → 传给 AssetList 渲染
 *   2. "新增"按钮 → 打开 AssetFormDialog → 提交成功后回调 handleCreated 刷新列表
 *   3. hasAssets 传给 ChatPanel → 控制输入框 placeholder 提示
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
      <div className="mx-auto grid h-[calc(100vh-64px)] max-w-6xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[380px_1fr]">
        <div className="min-h-0 rounded-lg border border-border bg-surface p-4 shadow-card">
          <AssetList assets={assets} loading={loading} onAdd={() => setDialogOpen(true)} />
        </div>
        <div className="min-h-0 rounded-lg border border-border bg-surface p-4 shadow-card">
          <ChatPanel hasAssets={assets.length > 0} />
        </div>
      </div>

      <AssetFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
