# 45-Agent操作系统规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** Agent OS标准 / Agent运行、工具、输出、审计规范  
**上游文档：** [12-Agent Network总体设计规范 V1.0.md](12-Agent%20Network总体设计规范%20V1.0.md)  
**版本：** V1.0  
**状态：** Agent开发基线

---

# 第1章 Agent不是Chatbot

传统企业AI助手通常是问答机器人。

ANOS中的Agent是数字员工，必须具备：

- Identity
- Responsibility
- Permission
- Memory
- Knowledge
- Tools
- Workflow
- KPI
- Audit

# 第2章 Agent标准模型

```text
Agent
├── Identity
├── Memory
├── Knowledge
├── Workflow
├── Tools
├── Decision
├── Action
└── Audit
```

示例：

```yaml
name: Procurement Agent
role: AI采购专家
department: Supply Chain
level: L2 Functional Agent
owner: Procurement Department
```

# 第3章 Responsibility标准

每个Agent必须明确做什么与不做什么。

以Procurement Agent为例：

做：

- 供应商管理
- 资源收集
- 价格分析
- 交期分析
- 国产替代建议

不做：

- 最终审批
- 付款授权
- 合同签署
- 未经确认的供应商评级变更

# 第4章 Permission标准

Agent权限必须最小化。

Procurement Agent可读：

- Supplier Base
- Inventory
- Supply Resource Pool
- Product Base

Procurement Agent不可读：

- HR工资数据
- CEO战略文档
- 财务敏感字段

Agent可执行动作必须通过Workflow授权。

# 第5章 Memory标准

Memory分四层：

- M1 Personal Memory：个人习惯、常用客户、偏好。
- M2 Team Memory：团队经验、供应商黑名单、历史案例。
- M3 Enterprise Memory：飞书知识库、会议纪要、制度。
- M4 Industry Memory：Datasheet、PCN、EOL、原厂资料。

Memory必须具备Owner、权限、来源、时间和淘汰机制。

# 第6章 Knowledge标准

Agent回答任何业务问题，必须返回：

```text
结论
依据
来源
时间
可信度
```

错误输出：

```text
建议采购ABC。
```

正确输出：

```text
建议采购ABC。
依据：库存充足，交期满足。
来源：ABC Electronics邮件。
时间：2026-06-01。
可信度：92%。
```

# 第7章 Tool标准

所有Agent工具必须统一注册。

## Agent Tool Registry

字段：

- ToolID
- ToolName
- ToolType
- Owner
- Status
- PermissionScope
- AuditRequired

工具分类：

| 类型 | 示例 |
| --- | --- |
| Data Tool | Customer Query、Inventory Query |
| Knowledge Tool | Knowledge Search |
| Workflow Tool | Create Inquiry、Create Risk Case |
| Communication Tool | Send Email、Send Feishu Message |

# 第8章 Workflow标准

Agent不能直接行动，必须经过Workflow。

标准链路：

```text
发现
↓
分析
↓
建议
↓
人工确认
↓
执行
↓
审计
```

Human-in-the-loop是Agent OS的强制原则。

# 第9章 Output标准

所有Agent统一输出结构：

- Executive Summary
- Evidence
- Source
- Timestamp
- Confidence
- Recommended Action
- Risk
- Human Approval Required

# 第10章 KPI标准

| Agent | KPI |
| --- | --- |
| Sales Agent | RFQ处理量、报价效率、成交提升 |
| Procurement Agent | 资源发现量、价格优化、交期优化 |
| Credit Agent | 风险发现率、AR下降率 |
| Knowledge Agent | 知识沉淀量、知识调用率 |

# 第11章 Audit标准

所有Agent动作必须记录。

## Agent Audit Log

字段：

- AgentID
- TaskID
- User
- Input
- Output
- Source
- Timestamp
- ModelVersion
- PromptVersion
- Outcome

审计日志是未来权限、安全、复盘和责任划分的基础。

# 第12章 Evolution体系

Agent成长等级：

| 等级 | 名称 |
| --- | --- |
| L1 | 规则型 |
| L2 | 知识型 |
| L3 | 推理型 |
| L4 | 协同型 |
| L5 | 自治型 |

ANOS目标：

```text
2026：L2-L3
2027：L3-L4
2028：L4-L5
```

L5不等于无限自主，仍必须受权限、Workflow和审计约束。

