/**
 * @module client-storage
 * @description 客户端 localStorage 持久化层 —— 满足"页面刷新数据不丢失"的隐性要求。
 *
 *   【设计决策】
 *   - 浏览器 localStorage 天然持久化，刷新页面 / 关闭标签页 / 关闭浏览器后再次打开均保留
 *   - API Route 仍在服务端运行（内存），负责搜索/Agent链路的计算，不依赖持久化
 *   - 这种"前端写 localStorage + 服务端读内存"的混合模式适合本项目：
 *     资产管理（新增/列表）走 localStorage 持久化
 *     检索/Agent（只读计算）走服务端 API（纯内存即可）
 *   - 换真实数据库时，只需把本模块的读写换成 DB 调用，其余代码不动
 *
 *   【数据一致性】
 *   - 新增资产：先写入 localStorage → 再调 API（服务端也同步更新）
 *   - 初始化：优先读 localStorage（无闪烁），同时后台静默调 API 同步
 *   - 若 localStorage 数据被用户手动清除，会回退到 API 数据（种子数据兜底）
 */

import { KnowledgeAsset } from "./types";

const STORAGE_KEY = "knowledge_assets_v1";

/** 从 localStorage 读取全部资产 */
export function loadAssets(): KnowledgeAsset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as KnowledgeAsset[];
  } catch {
    return [];
  }
}

/** 将资产数组完整覆盖写入 localStorage */
export function saveAssets(assets: KnowledgeAsset[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  } catch {
    // localStorage 写失败（如容量超限），静默忽略，不阻塞主流程
  }
}

/** 追加单条资产到 localStorage（不触发 API，用于 API 成功后的追加同步） */
export function appendAsset(asset: KnowledgeAsset): void {
  const existing = loadAssets();
  saveAssets([asset, ...existing]);
}

/** 初始化种子数据到 localStorage（仅当 localStorage 为空时调用） */
export function seedStorage(assets: KnowledgeAsset[]): void {
  if (typeof window === "undefined") return;
  const existing = loadAssets();
  if (existing.length === 0) {
    saveAssets(assets);
  }
}
