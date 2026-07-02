import { NextRequest, NextResponse } from "next/server";
import { addAsset, getAllAssets } from "@/lib/data";
import { CreateAssetRequest } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ assets: getAllAssets() });
}

export async function POST(req: NextRequest) {
  let body: Partial<CreateAssetRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法的 JSON" }, { status: 400 });
  }

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
