/**
 * @module input
 * @description Input（单行）和 Textarea（多行）表单控件。
 *              统一样式：白底、灰边框、focus 时 border 变品牌色 + 微光环。
 *              使用 forwardRef 支持父组件 ref 转发。
 */
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-ink-900",
        "placeholder:text-ink-300 outline-none",
        "focus:border-brand focus:ring-1 focus:ring-brand",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900",
      "placeholder:text-ink-300 outline-none resize-none",
      "focus:border-brand focus:ring-1 focus:ring-brand",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
