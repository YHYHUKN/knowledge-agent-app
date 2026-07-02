"use client";

import { useEffect, useState } from "react";
import { KnowledgeAsset } from "@/lib/types";
import { AssetList } from "@/components/app/asset-list";
import { AssetFormDialog } from "@/components/app/asset-form-dialog";
import { ChatPanel } from "@/components/app/chat-panel";

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
