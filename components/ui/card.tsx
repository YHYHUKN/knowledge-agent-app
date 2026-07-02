import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Card —— 通用卡片容器。
 *   用于资产列表项和对话记录，提供一致的圆角 / 边框 / 阴影。
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-light bg-surface shadow-card transition-shadow",
        className
      )}
      {...props}
    />
  );
}

/**
 * Badge —— 行内标签。
 *   tone 四种语义：
 *   - neutral: 灰底 —— 分类标签通用
 *   - brand:   蓝底 —— 引用来源 / 品牌关联
 *   - signal:  琥珀底 —— 相似度分数
 *   - success: 绿底 —— grounded 确认
 *   - danger:  红底 —— 异常状态
 */
type BadgeTone = "neutral" | "brand" | "signal" | "success" | "danger";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  const toneClasses = {
    neutral: "bg-canvas-muted text-ink-600",
    brand: "bg-brand-soft text-brand",
    signal: "bg-signal-soft text-signal",
    success: "bg-success-soft text-success",
    danger: "bg-danger-soft text-danger",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-2xs font-semibold leading-none",
        toneClasses,
        className
      )}
      {...props}
    />
  );
}
