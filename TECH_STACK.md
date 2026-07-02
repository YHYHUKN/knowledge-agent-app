# 技术选型说明

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端框架 | Next.js 14（App Router）+ React 18 | 服务端渲染，SEO 友好，API Route 一体化 |
| 类型安全 | TypeScript 5 | 严格类型，无 any 逃逸 |
| UI 组件库 | Ant Design 5 | 企业级 ToB 组件体系，主题定制能力强 |
| 样式方案 | Tailwind CSS + Ant Design ConfigProvider | 双层样式系统，快速响应式布局 |
| 图表可视化 | Recharts | 轻量级 React 图表库，支持响应式 |
| 图标 | @ant-design/icons + lucide-react | 互补覆盖，功能图标 + UI 图标 |
| 后端 | Next.js API Route | 与前端共用框架，无需独立服务 |
| 持久化 | localStorage（客户端） + 内存（服务端） | 资产管理走 localStorage（持久化），检索计算走服务端内存 |

## 选型理由

1. **Next.js App Router**：前后端一体化，API Route 不需要单独部署服务，降低复杂度
2. **Ant Design 5**：ToB 企业级组件库，自带主题系统（ConfigProvider），符合笔试要求的"克制、有产品感"审美
3. **localStorage 持久化**：笔试场景下最简单的持久化方案，无需数据库安装配置，浏览器内置即可
4. **关键词打分检索**：零依赖、纯 Node 内存计算、可解释性强，适合笔试规模（3 条种子数据）
5. **TypeScript 严格模式**：所有类型定义集中放在 `lib/types.ts`，无任何 `any` 逃逸
