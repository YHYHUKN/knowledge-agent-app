import { KnowledgeAsset, SearchResult } from "./types";
import { getAllAssets } from "./data";

/**
 * @module search
 * @description 关键词打分检索 —— RAG 链路的检索（Retrieval）阶段。
 *
 *   【算法概述】
 *   1. 分词：query 和每篇文档分别 tokenize，中英混合处理
 *   2. 打分：按字段加权（标题 0.5 / 标签 0.3 / 正文 0.08），命中即加分
 *   3. 归一化：除以 query 词数，避免长 query 天然高分
 *   4. 过滤 + 排序：阈值 0.08 过滤噪音，降序取 Top-3
 *
 *   【局限性（已在 README 第 3 问讨论）】
 *   - 中文按单字切分，无法识别"智能体"这样的词组语义
 *   - 不同措辞（"Agent 分工" vs "多智能体协作"）在关键词层面命中率打折扣
 *   - 生产环境应替换为向量 embedding 检索
 */

const TOP_K = 3;
/** 命中分低于该阈值的结果视为不相关，不参与生成 */
const RELEVANCE_THRESHOLD = 0.08;

/**
 * 中英文混合场景下的简易分词：
 * - 英文/数字：按连续字母数字序列整词切分（如 "Agent" 是一个 token）
 * - 中文：按单个汉字切分（如 "智能体" → ["智","能","体"]）
 *
 * 注意：这不是真正的分词算法（无词典、无语义），仅用于笔试场景。
 * 生产环境应用 jieba / @node-rs/jieba 等成熟方案。
 */
function tokenize(text: string): string[] {
  const matches = text
    .toLowerCase()
    .match(/[a-z0-9]+|[\u4e00-\u9fa5]/g);
  return matches ?? [];
}

/**
 * 从正文中裁剪命中关键词附近的片段用于 SearchResult.snippet。
 * 优先定位第一个命中的 query token，取前后各约 20 字，
 * 首尾加省略号提示截断。
 */
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
 * 核心检索函数：关键词打分 → 归一化 → 过滤 → Top-K 排序。
 *
 *   打分规则（每命中一个 query token）：
 *   - 标题命中：+0.5 分（权重最高，用户主要靠标题识别资产）
 *   - 标签命中：+0.3 分（次之，标签是人工标注的结构化信息）
 *   - 正文命中：+0.08 分/次（可叠加，但单 token 上限 0.24 防止长文霸权）
 *
 *   归一化：rawScore / queryTokens.length，避免"query 越长分数越高"。
 *   例如："Agent 协作" 两个 token 都能满分 → 总分最高 1.0；
 *   而一个 10 token 的 query 即使全部命中也不会天然更高分。
 *
 * @returns 归一化后 >= 0.08 且按分数降序的前 3 条结果
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
