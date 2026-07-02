import { AgentTrace, SearchResult } from "./types";
import { getAssetById } from "./data";
import { searchAssets } from "./search";

/**
 * 生成回答：严格只使用检索到的资产内容拼接说明性文本，
 * 不调用任何 LLM、不引入检索结果之外的知识 —— 对应需求中
 * "Agent 仅根据检索内容生成回答，禁止编造"。
 *
 * 若需要接入真实 LLM，替换本函数内部实现即可：把 retrieved
 * 拼成 context，连同 query 一起送入模型，并在 system prompt
 * 中明确"仅根据 context 回答，未提及的内容一律回复不知道"。
 */
function synthesizeAnswer(query: string, retrieved: SearchResult[]): string {
  if (retrieved.length === 0) {
    return `未检索到与"${query}"相关的知识资产，无法生成回答。请尝试更换关键词，或先在知识库中补充相关资产。`;
  }

  const parts = retrieved.map((r, i) => {
    const asset = getAssetById(r.assetId);
    const body = asset ? asset.content : r.snippet;
    return `${i + 1}. 根据《${r.title}》：${body}`;
  });

  return [
    `基于知识库中检索到的 ${retrieved.length} 条相关资产，回答如下：`,
    ...parts,
  ].join("\n\n");
}

export function runAgentChat(query: string): AgentTrace {
  const retrievedAssets = searchAssets(query);
  const finalAnswer = synthesizeAnswer(query, retrievedAssets);

  return {
    query,
    retrievedAssets,
    finalAnswer,
    references: retrievedAssets.map((r) => ({ assetId: r.assetId, title: r.title })),
    createdAt: new Date().toISOString(),
    grounded: retrievedAssets.length > 0,
  };
}
