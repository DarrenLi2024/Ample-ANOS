# 30-ANOS技术架构设计规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** 基于飞书生态的AI Native电子元器件行业操作系统技术蓝图  
**上游文档：** [00-ANOS总体架构设计白皮书V1.0.md](00-ANOS总体架构设计白皮书V1.0.md)  
**版本：** V1.0  
**状态：** 开发前技术基线

---

## 目录

- 第1章 技术架构原则
- 第2章 总体技术架构
- 第3章 飞书技术栈定位
- 第4章 Data Hub架构
- 第5章 Integration Layer
- 第6章 Workflow Engine
- 第7章 Memory架构
- 第8章 RAG架构
- 第9章 时间戳与来源体系
- 第10章 权限体系
- 第11章 技术演进路线

---

# 第1章 技术架构原则

ANOS不是重新开发ERP。

ANOS定位：

```text
ERP = Transaction System
ANOS = Intelligence System
```

ERP负责记录交易，ANOS负责理解交易、分析交易、预测交易、驱动交易。

技术原则：

- AI Native First：AI不是外挂，而是系统原生能力。
- Feishu Native First：优先飞书生态，避免重复建设。
- Event Driven First：事件驱动优先，不以表单录入为中心。
- API First：核心能力必须可被Portal、Agent、Workflow调用。
- Human-in-the-loop：高风险动作必须保留人工确认。
- Source First：所有结论必须可追溯来源和时间。

# 第2章 总体技术架构

```text
┌─────────────────────────────┐
│        Portal Layer         │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│        Agent Layer          │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│      Workflow Layer         │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│       Data Hub Layer        │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│     Integration Layer       │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│ ERP / Kingdee / Feishu KB   │
└─────────────────────────────┘
```

各层职责：

| 层级 | 主要职责 |
| --- | --- |
| Portal Layer | 用户工作入口、角色工作台、AI Inbox |
| Agent Layer | 数字员工、推理、建议、跨Agent协同 |
| Workflow Layer | 事件触发、流程编排、人工确认、通知 |
| Data Hub Layer | 业务对象、事件、画像、评分、知识索引 |
| Integration Layer | ERP、金蝶、飞书、邮件、文件、第三方API接入 |

# 第3章 飞书技术栈定位

| 能力 | 第一阶段技术实现 |
| --- | --- |
| Portal | 飞书妙搭 / 飞书应用 |
| 数据库 | 飞书多维表格 |
| 文档 | 飞书云文档 |
| 知识库 | 飞书知识库 |
| 工作流 | 飞书工作流 / 多维表格自动化 |
| Agent | 飞书Aily + OpenClaw |
| IM协同 | 飞书消息 |
| 权限 | 飞书组织架构 |

第一阶段不优先建设重型自研中台。只有当数据量、权限、性能或集成复杂度超过飞书承载能力时，才逐步引入Middleware SQL。

# 第4章 Data Hub架构

数据源：

```text
ERP
金蝶
邮件
WhatsApp / 微信
飞书
Excel
PDF
图片 / 截图
```

接入层统一定义为Data Connector，职责包括：

- 拉取
- 解析
- 清洗
- 标准化
- 记录来源
- 写入ANOS标准模型

Data Hub分层：

| 层级 | 数据对象 |
| --- | --- |
| L0 主数据 | Customer、Supplier、Product、Employee |
| L1 交易数据 | Inquiry、Offer、SO、PO |
| L2 财务数据 | AR、AP、Credit、Risk |
| L3 智能数据 | Profile、Score、Prediction |
| L4 知识数据 | Knowledge、Datasheet、PCN、EOL |
| L5 Agent数据 | Agent Registry、Agent Task、Audit Log |

# 第5章 Integration Layer

## ERP API

第一阶段以Pull为主，建议30分钟级同步，具体频率待接口能力确认。

P0同步对象：

- Customer
- Supplier
- Product
- Inquiry
- Offer
- SO
- AR

## 金蝶API

同步对象：

- AR
- AP
- Invoice
- Payment

## 飞书知识库

同步对象：

- 制度
- 流程
- 会议纪要
- 培训资料
- 项目复盘

## 邮件与文件系统

同步对象：

- RFQ
- PO
- Invoice
- 报价单
- 库存表
- 截图与附件

# 第6章 Workflow Engine

ANOS必须是AI + Workflow，而不是聊天机器人。

典型RFQ流程：

```text
客户RFQ邮件
↓
自动解析
↓
生成Inquiry
↓
匹配库存与供应资源
↓
检查客户信用
↓
生成报价建议
↓
推送销售
↓
人工确认
```

Workflow负责把事件、数据、Agent和人连接起来。

# 第7章 Memory架构

Memory分四层：

- User Memory：用户习惯、偏好、常见客户。
- Department Memory：销售经验、采购经验、风控案例。
- Enterprise Memory：知识库、文档、会议纪要、制度。
- Industry Memory：Datasheet、PCN、EOL、品牌资料、市场情报。

Memory必须具备权限、来源、时间、Owner和生命周期管理。

# 第8章 RAG架构

RAG统一知识来源：

- 飞书知识库
- 飞书云文档
- ERP备注
- 产品资料
- 会议纪要
- 行业资料

Agent输出必须包含：

```text
答案
依据
来源
时间戳
可信度
```

# 第9章 时间戳与来源体系

所有信息必须具备：

| 字段 | 含义 |
| --- | --- |
| Source | 来源 |
| SourceType | 来源类型 |
| SourceURL | 来源链接 |
| Author | 作者或来源人 |
| EventTime | 原始事件时间 |
| CapturedAt | 系统采集时间 |
| UpdatedAt | 更新时间 |
| RetrievedAt | 检索时间 |
| VerifiedBy | 验证人 |
| ConfidenceScore | 可信度 |

所有AI结论必须可追溯。

# 第10章 权限体系

基础角色：

- CEO
- 销售
- 采购
- 财务/风控
- HR
- QC
- 系统管理员
- Agent

权限维度：

- 页面权限
- 数据权限
- 字段权限
- Agent调用权限
- Workflow执行权限
- 知识访问权限
- 下载与分享权限

Agent也必须作为受控主体管理。

# 第11章 技术演进路线

| 阶段 | 时间 | 技术目标 |
| --- | --- | --- |
| Phase 1 | 0-3个月 | Data Hub + Sales Agent + Credit Agent |
| Phase 2 | 3-9个月 | Portal + Workflow + Knowledge Hub |
| Phase 3 | 9-18个月 | Multi-Agent + Memory + RAG |
| Phase 4 | 18-36个月 | Trading Intelligence OS |

第一阶段以飞书原生和低代码能力快速验证业务闭环；后续再逐步沉淀SQL、MCP、API Gateway和独立Middleware。

