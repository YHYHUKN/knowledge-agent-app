/**
 * @page Home
 * @description 首页 —— 整个应用唯一的页面路由。
 *
 *   【布局结构】
 *   - 顶部 Header（h-16）：品牌 Logo + 标题 "知识资产问答工作台" + 右侧状态标签
 *   - 主体 Workbench：双栏（左资产列表 + 右 Agent 问答）
 *
 *   所有路由逻辑在 App Router 单页内完成，无需多页面跳转。
 */
import { Workbench } from "@/components/app/workbench";
import { Database } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas">
      <header className="h-16 border-b border-border bg-surface">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
              <Database size={16} />
            </div>
            <div>
              <h1 className="font-display text-[15px] font-semibold leading-none text-ink-900">
                知识资产问答工作台
              </h1>
              <p className="mt-1 text-[11px] leading-none text-ink-300">
                Knowledge Asset Q&amp;A Workbench
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] text-ink-300">内存存储 · 单租户演示</span>
        </div>
      </header>
      <Workbench />
    </main>
  );
}
