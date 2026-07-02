/**
 * @module types
 * @description 全局 TypeScript 类型定义 —— 本项目所有接口契约的唯一来源。
 *              三个核心类型分层对应 RAG 链路的三个阶段：
 *              存储层（KnowledgeAsset）→ 检索层（SearchResult）→ 可观测层（AgentTrace）
 */

// ── 核心数据类型：对应 RAG 三阶段 ────────────────────────────

/** 知识资产：知识库中的一条原始文档/条目。
 *  @field id        - 唯一标识，种子数据用 "asset-N" 格式，新增用时间戳+随机
 *  @field title     - 资产标题，检索时权重最高（0.5/词命中）
 *  @field content   - 正文内容，Agent 回答时直接引用此字段
 *  @field tags      - 标签数组，检索时权重次之（0.3/词命中），前端用逗号分隔输入
 *  @field createdAt - ISO 8601 时间字符串，用于列表排序 */
export interface KnowledgeAsset {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string; // ISO 字符串
}

/** 检索结果：searchAssets 命中的单条记录。
 *  不返回完整 KnowledgeAsset，只返回展示引用所需的轻量字段。
 *  @field assetId - 源资产 ID，前端可用于反查详情
 *  @field title   - 资产标题，直接用于引用展示
 *  @field snippet - 命中关键词附近的正文片段（约 80 字），含上下文
 *  @field score   - 归一化相似度分数，0~1，仅展示用（非检索阈值直接用原始分） */
export interface SearchResult {
  assetId: string;
  title: string;
  snippet: string;
  score: number; // 0 ~ 1，归一化后的相似度分数
}

/** Agent 的一次问答全链路记录 —— 可观测性的核心载体。
 *  将一次问答的 输入→中间结果→输出 全部封装在单一对象中，
 *  前端 ChatPanel 渲染对话、TracePanel 渲染检查链，都依赖此类型。
 *  @field query           - 用户原始提问
 *  @field retrievedAssets - 检索召回的 SearchResult 列表（已排序、已过滤）
 *  @field finalAnswer     - Agent 合成的最终回答文本
 *  @field references      - 回答所引用的资产来源（assetId + title），用于回答底部引用展示
 *  @field createdAt       - Trace 生成时间，TracePanel 时间轴用
 *  @field grounded        - 本次回答是否基于真实检索结果（false 表示未命中，Agent 明确拒答） */
export interface AgentTrace {
  query: string;
  retrievedAssets: SearchResult[];
  finalAnswer: string;
  references: { assetId: string; title: string }[]; // 引用到的资产来源列表
  createdAt: string;
  /** 检索结果为空时，Agent 明确拒答而非编造 */
  grounded: boolean;
}

// ── API 请求/响应体类型：前端与 API Route 的契约 ──────────

/** POST /api/assets 的请求体 */
export interface CreateAssetRequest {
  title: string;
  content: string;
  tags: string[];
}

/** POST /api/search 的请求体 */
export interface SearchRequest {

  query: string;
}

/** GET /api/search（此处用 POST）的响应体：检索结果数组 */
export interface SearchResponse {

  results: SearchResult[];
}

/** POST /api/agent/chat 的请求体 */
export interface AgentChatRequest {

  query: string;
}

/** POST /api/agent/chat 的响应体：包裹完整的 AgentTrace */
export interface AgentChatResponse {

  trace: AgentTrace;
}

/** 通用错误响应体，所有 API 出错时统一用此格式 */
export interface ApiError {
  error: string;
}
