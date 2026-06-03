# 01-ANOS项目范围与MVP定义 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** 项目范围 / MVP边界 / 第一阶段上线定义  
**上游文档：** [00-ANOS总体架构设计白皮书V1.0.md](00-ANOS总体架构设计白皮书V1.0.md)、[44-ANOS Trading Intelligence Architecture V1.0.md](44-ANOS%20Trading%20Intelligence%20Architecture%20V1.0.md)  
**版本：** V1.0  
**状态：** P0开发前基线

---

## 目录

- 第1章 MVP定义
- 第2章 第一阶段目标
- 第3章 范围内
- 第4章 范围外
- 第5章 P0角色
- 第6章 P0数据对象
- 第7章 P0 Agent
- 第8章 P0 Workflow
- 第9章 上线边界
- 第10章 待确认事项

---

# 第1章 MVP定义

ANOS第一阶段MVP不是完整ERP替代，也不是全量AI中台。

MVP定义为：

```text
基于飞书生态，跑通销售、采购、风控三类核心角色的交易智能闭环。
```

闭环链路：

```text
客户需求进入
↓
AI解析为Inquiry
↓
供应资源进入
↓
AI生成Opportunity
↓
销售/采购/风控协同处理
↓
AR风险可被自动发现和提醒
```

# 第2章 第一阶段目标

第一阶段目标：

- 建立ANOS Data Hub P0表。
- 建立AI Inbox基础入口。
- 建立销售、采购、风控三个工作台。
- 建立Sales Agent、Procurement Agent、Credit Agent基础能力。
- 建立RFQ、供应资源、商机匹配、AR风险四条核心Workflow。
- 建立Source First、权限、审计和验收机制。

# 第3章 范围内

P0范围内：

1. 飞书多维表格P0表建设。
2. ERP P0字段导入或同步。
3. AI Inbox基础版。
4. 销售工作台。
5. 采购工作台。
6. 风控工作台。
7. Inquiry Intake Workflow。
8. Supply Intake Workflow。
9. Opportunity Matching Workflow。
10. AR Risk Workflow。
11. Sales Agent基础版。
12. Procurement Agent基础版。
13. Credit Agent基础版。
14. Source Card与审计日志基础能力。

# 第4章 范围外

P0明确不做：

- 完整替代ERP。
- 完整替代金蝶。
- 自动下单、自动付款、自动冻结信用。
- 全量客户画像和供应商画像。
- 全量SQL中台。
- 全量知识图谱。
- HR OS、Culture OS、Agent Marketplace。
- 复杂BI与全量经营驾驶舱。
- 无人工确认的高风险Agent执行。

# 第5章 P0角色

| 角色 | MVP目标 |
| --- | --- |
| 销售 | 更快处理RFQ、生成报价建议、查看客户上下文 |
| 采购 | 更快录入供应资源、比较报价、发现替代资源 |
| 财务/风控 | 更早发现AR风险、生成催收和处置建议 |
| 管理层 | 查看核心交易与风险状态，不追求完整CEO驾驶舱 |
| 系统管理员 | 管理表、权限、Workflow、Agent状态 |

# 第6章 P0数据对象

P0数据对象：

1. Customer Base
2. Supplier Base
3. Product Base
4. Inquiry Base
5. Supply Resource Base
6. Opportunity Base
7. Offer Base
8. AR Risk Base

SO Base可作为P0增强项，若ERP同步条件不足，可先作为只读参考对象。

# 第7章 P0 Agent

| Agent | P0能力 | 禁止能力 |
| --- | --- | --- |
| Sales Agent | RFQ解析、客户摘要、报价建议、邮件草案 | 自动发送正式报价 |
| Procurement Agent | 资源解析、供应商比较、替代料建议 | 自动下采购单 |
| Credit Agent | AR风险识别、催收建议、停单建议 | 自动冻结客户信用 |

# 第8章 P0 Workflow

必须上线：

- WF-000 Asset Registration
- WF-001 Inquiry Intake
- WF-002 Supply Intake
- WF-003 Opportunity Matching
- WF-004 AR Risk

可选增强：

- WF-005 Quote Generation
- Workflow Operations Center基础视图

# 第9章 上线边界

MVP上线必须满足：

- P0表可用。
- 至少导入一批真实或脱敏ERP样例数据。
- AI Inbox可接收文本、Excel、截图或PDF中的至少两类输入。
- Inquiry和Supply Resource可自动或半自动结构化。
- Opportunity可基于规则或AI生成。
- AR风险可自动生成风险等级。
- 所有关键数据有Source、CapturedAt、Owner。
- 高风险动作需要人工确认。

# 第10章 待确认事项

以下事项需人类确认：

- 第一阶段是否把SO Base纳入必做。
- AI Inbox首批支持哪些输入类型。
- 真实飞书空间和表格Owner。
- ERP接口是否可用，还是先采用导入模式。
- Credit Agent风险评分口径。
- Opportunity Match Score第一版评分权重。
- MVP验收负责人和上线时间。

