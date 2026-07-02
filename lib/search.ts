import { KnowledgeAsset, SearchResult } from "./types";
import { getAllAssets } from "./data";

const TOP_K = 3;
// 命中分低于该阈值的结果视为不相关，不参与生成，避免"强行凑数"
const RELEVANCE_THRESHOLD = 0.08;

/**
 * 中英文混合场景下的简易分词：按连续的中文单字 + 英文/数字单词切分。
 * 这不是真正的分词算法，仅用于笔试场景下的关键词匹配打分；
 * 生产环境应替换为向量 embedding 检索（见 README 第 3 问）。
 */
function tokenize(text: string): string[] {
  const matches = text
    .toLowerCase()
    .match(/[a-z0-9]+|[\u4e00-\u9fa5]/g);
  return matches ?? [];
}

function buildSnippet(content: string, queryTokens: string[], maxLen = 80): string {
  const lower = content.toLowerCase();
  let hitIndex = -1;
  for (const t of queryTokens) {
    const idx = lower.indexOf(t);
    if (idx !== -1) {
      hitIndex = idx;
      break;
    }
  }
  if (hitIndex === -1) {
    return content.length > maxLen ? content.slice(0, maxLen) + "…" : content;
  }
  const start = Math.max(0, hitIndex - 20);
  const end = Math.min(content.length, start + maxLen);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  return prefix + content.slice(start, end) + suffix;
}

/**
 * 关键词打分检索：
 * - 标题命中权重最高（0.5 / 词）
 * - 标签命中次之（0.3 / 词）
 * - 正文命中权重最低（0.08 / 词，按词频叠加但设上限）
 * 最终分数归一化到 0~1，并按分数降序返回 Top-K。
 */
export function searchAssets(query: string): SearchResult[] {
  const queryTokens = Array.from(new Set(tokenize(query)));
  if (queryTokens.length === 0) return [];

  const assets: KnowledgeAsset[] = getAllAssets();

  const scored = assets.map((asset) => {
    const titleTokens = tokenize(asset.title);
    const contentTokens = tokenize(asset.content);
    const tagTokens = tokenize(asset.tags.join(" "));

    let rawScore = 0;
    for (const qt of queryTokens) {
      if (titleTokens.includes(qt)) rawScore += 0.5;
      if (tagTokens.includes(qt)) rawScore += 0.3;
      const contentHits = contentTokens.filter((c) => c === qt).length;
      rawScore += Math.min(contentHits * 0.08, 0.24);
    }

    // 按命中的 query 词覆盖率做归一化，避免长 query 天然拿高分
    const normalized = Math.min(rawScore / queryTokens.length, 1);

    return {
      assetId: asset.id,
      title: asset.title,
      snippet: buildSnippet(asset.content, queryTokens),
      score: Math.round(normalized * 1000) / 1000,
    };
  });

  return scored
    .filter((r) => r.score >= RELEVANCE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);
}
