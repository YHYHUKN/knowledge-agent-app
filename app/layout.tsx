import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "知识资产问答工作台",
  description: "基于检索增强生成（RAG）的企业知识资产问答工作台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
