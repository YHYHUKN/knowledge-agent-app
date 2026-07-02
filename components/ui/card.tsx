/**
 * @module card
 * @description Card（卡片容器）和 Badge（标签）。
 *              Card: 白底 + 细微阴影 + 圆角边框，承载列表项和对话气泡
 *              Badge: 等宽字体 11px 标签，三种色阶（neutral/brand/signal）
 *                     - neutral: 灰底 → 标签分类通用
 *                     - brand: 品牌蓝底 → 引用来源
 *                     - signal: 琥珀底 → grounded 状态标记
 */
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface shadow-card",
        className
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "brand" | "signal" }) {
  const toneClasses = {
    neutral: "bg-canvas text-ink-500 border-border",
    brand: "bg-brand-soft text-brand border-transparent",
    signal: "bg-signal-soft text-signal border-transparent",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[11px] font-mono leading-none",
        toneClasses,
        className
      )}
      {...props}
    />
  );
}
