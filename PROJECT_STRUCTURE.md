# 项目结构总览

## 完整文件树

```
knowledge-agent-app/
│
├── app/                                    # Next.js App Router 页面与 API
│   ├── layout.tsx                          # 根布局：全局字体、body 样式
│   ├── page.tsx                            # 首页：挂载 <Workbench /> 主组件
│   ├── globals.css                         # Tailwind 指令 + 全局 CSS 变量 + 滚动条
│   └── api/
│       ├── assets/
│       │   └── route.ts                    # GET /api/assets → 获取全部资产
│       │                                   # POST /api/assets → 新增资产（含校验）
│       ├── search/
│       │   └── route.ts                    # POST /api/search → 检索 Top-3 结果
│       └── agent/
│           └── chat/
│               └── route.ts                # POST /api/agent/chat → Agent 问答全链路
│
├── lib/                                    # 核心逻辑层（纯函数，无 UI 依赖）
│   ├── types.ts                            # 所有 TS 类型定义（KnowledgeAsset / SearchResult / AgentTrace / API 契约）
│   ├── data.ts                             # 内存存储（globalThis 挂载）+ 3 条内置种子数据
│   ├── search.ts                           # 关键词打分检索算法（分词 → 加权打分 → 归一化 → Top-K）
│   ├── agent.ts                            # 回答合成逻辑（严格基于检索结果拼接，不调用 LLM）
│   └── utils.ts                            # 通用工具（cn() 样式合并 / 日期格式化）
│
├── components/
│   ├── ui/                                 # 基础 UI 组件（无业务逻辑，可复用）
│   │   ├── button.tsx                      # <Button>：8 种变体（brand/signal/ghost/outline/danger/success/subtle 等）
│   │   ├── card.tsx                        # <Card> + <Badge>：卡片容器与标签徽章
│   │   ├── dialog.tsx                      # <Dialog>：模态弹窗（含 ESC 关闭和背景遮罩）
│   │   ├── input.tsx                       # <Input> + <Textarea>：表单控件
│   │   └── feedback.tsx                    # <Skeleton> + <EmptyState>：兜底状态组件
│   │
│   └── app/                                # 业务组件（直接对应产品功能模块）
│       ├── workbench.tsx                   # 顶层容器：编排左侧资产面板 + 右侧对话面板布局
│       ├── asset-list.tsx                  # 资产列表：卡片展示 + Loading 骨架屏 + 空状态
│       ├── asset-form-dialog.tsx           # 新增弹窗：Title / Content / Tags 三字段表单
│       ├── chat-panel.tsx                  # 对话面板：输入框 → 发送 → 展示回答 + 引用来源 + Trace 开关
│       └── trace-panel.tsx                 # Trace 面板：时间轴展示 Query → Retrieval（含分数）→ Answer
│
├── package.json                            # 依赖声明（Next.js 14 / React 18 / Tailwind / lucide-react）
├── tsconfig.json                           # TypeScript 配置（路径别名 @/ → 项目根）
├── tailwind.config.ts                      # Tailwind 主题（品牌色 / 间距 / 圆角 / 字体族）
├── postcss.config.mjs                      # PostCSS 配置（Tailwind + autoprefixer）
├── next.config.mjs                         # Next.js 配置
├── .gitignore                              # Git 忽略规则（node_modules / .next / .workbuddy 等）
│
├── README.md                               # 项目说明 + 必答 5 问
└── PROJECT_STRUCTURE.md                    # ← 本文件：项目结构总览
```

---

## 数据流向图

```
用户操作                                          系统处理
─────────                                        ─────────

[资产管理]
  浏览列表 ──GET /api/assets──────────────→ data.ts: getAllAssets()
                                          └→ 返回 KnowledgeAsset[]

  新增资产 ──POST /api/assets─────────────→ data.ts: addAsset(input)
        ↑   {title, content, tags}         └→ 种子数据追加到 globalThis 数组
        │
        └── 成功后自动刷新列表


[Agent 问答]
  输入问题 ──POST /api/agent/chat─────────→ agent.ts: runAgentChat(query)
           {query}                            │
                                              ├─ ① search.ts: searchAssets(query)
                                              │   └→ 分词 → 标题/标签/正文加权打分
                                              │   └→ 归一化 → 阈值过滤 → Top-3
                                              │   └→ 返回 SearchResult[]
                                              │
                                              ├─ ② agent.ts: synthesizeAnswer(query, results)
                                              │   └→ 拼接 retrieved docs 为上下文
                                              │   └→ 附说明性文字 "以下是基于您知识库…"
                                              │   └→ 按 retrieved 顺序编号引用
                                              │
                                              └─ ③ 组装 AgentTrace
                                                  { query, retrievedAssets (含分数),
                                                    finalAnswer, references, grounded }
                                                  └→ 返回前端 ChatPanel + TracePanel 展示


[直接检索（可选）]
  POST /api/search ───────────────────────→ search.ts: searchAssets(query)
  {query}                                   └→ 返回 SearchResult[]
```

---

## 组件层级树

