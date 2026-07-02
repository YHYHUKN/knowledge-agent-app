# AI 知识资产问答工作台

基于检索增强生成（RAG）思路实现的 ToB 知识库问答工作台。用户可以维护知识资产列表，并通过 Agent 对话框提问；Agent 严格基于检索到的资产内容作答，并展示完整的检索 → 生成全链路 Trace。

## 技术栈

- **框架**：Next.js 14（App Router）+ TypeScript
- **样式**：Tailwind CSS（未使用 shadcn CLI，出于零网络依赖 / 可读性考虑，手写了一套风格统一的基础 UI 组件，位于 `components/ui`）
- **后端**：Next.js API Route，内存数据存储（无数据库）
- **图标**：lucide-react

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:3000 即可使用。首次启动会自动预置 3 条内置知识资产。

> 数据仅存于 Node 进程内存中，**服务重启后会清空**，这是笔试场景下的有意设计（见需求"内存存储非持久化"）。

## 目录结构

```
app/                        Next.js App Router（页面 + API Route）
 ├─ layout.tsx              根布局
 ├─ page.tsx                首页入口
 ├─ globals.css             全局样式
 └─ api/                    后端接口（内存存储）
      ├─ assets/route.ts      GET/POST 资产管理
      ├─ search/route.ts      POST 关键词检索 Top-3
      └─ agent/chat/route.ts  POST Agent 问答全链路
lib/                        核心逻辑层（纯函数，可单测）
 ├─ types.ts                 全局 TS 类型定义
 ├─ data.ts                  globalThis 内存存储 + 种子数据
 ├─ search.ts                混合分词 + 加权打分检索算法
 ├─ agent.ts                 基于检索结果的回答合成
 └─ utils.ts                 通用工具函数
components/
 ├─ ui/                      基础 UI 组件（Button/Card/Dialog/Input/Feedback）
 └─ app/                     业务组件（Workbench/AssetList/AssetFormDialog/ChatPanel/TracePanel）
```

> 完整项目结构（含数据流向图、组件层级树、各模块职责速查）见 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

---

## 必答 5 问

### 1. 数据结构设计思路

三个核心类型分层对应 RAG 链路的三个阶段：

- `KnowledgeAsset`：知识库的原始存储单元，字段刻意保持精简（`id/title/content/tags/createdAt`），`content` 直接存纯文本而非分段，因为笔试规模下没有必要做 chunk 切分，但字段设计上已经预留了扩展 chunk 的空间（真实场景下可以把 `content` 拆成 `chunks: { id, text, embedding }[]`）。
- `SearchResult`：检索阶段的输出，不直接返回整条 `KnowledgeAsset`，而是返回 `assetId + title + snippet + score`。这样做的原因是检索结果是"引用"而非"实体"，前端展示引用来源时不需要整条原文，Trace 面板展示分数时也更轻量。
- `AgentTrace`：把一次问答的输入、中间结果、输出全部落在一个对象里（`query/retrievedAssets/finalAnswer/references/grounded`），本质上是把"可观测性"当作一等公民建模，而不是事后从日志里拼凑。`grounded` 字段显式标记本次回答是否基于真实检索结果，避免前端还要靠 `retrievedAssets.length` 去猜。

内存存储用 `globalThis` 挂载一个数组，是为了绕开 Next.js dev 模式下模块热重载（HMR）导致内存数据被重置的问题；生产环境这一层可以直接换成数据库连接池的单例模式。

### 2. 检索功能实现方案

当前实现是**关键词打分检索**，不依赖任何外部服务，纯 Node 内存计算：

1. 对 query 和文档（标题 / 标签 / 正文）分别做简易分词（按连续英文单词 / 数字 / 单个中文字切分）。
2. 打分采用加权命中：标题命中权重最高（0.5），标签次之（0.3），正文命中权重最低但可叠加（每次命中 0.08，设上限避免长文注水）。
3. 按 query 词数归一化到 0~1 分，过滤掉低于阈值（0.08）的结果，按分数降序取 Top 3。

这套方案的优点是零依赖、可解释、延迟极低，适合笔试场景；缺点也很明显——无法理解语义相近但字面不同的表达（比如"多智能体协作"和"Agent 分工"在关键词层面命中率会打折扣），这正是第 3 问要解决的问题。

