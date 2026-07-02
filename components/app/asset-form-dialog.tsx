"use client";

import { FormEvent, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KnowledgeAsset } from "@/lib/types";

export function AssetFormDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (asset: KnowledgeAsset) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setTitle("");
    setContent("");
    setTagsInput("");
    setError(null);
  }

  function handleClose() {
    if (submitting) return;
    reset();
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("标题和内容均为必填项");
      return;
    }

    const tags = tagsInput
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), tags }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "新增失败，请重试");
      }
      onCreated(data.asset as KnowledgeAsset);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "新增失败，请重试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="新增知识资产"
      description="将被纳入检索范围，供 Agent 问答时召回引用"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-ink-700">
            标题 <span className="text-danger">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：向量数据库选型说明"
            maxLength={100}
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-ink-700">
            内容 <span className="text-danger">*</span>
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="详细描述这条知识的内容，Agent 将直接引用这段文本作答"
            rows={5}
            maxLength={2000}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-ink-700">
            标签
          </label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="多个标签用逗号分隔，例如：RAG, 检索"
          />
        </div>

        {error && (
          <p className="rounded-md bg-danger/5 px-3 py-2 text-[13px] text-danger">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={submitting}>
            取消
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "保存中…" : "保存"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
