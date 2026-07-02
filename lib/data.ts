import { KnowledgeAsset } from "./types";

/**
 * @module data
 * @description 内存存储层 —— 项目唯一的"数据库"。
 *
 *   【设计决策】
 *   - 服务端：Node 进程内存存储（globalThis），服务于 API Route 的检索计算层
 *   - 客户端：localStorage 持久化（lib/client-storage.ts），用户新增数据刷新不丢失
 *   - 两层组合：资产管理走 localStorage（持久化），检索/Agent 链路走服务端内存（计算）
 *   - 使用 globalThis 挂载数组，而非模块级 let/const：
 *     Next.js dev 模式下会热重载（HMR）模块，如果数组存在模块作用域，
 *     每次 HMR 都会重新初始化为种子数据，导致服务端资产丢失。
 *     globalThis 不受 HMR 影响，保证 dev 体验与 prod 一致。
 *     （客户端 localStorage 不受 HMR 影响，用户的持久化数据不受影响）
 *   - 生产环境：服务端 globalThis 仍可保留；真实数据库只需替换本文件的四个导出函数。
 *   - 替换为真实数据库时，只需改写本文件的四个导出函数，
 *     其余所有代码只依赖 KnowledgeAsset 接口，无需修改。
 */

/** globalThis 上挂载的知识资产数组的类型标记 */
interface GlobalStore {
  __KNOWLEDGE_ASSETS__?: KnowledgeAsset[];
}

const globalStore = globalThis as unknown as GlobalStore;

/** 初始种子数据：3 条内置知识资产，与规范要求完全对应。
 *  内容语义涵盖：AIOS 平台介绍 / 数字资产知识库 / Agent 工作流
 *  注意：localStorage 持久化后，新用户首次加载时会从 API 拿到这 3 条种子数据，
 *  并写入 localStorage（lib/client-storage.ts 的 syncFromApi 逻辑）。
 *  已写入 localStorage 的老用户需手动清除浏览器 localStorage 才能看到新的标题。 */
function seedAssets(): KnowledgeAsset[] {
  const now = Date.now();
  return [
    {
      id: "asset-1",
      title: "AIOS平台介绍",
      content:
        "AIOS 是一个面向企业的智能体操作平台，支持智能体协作。复杂任务会被拆解为若干子任务，由不同角色的 Agent 分工执行，并通过统一的工具调用（Tool Use）协议访问外部能力，如搜索、代码执行、数据库查询等。协作过程中，Agent 之间通过共享上下文和消息传递机制同步状态，最终由主控 Agent 汇总子任务结果，生成完整答案。",
      tags: ["Agent", "AIOS", "多智能体"],
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: "asset-2",
      title: "数字资产知识库",
      content:
        "数字资产知识库用于沉淀企业文档、业务，支持智能检索和问答。系统内置检索增强生成（RAG）能力：用户提问后，先在知识库中召回与问题最相关的文档片段（Top-K），再将这些片段作为上下文注入模型的 Prompt，要求模型仅基于给定片段生成回答，并在回答中标注引用来源。若检索未命中任何相关内容，系统会明确告知用户'未检索到相关知识'，而不是让模型凭空编造答案。",
      tags: ["RAG", "知识库", "检索"],
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: "asset-3",
      title: "Agent工作流",
      content:
        "Agent 可以通过任务拆解、工具调用、工作流编排和多智能体协作完成任务。平台为每一次 Agent 调用生成完整的 Trace 记录，包含用户原始问题、检索到的候选文档及其相似度分数、模型最终生成的回答、以及引用的文档来源，便于排查和审计。同时系统支持可观测性和权限控制来保证可靠性：不同角色（管理员、普通用户、只读访客）对知识资产的增删改查权限不同，为多租户场景下的数据隔离与安全审计打下基础。",
      tags: ["Agent", "可观测性", "权限控制"],
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];
}

/** 首次加载时初始化——如果 globalThis 上没有数据，写入种子数据 */
if (!globalStore.__KNOWLEDGE_ASSETS__) {
  globalStore.__KNOWLEDGE_ASSETS__ = seedAssets();
}

/** 获取全部资产，按创建时间倒序（最新在前），返回浅拷贝防止外部篡改 */
export function getAllAssets(): KnowledgeAsset[] {
  return [...globalStore.__KNOWLEDGE_ASSETS__!].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** 按 ID 精确查找单条资产 */
export function getAssetById(id: string): KnowledgeAsset | undefined {
  return globalStore.__KNOWLEDGE_ASSETS__!.find((a) => a.id === id);
}

/** 新增资产：生成唯一 ID（时间戳+随机后缀），写入内存数组，返回完整对象 */
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