### 3. 接入真实向量数据库的改造方案

改造集中在 `lib/search.ts` 和 `lib/data.ts` 两个文件，其余代码（API 层、前端）基本不用动，因为它们只依赖 `SearchResult` 这个稳定的接口契约：

1. **写入路径**：`addAsset` 新增资产时，额外调用 embedding 模型（如 OpenAI/Voyage/开源 bge 系列）把 `content` 转成向量，写入向量库（Pinecone / Milvus / pgvector / Weaviate 任选），元数据里带上 `assetId`。文本较长时应先做 chunk 切分（比如按 300~500 token 滑窗），一条资产对应多个向量。
2. **检索路径**：`searchAssets` 改为：query 先过 embedding 模型得到 query 向量，再调用向量库的相似度检索（cosine/dot），拿到 Top-K 的 `(chunkId, score)`，反查回 `assetId` 和原文片段，映射成现有的 `SearchResult` 结构返回。分数从"关键词命中率"变成"余弦相似度"，量纲不同但接口不变。
3. **可选增强**：加一层重排序（rerank 模型）在向量召回的粗排结果上做精排；关键词检索也可以保留作为向量检索的补充（混合检索 / hybrid search），尤其是对精确术语、编号、代码片段这类向量模型不敏感的内容。
4. **一致性**：需要在资产更新 / 删除时同步维护向量库里的对应记录，避免"知识库里的资产已改，向量库还是旧的"这种不一致。

### 4. 多租户隔离实现方案

当前实现是单租户（全局共享一份内存数据），改造成多租户需要在几个层面同时做隔离：

- **数据层**：`KnowledgeAsset` 增加 `tenantId` 字段，所有查询（`getAllAssets`/`getAssetById`/`addAsset`）强制带上 `tenantId` 过滤，杜绝"忘记加 where 条件"导致的越权。如果换成真实数据库，优先用行级安全（Row-Level Security，如 Postgres RLS）在数据库层兜底，而不是只依赖应用层代码自觉过滤。
- **身份与鉴权**：接口需要先做身份认证（如 JWT / Session），从 token 中解出 `tenantId` 和 `userId`，而不是信任前端传入的租户参数，防止伪造请求跨租户读取数据。
- **检索/向量库隔离**：如果接入向量数据库，检索时必须带 `tenantId` 作为 metadata filter 一起查询，否则会出现"A 租户提问，召回到 B 租户私有资料"这种严重的数据泄露问题；更严格的方案是不同租户物理隔离 collection/namespace。
- **资源与配额**：多租户场景下还要考虑单租户的资产数量、调用频率配额，避免个别租户占满共享的计算/存储资源影响其他租户。

### 5. 上线 ToB 的核心风险点

- **回答幻觉 / 越界作答**：当前用规则拼接答案本身不会编造，但如果换成真实 LLM 生成，必须在 prompt 层面严格约束"只能用给定 context 回答，未提及内容一律说不知道"，并配合"grounded 判定 + 引用来源展示"作为兜底，让用户能自行核实回答是否可信。
- **数据安全与租户隔离**：如第 4 问所述，一旦检索层或向量库没做好隔离，会直接造成客户数据泄露，这是 ToB 场景下最不可接受的风险，需要在设计和测试阶段都重点覆盖。
- **成本与延迟不可控**：引入向量检索 + LLM 生成后，每次问答的成本和延迟都会显著上升，需要有缓存策略（相同/相似 query 复用结果）、超时降级方案（检索或生成超时时如何兜底）、以及成本监控和限流。
- **可观测性缺口**：线上出问题时（回答错误、检索不到、超时）需要能追溯到具体是哪一步出错，当前的 `AgentTrace` 只是内存里返回给前端展示，生产环境还需要把每次 Trace 持久化到日志系统，配合告警和人工复核流程。
- **内容合规与权限泄露**：知识资产可能包含敏感信息，需要有分级权限控制（管理员/普通用户/只读）和内容审核机制，避免低权限用户通过问答"绕过"权限直接拿到不该看到的内容。
