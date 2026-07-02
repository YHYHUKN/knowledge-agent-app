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
