# 24-API与工具接口设计 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** API契约 / Tool接口 / Portal、Agent、Workflow调用边界  
**上游文档：** [30-ANOS技术架构设计规范 V1.0.md](30-ANOS技术架构设计规范%20V1.0.md)、[45-Agent操作系统规范 V1.0.md](45-Agent操作系统规范%20V1.0.md)  
**版本：** V1.0  
**状态：** P0开发前基线

---

# 第1章 接口设计原则

API必须服务业务对象，不直接暴露ERP表结构。

原则：

- Object First：围绕Customer、Inquiry、Supply Resource等对象设计。
- Source First：写入必须携带来源字段。
- Permission First：调用前校验用户和Agent权限。
- Audit First：关键操作必须留痕。
- Human Approval：高风险动作只能创建建议，不直接执行。

# 第2章 API分层

| 层级 | 示例 |
| --- | --- |
| Data API | 查询Customer、创建Inquiry |
| Workflow API | 触发RFQ解析、触发AR风险计算 |
| Agent Tool API | Agent查询库存、生成建议 |
| Integration API | ERP、金蝶、飞书接入 |
| Audit API | 记录调用、输出、人工确认 |

# 第3章 P0 Data API

## Customer API

- `GET /customers`
- `GET /customers/{id}`
- `POST /customers`
- `PATCH /customers/{id}`

## Inquiry API

- `POST /inquiries`
- `GET /inquiries/{id}`
- `PATCH /inquiries/{id}`
- `POST /inquiries/{id}/parse`

## Supply Resource API

- `POST /supply-resources`
- `GET /supply-resources`
- `GET /supply-resources/{id}`
- `POST /supply-resources/{id}/verify`

## Opportunity API

- `POST /opportunities/match`
- `GET /opportunities`
- `PATCH /opportunities/{id}/status`

## AR Risk API

- `GET /ar-risks`
- `POST /ar-risks/calculate`
- `PATCH /ar-risks/{id}/status`

# 第4章 P0 Workflow API

- `POST /workflows/asset-registration/run`
- `POST /workflows/inquiry-intake/run`
- `POST /workflows/supply-intake/run`
- `POST /workflows/opportunity-matching/run`
- `POST /workflows/ar-risk/run`

Workflow返回：

- WorkflowRunID
- Status
- OutputObject
- ErrorMessage
- AuditID

# 第5章 Agent Tool接口

Agent不得直接访问底层表，必须通过Tool接口。

P0 Tool：

| Tool | 用途 |
| --- | --- |
| CustomerQueryTool | 查询客户上下文 |
| InquiryCreateTool | 创建需求 |
| SupplyResourceQueryTool | 查询供应资源 |
| OpportunityMatchTool | 生成商机 |
| ARRiskQueryTool | 查询AR风险 |
| KnowledgeSearchTool | 检索知识 |

# 第6章 请求公共字段

所有写入请求必须包含：

```json
{
  "source": {
    "sourceType": "Email",
    "sourceUrl": "...",
    "sourceOwner": "...",
    "eventTime": "2026-06-01T10:31:00+08:00",
    "capturedAt": "2026-06-01T10:35:00+08:00"
  },
  "actor": {
    "actorType": "Human",
    "actorId": "...",
    "department": "Sales"
  }
}
```

# 第7章 响应公共字段

统一响应：

```json
{
  "success": true,
  "data": {},
  "auditId": "AUD-...",
  "warnings": [],
  "errors": []
}
```

# 第8章 错误码

| 错误码 | 含义 |
| --- | --- |
| ANOS_400_VALIDATION_FAILED | 字段校验失败 |
| ANOS_401_UNAUTHORIZED | 未认证 |
| ANOS_403_FORBIDDEN | 无权限 |
| ANOS_404_NOT_FOUND | 对象不存在 |
| ANOS_409_CONFLICT | 数据冲突 |
| ANOS_422_SOURCE_REQUIRED | 缺少来源 |
| ANOS_500_INTERNAL_ERROR | 系统错误 |

# 第9章 审计要求

以下操作必须审计：

- 创建或修改业务对象。
- Agent调用Tool。
- Workflow执行。
- 权限变更。
- 导出数据。
- 人工确认高风险建议。

审计字段见 [25-权限与审计规范 V1.0.md](25-权限与审计规范%20V1.0.md)。

