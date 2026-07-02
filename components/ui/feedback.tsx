/**
 * @module feedback
 * @description 反馈态组件 —— 覆盖 Loading 和空数据两种兜底状态。
 *
 *   Skeleton: 骨架屏占位，animate-pulse 脉冲动画提供"正在加载"的视觉暗示
 *   EmptyState: 虚线边框居中插画，icon + title + description + 可选 action 按钮
 *               用于资产列表空数据（引导新增）和对话面板空数据（引导提问）
 */
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-canvas", className)}
      aria-hidden="true"
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border px-6 py-10 text-center">
      {icon && <div className="mb-1 text-ink-300">{icon}</div>}
      <p className="text-sm font-medium text-ink-700">{title}</p>
      {description && <p className="max-w-xs text-[13px] text-ink-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
