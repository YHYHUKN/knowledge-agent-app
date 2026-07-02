import { NextRequest, NextResponse } from "next/server";
import { runAgentChat } from "@/lib/agent";
import { AgentChatRequest } from "@/lib/types";

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
