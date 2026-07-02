// ── 核心数据类型 ──────────────────────────────────────────────

/** 知识资产：知识库中的一条原始文档/条目 */
export interface KnowledgeAsset {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string; // ISO 字符串
}

/** 检索结果：一次 search 命中的资产及相似度分数 */
export interface SearchResult {
  assetId: string;
  title: string;
  snippet: string;
  score: number; // 0 ~ 1，归一化后的相似度分数
}

/** Agent 的一次问答全链路记录，用于可观测面板 */
export interface AgentTrace {
  query: string;
  retrievedAssets: SearchResult[];
  finalAnswer: string;
  references: { assetId: string; title: string }[]; // 引用到的资产来源列表
  createdAt: string;
  /** 检索结果为空时，Agent 明确拒答而非编造 */
  grounded: boolean;
}

// ── API 请求/响应体类型 ──────────────────────────────────────

export interface CreateAssetRequest {
  title: string;
  content: string;
  tags: string[];
}

export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface AgentChatRequest {
  query: string;
}

export interface AgentChatResponse {
  trace: AgentTrace;
}

export interface ApiError {
  error: string;
}
