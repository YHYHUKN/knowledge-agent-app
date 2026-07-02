import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "知识资产问答工作台",
  description: "基于检索增强生成（RAG）的企业知识资产问答工作台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="font-body antialiased">
        {/* 顶部导航栏 —— 极致克制：仅提供位置锚点和标题 */}
        <header className="sticky top-0 z-40 flex h-12 items-center border-b border-border-light bg-surface/80 px-6 backdrop-blur-md">
          <span className="font-display text-sm font-medium tracking-tight text-ink-800">
            知识资产问答工作台
          </span>
          <span className="ml-3 hidden h-1.5 w-1.5 rounded-full bg-success sm:inline-block" />
          <span className="ml-1.5 hidden text-2xs text-ink-400 sm:inline-block">
            在线
          </span>

          {/* 右侧占位 —— 预留操作入口 */}
          <div className="ml-auto" />
        </header>

        {children}
      </body>
    </html>
  );
}
