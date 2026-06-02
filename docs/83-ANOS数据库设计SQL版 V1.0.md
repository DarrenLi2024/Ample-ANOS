# 83-ANOS数据库设计SQL版 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** Middleware SQL数据库设计 / 飞书多维表格未来演进边界  
**上游文档：** [42-ANOS数据中台建表蓝图 V1.0.md](42-ANOS数据中台建表蓝图%20V1.0.md)  
**版本：** V1.0  
**状态：** 未来SQL化设计基线

---

# 第1章 设计定位

P0阶段优先飞书多维表格。

SQL版用于以下场景：

- 数据量超过飞书承载能力。
- 复杂关联查询。
- Event Store。
- Memory Store。
- 审计日志。
- API服务稳定性要求提高。

# 第2章 Schema分层

建议Schema：

```text
master
trading
finance
intelligence
knowledge
agent
workflow
audit
integration
```

# 第3章 通用字段

所有业务表包含：

```sql
id
source_type
source_url
source_owner
event_time
captured_at
created_at
updated_at
created_by
updated_by
status
confidence_score
```

# 第4章 Master表

核心表：

- master.customers
- master.contacts
- master.suppliers
- master.products
- master.brands

产品唯一约束建议：

```text
brand + mpn
```

# 第5章 Trading表

核心表：

- trading.inquiries
- trading.supply_resources
- trading.opportunities
- trading.offers
- trading.sales_orders
- trading.purchase_orders
- trading.inventory
- trading.inventory_transactions

Opportunity关联：

```text
opportunity
├── inquiry_id
└── supply_resource_id
```

# 第6章 Finance表

核心表：

- finance.ar_items
- finance.ap_items
- finance.credit_profiles
- finance.risk_cases

P0优先：

- ar_items
- risk_cases

# 第7章 Intelligence表

核心表：

- intelligence.customer_profiles
- intelligence.supplier_profiles
- intelligence.product_profiles
- intelligence.market_intelligence
- intelligence.match_scores

# 第8章 Agent表

核心表：

- agent.agent_registry
- agent.agent_tasks
- agent.agent_tool_registry
- agent.agent_audit_logs
- agent.memory_items

# 第9章 Workflow表

核心表：

- workflow.workflow_registry
- workflow.workflow_runs
- workflow.workflow_events
- workflow.approvals

# 第10章 Audit表

核心表：

- audit.audit_logs
- audit.permission_changes
- audit.data_exports

审计日志不得被业务用户修改。

# 第11章 Integration表

核心表：

- integration.source_records
- integration.sync_jobs
- integration.sync_errors
- integration.field_mappings
- integration.conflict_queue

# 第12章 飞书与SQL同步关系

P0：

```text
飞书为主存储
SQL可不启用
```

P1：

```text
飞书承载协作
SQL承载Event/Audit
```

P2：

```text
SQL承载核心业务数据
飞书承载前台协作与视图
```

