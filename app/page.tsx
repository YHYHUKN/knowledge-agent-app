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
