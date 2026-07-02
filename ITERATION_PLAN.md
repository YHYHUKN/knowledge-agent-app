# 继续迭代优化说明

## 第一阶段：工程能力补强（低优先级）

| 优化项 | 改动文件 | 说明 |
|--------|---------|------|
| 真实 LLM 对接 | `lib/agent.ts` | 替换 synthesizeAnswer，支持 OpenAI / 通义千问等 |
| 持久化升级 | `lib/data.ts` | 将 globalThis 内存替换为 SQLite / PostgreSQL |
| 删除/编辑资产 | `app/api/assets/route.ts` + 前端 | 当前仅支持新增 |
| 资产搜索过滤 | `asset-list.tsx` | 前端增加标签筛选/关键词搜索 |

## 第二阶段：RAG 能力升级（中等优先级）

| 优化项 | 改动文件 | 说明 |
|--------|---------|------|
| 向量检索 | `lib/search.ts` | 接入 pgvector / Milvus / Pinecone |
| 文档 chunk 切分 | `lib/data.ts` | 长文本按段落/sentence 切分，支持细粒度召回 |
| 重排序（rerank） | `lib/search.ts` | 粗排 + 精排两阶段 |
| 混合检索 | `lib/search.ts` | 关键词 + 向量融合打分 |

## 第三阶段：ToB 产品化（高优先级）

| 优化项 | 说明 |
|--------|------|
| 多租户隔离 | 增加 tenantId 字段，JWT 鉴权，向量库 namespace 隔离 |
| 权限分级 | 管理员 / 普通用户 / 只读访客三角色权限控制 |
| Trace 持久化 | 将每次 AgentTrace 写入数据库/日志，支持后台审计 |
| 运营统计 | 问答量 / 召回率 / 拒答率仪表盘 |
| 内容审核 | 敏感词过滤，输出内容合规检查 |
| 高可用部署 | Docker 容器化 + Nginx 反向代理 + 健康检查 + 自动扩缩容 |

## 优先级排序逻辑

- P0（工程补强）：不补这些基础能力，后续迭代无法展开
- P1（RAG 升级）：向量检索是知识库产品的核心差异化能力
- P2（ToB 产品化）：决定产品能否从 demo 走到真实客户交付
