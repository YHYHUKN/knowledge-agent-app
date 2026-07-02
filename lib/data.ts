import { KnowledgeAsset } from "./types";

// ── 内存存储 ──────────────────────────────────────────────────
// 说明：数据仅存在于 Node 进程内存中，服务重启 / 重新部署后清空。
// 使用 globalThis 挂载，是为了避免 Next.js dev 模式下模块热重载
// (HMR) 导致内存数组被重复初始化、丢失已新增的数据。
// 生产环境下这不是必须的，但保留无害。

interface GlobalStore {
  __KNOWLEDGE_ASSETS__?: KnowledgeAsset[];
}

const globalStore = globalThis as unknown as GlobalStore;

function seedAssets(): KnowledgeAsset[] {
  const now = Date.now();
  return [
    {
      id: "asset-1",
      title: "智能体协作",
      content:
        "AIOS 平台支持多智能体协作：复杂任务会被拆解为若干子任务，由不同角色的 Agent 分工执行，并通过统一的工具调用（Tool Use）协议访问外部能力，如搜索、代码执行、数据库查询等。协作过程中，Agent 之间通过共享上下文和消息传递机制同步状态，最终由主控 Agent 汇总子任务结果，生成完整答案。",
      tags: ["Agent", "多智能体", "任务拆解"],
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: "asset-2",
      title: "支持智能检索和问答",
      content:
        "系统内置检索增强生成（RAG）能力：用户提问后，先在知识库中召回与问题最相关的文档片段（Top-K），再将这些片段作为上下文注入模型的 Prompt，要求模型仅基于给定片段生成回答，并在回答中标注引用来源。若检索未命中任何相关内容，系统会明确告知用户'未检索到相关知识'，而不是让模型凭空编造答案。",
      tags: ["RAG", "检索", "问答"],
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: "asset-3",
      title: "可观测性和权限控制",
      content:
        "平台为每一次 Agent 调用生成完整的 Trace 记录，包含用户原始问题、检索到的候选文档及其相似度分数、模型最终生成的回答、以及引用的文档来源，便于排查和审计。同时系统支持分级权限控制：不同角色（管理员、普通用户、只读访客）对知识资产的增删改查权限不同，为多租户场景下的数据隔离与安全审计打下基础。",
      tags: ["可观测性", "权限控制", "Trace"],
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];
}

if (!globalStore.__KNOWLEDGE_ASSETS__) {
  globalStore.__KNOWLEDGE_ASSETS__ = seedAssets();
}

export function getAllAssets(): KnowledgeAsset[] {
  return [...globalStore.__KNOWLEDGE_ASSETS__!].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getAssetById(id: string): KnowledgeAsset | undefined {
  return globalStore.__KNOWLEDGE_ASSETS__!.find((a) => a.id === id);
}

export function addAsset(input: {
  title: string;
  content: string;
  tags: string[];
}): KnowledgeAsset {
  const asset: KnowledgeAsset = {
    id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title,
    content: input.content,
    tags: input.tags,
    createdAt: new Date().toISOString(),
  };
  globalStore.__KNOWLEDGE_ASSETS__!.push(asset);
  return asset;
}
