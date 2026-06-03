# SA-011 ANOS Agent 通信协议 V1.0
**document_id:** SA-011 | **version:** V1.0.0

## 协议标准
- MCP (Model Context Protocol)
- 所有Agent通过 MCP Server 注册工具
- 工具调用格式: { agentId, tool, payload, auditId }

## Agent间通信
- Inquiry(销售→采购): 通过 Workflow Engine
- Offer(采购→销售): 通过 Workflow Engine
- 禁止跨域直连通信
