"use client";

import { FormEvent, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KnowledgeAsset } from "@/lib/types";

/**
 * @component AssetFormDialog
 * @description 新增知识资产弹窗。
 *
 *   三字段表单：标题（必填）/ 内容（必填）/ 标签（选填，逗号分隔）
 *   提交中所有字段 disabled + 按钮"保存中…"
 *   校验失败：红色内联错误提示
 */
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
      if (!res.ok) throw new Error(data.error ?? "新增失败，请重试");

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
      description="内容将被纳入检索范围，供 Agent 问答时召回引用"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 标题 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-800">
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

        {/* 内容 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-800">
            内容 <span className="text-danger">*</span>
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="详细描述这条知识的内容，Agent 将直接引用这段文本生成回答"
            rows={6}
            maxLength={2000}
          />
          <p className="text-2xs text-ink-400 tabular-nums">
            {content.length}/2000
          </p>
        </div>

        {/* 标签 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-800">标签</label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="多个标签用逗号分隔，例如：RAG, 检索增强"
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="rounded-lg border border-danger/20 bg-danger-soft px-4 py-2.5 text-xs text-danger">
            {error}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={submitting}>
            取消
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "保存中…" : "保存资产"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
