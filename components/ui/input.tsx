import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Input —— 单行文本输入框。
 *   白底 + 极浅灰边框，focus 时 border + ring 变品牌色。
 */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-9 rounded-lg border border-border bg-surface px-3 text-sm text-ink-900",
        "placeholder:text-ink-300 outline-none transition-colors duration-150",
        "focus:border-brand focus:ring-1 focus:ring-brand/20",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-canvas-muted",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

/**
 * Textarea —— 多行文本输入框。
 *   与 Input 一致的视觉语言，默认不可拖拽 resize。
 */
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink-900",
      "placeholder:text-ink-300 outline-none transition-colors duration-150 resize-none",
      "focus:border-brand focus:ring-1 focus:ring-brand/20",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-canvas-muted",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
