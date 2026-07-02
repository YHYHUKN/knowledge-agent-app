import { NextRequest, NextResponse } from "next/server";
import { searchAssets } from "@/lib/search";
import { SearchRequest } from "@/lib/types";

/**
 * @route POST /api/search
 * @description 关键词检索接口：接收 query 字符串，返回关键词命中打分后的 Top-3 结果。
 *              每个结果包含 assetId、title、snippet（命中片段）、score（0~1 归一化分）。
 *              query 为空返回 400。
 */
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
