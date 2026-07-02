"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  // Escape 关闭 + body 滚动锁定
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-16 sm:items-center">
      {/* 背景蒙层 */}
      <div
        className="fixed inset-0 animate-fade-in bg-ink-900/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 弹窗主体 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          "relative z-10 w-full max-w-lg animate-scale-in rounded-xl border border-border-light bg-surface shadow-pop",
          className
        )}
      >
        {/* 标题栏 */}
        <div className="flex items-start justify-between border-b border-border-light px-6 py-4">
          <div>
            <h2
              id="dialog-title"
              className="font-display text-base font-semibold tracking-tight text-ink-900"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-ink-500">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="关闭"
            className="rounded-lg p-1.5 text-ink-300 transition-colors hover:bg-canvas-muted hover:text-ink-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* 内容区 */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
