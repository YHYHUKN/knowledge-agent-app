import { NextRequest, NextResponse } from "next/server";
import { runAgentChat } from "@/lib/agent";
import { AgentChatRequest } from "@/lib/types";

/**
 * @route POST /api/agent/chat
 * @description Agent 问答接口 —— 本项目最核心的 API 端点。
 *              接收用户问题 → 调用 runAgentChat 执行完整 RAG 链路：
 *              1. searchAssets(query)  →  关键词检索 Top-3
 *              2. synthesizeAnswer()   →  基于检索结果拼接回答（无 LLM）
 *              3. 封装为 AgentTrace    →  返回给前端展示
 *
 *              前端 ChatPanel 调用此接口，拿到 AgentTrace 后：
 *              - finalAnswer 渲染为对话气泡
 *              - references  渲染为引用来源 Badge
 *              - retrievedAssets + TracePanel 渲染可观测检查链
 */
export async function POST(req: NextRequest) {
  let body: Partial<AgentChatRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法的 JSON" }, { status: 400 });
  }

  const query = (body.query ?? "").trim();
  if (!query) {
    return NextResponse.json({ error: "问题（query）不能为空" }, { status: 400 });
  }

  const trace = runAgentChat(query);
  return NextResponse.json({ trace });
}
