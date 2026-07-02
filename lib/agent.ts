import { AgentTrace, SearchResult } from "./types";
import { getAssetById } from "./data";
import { searchAssets } from "./search";

/**
 * @module agent
 * @description Agent 问答核心 —— RAG 链路的生成（Generation）阶段。
 *
 *   【设计原则：严格 grounded，禁止编造】
 *   - 本项目刻意**不接入任何 LLM**：synthesizeAnswer 只用模板拼接检索结果
 *   - 无检索结果时明确返回答"未检索到"，而非让模型凭记忆编造
 *   - 如果后续接入真实 LLM，只需替换 synthesizeAnswer：
 *     把 retrieved 拼成 context 送入模型，system prompt 明确"仅根据 context 作答"
 *   - 接口稳定性：runAgentChat 的签名和返回值（AgentTrace）不变，
 *     API Route 和前端无需改动
 */

/**
 * 生成回答：严格仅基于检索到的资产内容拼接回答文本。
 *
 * 【为什么不用 LLM】
 * 笔试规范明确"Agent 仅根据检索内容生成回答，禁止编造"。
 * 规则拼接是满足此约束的最可控方式——没有任何外部知识注入的可能。
 * README 第 5 问讨论了接入真实 LLM 后的幻觉风险及防范措施。
 *
 * @param query     - 用户原始问题（用于无结果时的拒答文案）
 * @param retrieved - searchAssets 的返回值（已排序、已过滤）
 * @returns 拼接后的回答文本，或"未检索到"拒答文案
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
