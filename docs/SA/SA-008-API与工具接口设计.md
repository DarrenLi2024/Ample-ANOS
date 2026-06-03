# SA-008 ANOS API与工具接口设计 V1.0

**document_id:** SA-008  
**version:** V1.0.0  
**status:** Active  
**layer:** SA  

---

## API 路由总览

| 路由 | 方法 | 用途 |
|------|------|------|
| /api/customers | CRUD | 客户管理 |
| /api/suppliers | CRUD | 供应商管理 |
| /api/products | CRUD | 产品管理 |
| /api/inquiries | CRUD | 询价管理 |
| /api/supply-resources | CRUD | 供应资源 |
| /api/opportunities | CRUD | 商机管理 |
| /api/offers | CRUD | 报价管理 |
| /api/ar | CRUD | AR管理 |
| /api/workflow/* | POST | 工作流引擎 |
| /api/agent-reasoning/* | POST | Agent推理 |
| /api/parse | POST | 文件解析 |
| /api/upload | POST | 文件上传 |
| /api/erp/* | GET | ERP集成 |
| /api/knowledge/* | GET | 知识检索 |

## MCP 工具

7个P0工具: customer-search / inquiry-create / supply-resource-search / opportunity-match / ar-risk-query / knowledge-search / audit-log-write
