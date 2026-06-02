# 12-Agent Network总体设计规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** Agent Network总体设计 / 数字员工组织架构  
**上游文档：** [00-ANOS总体架构设计白皮书V1.0.md](00-ANOS总体架构设计白皮书V1.0.md)  
**关联文档：** [45-Agent操作系统规范 V1.0.md](45-Agent操作系统规范 V1.0.md)  
**版本：** V1.0  
**状态：** 开发前架构基线

---

## 目录

- 第1章 设计哲学
- 第2章 Agent组织架构
- 第3章 第一阶段核心Agent
- 第4章 Agent Memory体系
- 第5章 Agent协同机制
- 第6章 Agent能力评级
- 第7章 Agent KPI体系
- 第8章 建设优先级
- 第9章 飞书生态集成

---

# 第1章 设计哲学

传统ERP的工作链路是：

```text
人
↓
系统
↓
数据
```

ANOS的工作链路是：

```text
人
↓
Agent
↓
数据 / 知识 / 工具
↓
Agent协同
↓
业务结果
```

因此，Agent不是聊天功能，而是数字员工。

员工未来真正感知到的不是菜单和表格，而是AI销售助手、AI采购专家、AI风控管理员、AI经营顾问等角色化Agent。

# 第2章 Agent组织架构

ANOS采用三层Agent架构：

```text
L1 Executive Agent
L2 Functional Agent
L3 Specialist Agent
```

## L1 Executive Agent

战略层Agent，相当于数字高管团队。

| Agent | 定位 | 核心职责 |
| --- | --- | --- |
| CEO Agent | 数字CEO助理 | 经营分析、利润分析、风险分析、战略建议 |
| COO Agent | 数字运营官 | 流程监控、执行效率、跨部门协同 |
| CFO Agent | 数字财务官 | 现金流、AR/AP、利润预测、财务风险 |

## L2 Functional Agent

业务部门Agent，直接服务一线工作流。

| Agent | 连接对象 | 核心能力 |
| --- | --- | --- |
| Sales Agent | Customer、Inquiry、Offer、SO | RFQ解析、客户分析、跟进建议、报价草案 |
| Procurement Agent | Supplier、Inventory、PO、Market Intelligence | 供应商推荐、国产替代、价格分析、交期分析 |
| Credit Agent | AR、AP、Credit、Risk | AR监控、风险评级、催收建议 |
| Knowledge Agent | 飞书知识库、云文档、OpenClaw | 知识归档、知识分类、知识问答、知识推荐 |

## L3 Specialist Agent

专家型Agent，解决垂直领域问题。

| Agent | 核心能力 |
| --- | --- |
| Localization Agent | 国产替代推荐、风险分析、品牌比较 |
| Manufacturer Intelligence Agent | 原厂动态、代理机会、产品路线图 |
| Quality Agent | 质量预警、异常分析、8D建议 |
| HR Agent | 招聘建议、培养建议、晋升建议 |

# 第3章 第一阶段核心Agent

第一阶段不要一次建设过多Agent。

P0 Agent：

1. Sales Agent
2. Procurement Agent
3. Credit Agent

原因：

- 直接服务销售、采购、风控三个核心部门。
- 能覆盖RFQ、报价、供应资源、AR风险等高频场景。
- 能最快验证ANOS对收入、效率和风险控制的价值。

# 第4章 Agent Memory体系

Agent是否可持续变强，关键在Memory。

ANOS定义四层记忆：

| 层级 | 名称 | 示例 |
| --- | --- | --- |
| M1 | 用户记忆 | 用户习惯、常见客户、沟通风格、历史偏好 |
| M2 | 部门记忆 | 销售成交案例、采购经验、供应商黑名单 |
| M3 | 企业记忆 | 飞书知识库、云文档、会议纪要、制度流程 |
| M4 | 行业记忆 | Datasheet、PCN、EOL、市场情报、原厂资料 |

Memory必须有来源、时间、权限、负责人和更新机制。

# 第5章 Agent协同机制

ANOS不是单Agent系统，而是Agent Team。

典型RFQ协同链路：

```text
Sales Agent
解析RFQ
↓
Procurement Agent
查找供应资源
↓
Inventory Agent
检查库存
↓
Credit Agent
检查客户信用
↓
Sales Agent
生成报价建议
↓
人工确认
```

关键原则：

- Agent可以分析和建议。
- Agent不得绕过Workflow直接执行高风险动作。
- 涉及报价、付款、信用冻结、供应商评级等动作必须保留人工确认。

# 第6章 Agent能力评级

ANOS统一采用五级Agent能力模型：

| 等级 | 名称 | 特征 |
| --- | --- | --- |
| L1 | 规则驱动 | 根据固定规则回复或执行 |
| L2 | 知识驱动 | 能引用知识库和文档回答 |
| L3 | 推理驱动 | 能结合数据与知识生成建议 |
| L4 | 协同驱动 | 能与其他Agent和Workflow协作 |
| L5 | 自主执行 | 在受控权限下自动完成闭环任务 |

当前阶段目标是L2-L3，2027年目标提升至L3-L4。

# 第7章 Agent KPI体系

Agent也需要考核。

| Agent | KPI |
| --- | --- |
| Sales Agent | RFQ处理数、报价效率、成交率提升 |
| Procurement Agent | 资源发现量、采购周期、成本优化、交期优化 |
| Credit Agent | 风险发现率、AR下降、坏账率下降 |
| Knowledge Agent | 知识沉淀量、知识调用率、回答引用率 |

KPI不能只统计调用次数，必须回到业务结果。

# 第8章 建设优先级

## P0

- Sales Agent
- Procurement Agent
- Credit Agent

## P1

- Knowledge Agent
- CEO Agent
- Quality Agent

## P2

- HR Agent
- Localization Agent
- Manufacturer Intelligence Agent

# 第9章 飞书生态集成

Agent Network不应作为孤立系统建设。

第一阶段应优先运行在：

- 飞书Aily
- 飞书智能体
- OpenClaw
- 飞书多维表格
- 飞书知识库
- 飞书工作流

目标链路：

```text
Portal
↓
Agent Network
↓
Workflow Engine
↓
Feishu Data Hub
↓
ERP / Kingdee / Knowledge Hub
```

本规范定义Agent Network的组织形态；具体Agent标准、输出格式、工具注册、审计日志见 [45-Agent操作系统规范 V1.0.md](45-Agent操作系统规范 V1.0.md)。