```
<Workbench>                                    ← app/page.tsx
├── 左侧面板 (.w-96)
│   ├── Header: "知识资产" + [新增资产] 按钮
│   └── <AssetList>                            ← components/app/asset-list.tsx
│       ├── Loading 态 → <Skeleton> 卡片 × 3
│       ├── Empty 态  → <EmptyState> "暂无资产"
│       └── Normal 态 → <Card> × N
│           └── 每张卡片: title / tags <Badge> / content 预览 / 时间
│
├── 右侧面板 (flex-1)
│   └── <ChatPanel>                            ← components/app/chat-panel.tsx
│       ├── 空状态 → <EmptyState> "输入问题开始对话"
│       ├── Loading → <Skeleton> 回答区域骨架
│       └── 对话列表
│           └── 每条对话
│               ├── 用户问题 (右侧气泡)
│               ├── Agent 回答 (左侧 + 引用来源 <Badge>)
│               └── [展开 Trace]
│                   └── <TracePanel>            ← components/app/trace-panel.tsx
│                       ├── ① Query 步骤
│                       ├── ② Retrieval 步骤
│                       │   └── 每条结果: 标题 + snippet + ScoreBar (0~1 分数条)
│                       └── ③ Generation 步骤
│                           └── grounded: true/false 标记
│
├── <AssetFormDialog>                           ← components/app/asset-form-dialog.tsx
│   └── <Dialog>
│       └── form: Title <Input> + Content <Textarea> + Tags <Input>
```

---

## 各模块职责速查

### `lib/` — 核心逻辑（无 UI 依赖，可独立单测）

| 文件 | 导出 | 一句话职责 |
|------|------|-----------|
| `types.ts` | `KnowledgeAsset`, `SearchResult`, `AgentTrace`, API 请求/响应类型 | 全局类型源，所有模块的类型契约 |
| `data.ts` | `getAllAssets()`, `getAssetById()`, `addAsset()` | 内存 CRUD，种子数据注入，globalThis 防 HMR 重置 |
| `search.ts` | `searchAssets(query)` | 中英文混合分词 + 标题/标签/正文加权打分 + Top-K 过滤 |
| `agent.ts` | `runAgentChat(query)` | 检索 → synthesizeAnswer 拼回答 → 组装完整 AgentTrace |
| `utils.ts` | `cn()`, `formatDateTime()` | Tailwind 类名合并，日期格式化 |

### `components/ui/` — 基础组件

| 文件 | 组件 | 说明 |
|------|------|------|
| `button.tsx` | `Button` | 8 种 variant，3 种 size，loading 态 |
| `card.tsx` | `Card`, `Badge` | 卡片容器 + 行内标签徽章 |
| `dialog.tsx` | `Dialog` | 受控模态框，ESC/背景点击关闭，body 滚动锁定 |
| `input.tsx` | `Input`, `Textarea` | forwardRef 表单控件，focus 品牌色高亮 |
| `feedback.tsx` | `Skeleton`, `EmptyState` | 骨架屏占位 + 空数据插图 |

### `components/app/` — 业务组件

| 文件 | 组件 | 数据依赖 |
|------|------|---------|
| `workbench.tsx` | `Workbench` | `GET /api/assets` → `KnowledgeAsset[]` |
| `asset-list.tsx` | `AssetList` | props: `assets[]`, callback: `onAddClick` |
| `asset-form-dialog.tsx` | `AssetFormDialog` | `POST /api/assets`, callback: `onCreated` |
| `chat-panel.tsx` | `ChatPanel` | `POST /api/agent/chat`, 本地 `ChatEntry[]` 状态 |
| `trace-panel.tsx` | `TracePanel` | props: `trace: AgentTrace` |

### `app/api/` — 后端路由

| 路由 | 方法 | 入参 | 出参 | 核心调用 |
|------|------|------|------|---------|
| `/api/assets` | GET | — | `{ assets: KnowledgeAsset[] }` | `getAllAssets()` |
| `/api/assets` | POST | `{ title, content, tags }` | `{ asset }` (201) 或 `{ error }` (400) | `addAsset()` |
| `/api/search` | POST | `{ query }` | `{ results: SearchResult[] }` | `searchAssets()` |
| `/api/agent/chat` | POST | `{ query }` | `{ trace: AgentTrace }` | `runAgentChat()` |

---

## 关键设计决策

| 决策 | 原因 |
|------|------|
| `globalThis` 挂载内存数据 | 规避 Next.js dev 模式 HMR 导致内存重置 |
| 手写 UI 组件（非 shadcn CLI） | 零网络依赖 / 代码可读性 / 笔试场景简约优先 |
| 关键词打分检索（非向量） | 零外部服务依赖，延迟极低，算法逻辑透明可解释 |
| `synthesizeAnswer` 不用 LLM | 严格满足"禁止凭空编造"的硬性约束 |
| `AgentTrace.grounded` 字段 | 显式标记回答是否基于真实检索，便于前端判断 |
| 分数低于阈值直接过滤 | 避免把不相关结果"强行凑数"送给回答生成 |
