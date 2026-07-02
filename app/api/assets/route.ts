import { NextRequest, NextResponse } from "next/server";
import { addAsset, getAllAssets } from "@/lib/data";
import { CreateAssetRequest } from "@/lib/types";

/**
 * @route GET /api/assets
 * @description 获取全部知识资产列表（按创建时间倒序）。
 *              无需鉴权（笔试场景单租户演示），直接返回内存中的全部数据。
 * @returns { assets: KnowledgeAsset[] }
 */
export async function GET() {
  return NextResponse.json({ assets: getAllAssets() });
}

/**
 * @route POST /api/assets
 * @description 新增一条知识资产。
 *              验证规则：title 和 content 不能为空，tags 为可选数组。
 *              请求体格式错误（非 JSON）返回 400；验证失败返回 400 + error 文案。
 *              成功返回 201 + 完整 asset 对象。
 * @returns { asset: KnowledgeAsset } | { error: string }
 */
export async function POST(req: NextRequest) {
  let body: Partial<CreateAssetRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法的 JSON" }, { status: 400 });
  }

  // 字段清洗 + 默认值
  const title = (body.title ?? "").trim();
  const content = (body.content ?? "").trim();
  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => String(t).trim()).filter(Boolean)
    : [];

  if (!title) {
    return NextResponse.json({ error: "标题（title）不能为空" }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: "内容（content）不能为空" }, { status: 400 });
  }

  const asset = addAsset({ title, content, tags });
  return NextResponse.json({ asset }, { status: 201 });
}
