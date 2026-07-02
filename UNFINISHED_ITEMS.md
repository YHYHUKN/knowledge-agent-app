# 未完成事项说明

## 真实 LLM 对接（加分项，未实现）

`lib/agent.ts` 中的 `synthesizeAnswer` 函数目前为**规则拼接 Mock 回答**，非真实大模型调用。

### 未实现原因

- 笔试核心考察的是 RAG 检索链路和工程架构，而非 LLM API 调用能力
- 真实 LLM 需要付费 API Key（OpenAI / 通义千问 / 豆包等），评审环境不一定有网络访问权限
- Mock 回答已完整展示"基于检索内容生成回答 + 禁止编造 + 引用来源"的核心逻辑

### 影响范围

仅此一个函数，上下游完全解耦：

- 前端 UI（ChatPanel / TracePanel）无需任何改动
- 类型定义（SearchResult / AgentTrace）无需任何改动
- API Route 逻辑无需任何改动

### 替换方式

只需实现 `synthesizeAnswer` 内部，将规则拼接替换为真实 LLM API 调用即可：

```typescript
// lib/agent.ts — synthesizeAnswer 改造示例
async function synthesizeAnswer(
  query: string,
  results: SearchResult[]
): Promise<{ answer: string; grounded: boolean }> {
  const context = results.map(r => `[${r.title}]: ${r.content}`).join("\n");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "你是一个知识库问答助手，仅根据提供的上下文回答，未提及内容一律说不知道。" },
      { role: "user", content: `上下文：\n${context}\n\n问题：${query}` }
    ]
  });
  return { answer: response.choices[0].message.content ?? "", grounded: true };
}
```

也可替换为国内模型（通义千问 / 豆包 / DeepSeek），只需修改 API endpoint 和 model 参数。
