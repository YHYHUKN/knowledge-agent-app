import { NextRequest, NextResponse } from "next/server";
import { searchAssets } from "@/lib/search";
import { SearchRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  let body: Partial<SearchRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法的 JSON" }, { status: 400 });
  }

  const query = (body.query ?? "").trim();
  if (!query) {
    return NextResponse.json({ error: "查询内容（query）不能为空" }, { status: 400 });
  }

  const results = searchAssets(query);
  return NextResponse.json({ results });
}
