# 85-MCP服务规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** MCP服务规范 / Agent工具服务接口标准  
**上游文档：** [45-Agent操作系统规范 V1.0.md](45-Agent操作系统规范%20V1.0.md)、[24-API与工具接口设计 V1.0.md](24-API与工具接口设计%20V1.0.md)  
**版本：** V1.0  
**状态：** Agent工具服务基线

---

# 第1章 MCP定位

MCP服务用于让Agent安全调用ANOS业务能力。

Agent不得直接访问数据库、飞书表格或ERP接口，必须通过受控Tool。

# 第2章 服务边界

P0 MCP服务：

- customer-search
- inquiry-create
- supply-resource-search
- opportunity-match
- ar-risk-query
- knowledge-search
- audit-log-write

# 第3章 工具注册

每个MCP工具必须登记：

- ToolID
- ToolName
- Description
- Owner
- InputSchema
- OutputSchema
- PermissionScope
- AuditRequired
- RiskLevel

# 第4章 输入规范

Tool输入必须包含：

- actor
- requestId
- source
- payload

示例：

```json
{
  "actor": {
    "type": "Agent",
    "id": "SalesAgent"
  },
  "requestId": "REQ-001",
  "payload": {}
}
```

# 第5章 输出规范

Tool输出必须包含：

- success
- data
- evidence
- source
- confidence
- auditId
- errors

# 第6章 权限控制

调用前检查：

- Agent是否存在。
- Tool是否授权。
- 数据范围是否允许。
- 是否需要人工确认。

高风险工具只允许返回建议，不允许直接执行。

# 第7章 审计要求

所有MCP调用必须记录：

- ToolName
- Actor
- Input摘要
- Output摘要
- Timestamp
- Source
- Result
- Error

# 第8章 P0工具说明

## CustomerSearchTool

查询客户基本信息、历史RFQ、风险摘要。

## InquiryCreateTool

根据结构化RFQ创建Inquiry草案。

## SupplyResourceSearchTool

查询供应资源池。

## OpportunityMatchTool

基于Inquiry与Supply Resource生成Opportunity候选。

## ARRiskQueryTool

查询客户AR风险。

## KnowledgeSearchTool

检索飞书知识库和知识索引。

# 第9章 安全限制

MCP不得：

- 返回未授权敏感字段。
- 绕过权限访问底层系统。
- 自动执行付款、下单、信用冻结。
- 在日志中保存密钥。
- 将真实敏感数据发送到未授权模型。

# 第10章 后续扩展

P1可扩展：

- quote-generate
- email-draft
- workflow-run
- document-register
- supplier-evaluate

