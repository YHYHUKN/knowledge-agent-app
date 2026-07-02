/**
 * @module button
 * @description Button 按钮组件。
 *              variant: primary（品牌色实心）/ secondary（白底描边）/ ghost（透明悬浮）
 *              size: sm（紧凑，h-8）/ md（默认，h-9）
 *              使用 forwardRef 支持 ref 转发，继承原生 ButtonHTMLAttributes。
 */
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary:
    "bg-white text-ink-900 border border-border hover:border-border-strong hover:bg-canvas",
  ghost: "bg-transparent text-ink-700 hover:bg-canvas",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
