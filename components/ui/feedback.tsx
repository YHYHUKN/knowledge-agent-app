import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton —— 骨架屏占位。
 *   使用 CSS shimmer 动画替代 Tailwind 默认的 animate-pulse，
 *   视觉上更柔和、更有"正在加载"的方向感。
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-shimmer rounded-md", className)}
      aria-hidden="true"
    />
  );
}

/**
 * EmptyState —— 空数据占位组件。
 *   居中布局：icon + 标题 + 描述 + 可选 action 按钮。
 *   用于资产列表无数据、对话面板无记录等场景。
 */
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
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center animate-fade-in">
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas-muted text-ink-300">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-ink-700">{title}</p>
        {description && (
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-ink-400">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
