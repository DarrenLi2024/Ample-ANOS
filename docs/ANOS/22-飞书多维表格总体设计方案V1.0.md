# 22-飞书多维表格总体设计方案 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** ANOS Data Hub / 飞书多维表格建设规范  
**上游标准：** [20-ANOS企业数据字典V1.0.md](20-ANOS企业数据字典V1.0.md)  
**字段来源：** [21-ERP字段映射方案V1.0.md](21-ERP字段映射方案V1.0.md)  
**版本：** V1.0

---

## 目录

- 第1章 飞书在ANOS中的定位
- 第2章 ANOS数据中台总体架构
- 第3章 第一阶段核心表
- 第4章 第二阶段扩展表
- 第5章 第三阶段智能表
- 第6章 多维表格设计原则
- 第7章 表间关系设计
- 第8章 权限与视图设计
- 第9章 自动化与Agent触发
- 第10章 建设路线

---

# 第1章 飞书在ANOS中的定位

## 1.1 传统模式

传统ERP模式下：

```text
ERP
├─ 客户
├─ 产品
├─ 订单
└─ 库存
```

所有数据锁死在ERP中。

ERP成为数据中心，也成为操作入口。

这种模式的问题是：

- 数据不容易协同
- 字段不容易调整
- AI不容易接入
- 知识不容易沉淀
- 业务变化成本高

## 1.2 ANOS模式

ANOS模式下：

```text
ERP
↓
ANOS Data Hub（飞书多维表格）
↓
Portal
↓
Agent
↓
Workflow
```

ERP逐步退化为交易执行系统（Transaction Engine）。

ANOS成为经营操作系统（Operating System）。

飞书多维表格在第一阶段承担 Unified Data Hub（统一数字中台）角色。

## 1.3 飞书多维表格的战略价值

飞书多维表格具备：

- 快速搭建
- 强关联能力
- 权限体系成熟
- 自动化能力成熟
- 视图灵活
- 协同友好
- 与飞书文档、知识库、妙搭、Aily、OpenClaw天然连接

因此，ANOS第一阶段不应直接自建数据库中台，而应先用飞书多维表格验证业务模型、数据模型和Agent协作。

---

# 第2章 ANOS数据中台总体架构

ANOS Data Hub建议分为六层：

```text
L0 主数据层
L1 交易数据层
L2 财务数据层
L3 智能数据层
L4 知识层
L5 Agent层
```

## 2.1 L0 主数据层

主数据层定义企业基础对象。

建议表：

- Customer Base
- Contact Base
- Supplier Base
- Brand Base
- Product Base
- Employee Base

## 2.2 L1 交易数据层

交易层记录业务过程。

建议表：

- Inquiry Base
- Offer Base
- SO Base
- PO Base
- Inventory Base
- Shipment Base
- Receiving Base

## 2.3 L2 财务数据层

财务层服务经营风险，不替代金蝶总账。

建议表：

- AR Base
- AP Base
- Credit Base
- Risk Base
- AR Receipt Base
- AP Payment Base

## 2.4 L3 智能数据层

智能层是ERP没有的层。

建议表：

- Customer Profile
- Supplier Profile
- Product Profile
- Risk Profile
- Market Intelligence
- Recommendation Base
- Prediction Base

## 2.5 L4 知识层

知识层连接飞书云文档、飞书知识库、OpenClaw。

建议表：

- Knowledge Index
- Project Knowledge
- Product Knowledge
- Manufacturer Intelligence
- Risk Case Knowledge

## 2.6 L5 Agent层

Agent层用于定义数字员工与数据的关系。

建议表：

- Agent Registry
- Agent Task
- Agent Memory Index
- Agent Recommendation Log
- Agent Audit Log

---

# 第3章 第一阶段核心表

不要一开始建50张表。

按照Quick Win First原则，Phase 1建议只建设7张核心表：

```text
Customer Base
Supplier Base
Product Base
Inquiry Base
Offer Base
SO Base
AR Risk Base
```

这7张表覆盖销售、采购、风控三个最核心部门。

## 3.1 Customer Base

定位：客户主数据与客户画像基础。

核心字段：

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| CustomerID | 自动编号 | ANOS客户ID |
| CustomerCode | 文本 | ERP客户编号 |
| CustomerName | 文本 | 客户名称 |
| CustomerShortName | 文本 | 客户简称 |
| CustomerType | 单选 | 终端/贸易商/方案商/EMS/ODM/OEM |
| Industry | 单选/文本 | 行业 |
| AccountOwner | 人员 | 销售负责人 |
| CreditLimit | 数字/金额 | 信用额度 |
| PaymentTerm | 单选 | 账期 |
| PaymentMethod | 单选 | 付款方式 |
| CreditRiskLevel | 单选 | 信用风险等级 |
| CustomerScore | 数字 | 客户价值评分 |
| RiskLevel | 单选 | 风险等级 |
| LastActivityAt | 日期时间 | 最近活动时间 |
| Source | 单选 | ERP/手工/AI/飞书 |
| SourceID | 文本 | ERP原始ID |

关键视图：

- 我的客户
- 高价值客户
- 高风险客户
- 近期无活动客户
- 新建客户待审核

## 3.2 Supplier Base

定位：供应商主数据与供应商画像基础。

核心字段：

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| SupplierID | 自动编号 | ANOS供应商ID |
| SupplierCode | 文本 | ERP供应商编号 |
| SupplierName | 文本 | 供应商名称 |
| SupplierType | 单选 | 原厂/代理商/独立分销商/现货商 |
| AuthorizationStatus | 单选 | 授权状态 |
| PaymentTerm | 单选 | 账期 |
| PreferredBrands | 多选/关联 | 优势品牌 |
| SupplierScore | 数字 | 供应商评分 |
| PriceScore | 数字 | 价格竞争力 |
| QualityScore | 数字 | 质量评分 |
| RiskScore | 数字 | 风险评分 |
| DeliveryReliability | 数字 | 交付稳定性 |
| Source | 单选 | 来源 |
| SourceID | 文本 | ERP原始ID |

关键视图：

- 推荐供应商
- 高风险供应商
- 品牌优势供应商
- 待审核供应商

## 3.3 Product Base

定位：产品与型号标准库。

核心字段：

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| ProductID | 自动编号 | 产品ID |
| MPN | 文本 | 型号 |
| Brand | 关联 | 品牌 |
| Package | 文本/单选 | 封装 |
| Lifecycle | 单选 | Active/NRND/EOL/Obsolete |
| RoHS | 单选 | 合规状态 |
| Category | 单选 | 产品分类 |
| SubCategory | 单选 | 子分类 |
| AlternativeMPN | 关联/文本 | 替代料 |
| DomesticAlternative | 关联/文本 | 国产替代 |
| ShortageIndex | 数字 | 缺货指数 |
| RiskIndex | 数字 | 风险指数 |
| MarketHeat | 数字 | 市场热度 |

关键视图：

- 热门型号
- EOL风险型号
- 国产替代机会
- 高频询价型号

## 3.4 Inquiry Base

定位：询价中心，ANOS第一核心业务表。

核心字段：

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| InquiryID | 自动编号 | 询价ID |
| Customer | 关联Customer | 客户 |
| Contact | 关联Contact | 联系人 |
| MPN | 关联/文本 | 型号 |
| Brand | 关联/文本 | 品牌 |
| Quantity | 数字 | 数量 |
| TargetPrice | 金额 | 目标价 |
| RequiredDate | 日期 | 需求日期 |
| Source | 单选 | 邮件/微信/飞书/Excel/API |
| Status | 单选 | 新建/解析完成/采购处理中/已报价/已关闭 |
| Priority | 单选 | 高/中/低 |
| Urgency | 单选 | 紧急/正常/低 |
| WinProbability | 百分比 | 成交概率 |
| CompletenessScore | 数字 | 完整度评分 |
| AIRecommendation | 长文本 | AI建议 |
| LastActivityAt | 日期时间 | 最近活动 |

关键视图：

- 今日新增RFQ
- 待采购处理
- 高成交概率
- 高优先级
- 信息不完整待补充

## 3.5 Offer Base

定位：报价中心，供应资源池。

核心字段：

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| OfferID | 自动编号 | 报价ID |
| InquiryID | 关联Inquiry | 关联询价 |
| Supplier | 关联Supplier | 供应商 |
| MPN | 关联/文本 | 型号 |
| UnitPrice | 金额 | 单价 |
| Currency | 单选 | 币种 |
| StockQty | 数字 | 库存 |
| MOQ | 数字 | MOQ |
| LeadTime | 文本/数字 | 交期 |
| ValidUntil | 日期 | 有效期 |
| Margin | 百分比 | 毛利率 |
| CompetitiveScore | 数字 | 价格竞争力 |
| RiskScore | 数字 | 风险评分 |
| MatchScore | 数字 | 匹配分 |

关键视图：

- 今日报价
- 高竞争力报价
- 即将过期报价
- 高风险报价
- 待销售确认报价

## 3.6 SO Base

定位：销售订单中心。

核心字段：

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| SOID | 自动编号 | 销售订单ID |
| SONo | 文本 | ERP销售订单号 |
| Customer | 关联Customer | 客户 |
| Inquiry | 关联Inquiry | 询价 |
| Offer | 关联Offer | 报价 |
| Amount | 金额 | 金额 |
| Currency | 单选 | 币种 |
| OrderDate | 日期 | 订单日期 |
| DeliveryDate | 日期 | 交付日期 |
| Status | 单选 | 状态 |
| MarginPrediction | 百分比 | 毛利预测 |
| CollectionRisk | 单选 | 回款风险 |
| FulfillmentRisk | 单选 | 履约风险 |

关键视图：

- 本月订单
- 待交付订单
- 高回款风险订单
- 高毛利订单

## 3.7 AR Risk Base

定位：应收风险中心。

核心字段：

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| ARID | 自动编号 | 应收ID |
| Customer | 关联Customer | 客户 |
| SO | 关联SO | 销售订单 |
| InvoiceNo | 文本 | 发票号 |
| ARAmount | 金额 | 应收金额 |
| OutstandingAmount | 金额 | 未回款金额 |
| DueDate | 日期 | 到期日 |
| OverdueDays | 数字/公式 | 逾期天数 |
| CollectionStatus | 单选 | 未到期/逾期/部分回款/已回款 |
| RiskLevel | 单选 | Low/Medium/High/Critical |
| CollectionPriority | 单选 | 催收优先级 |
| BadDebtProbability | 百分比 | 坏账概率 |
| SuggestedAction | 长文本 | 建议动作 |

关键视图：

- 今日到期
- 逾期30天
- 逾期60天
- 逾期90天
- Critical风险

---

# 第4章 第二阶段扩展表

Phase 2建议新增：

- PO Base
- Inventory Base
- Shipment Base
- Receiving Base
- Credit Base
- Risk Base

这些表将补齐采购履约、库存、发货、收货、信用和风险事件。

---

# 第5章 第三阶段智能表

Phase 3建议新增：

- Customer Profile
- Supplier Profile
- Product Profile
- Market Intelligence
- Knowledge Index
- Agent Task
- Agent Recommendation Log

这些表将支撑Agent Network、知识图谱和智能推荐。

---

# 第6章 多维表格设计原则

## 6.1 主数据唯一

Customer只能存在一张主表。

Supplier只能存在一张主表。

Product只能存在一张主表。

## 6.2 不允许复制数据

错误：

```text
Inquiry表重复录入客户名称
```

正确：

```text
Inquiry → Customer关联字段
```

## 6.3 所有表必须具备时间字段

- CreatedAt
- UpdatedAt
- EventTime
- LastActivityAt

## 6.4 所有表必须具备来源字段

- Source
- SourceID
- SourceType

## 6.5 所有核心表必须具备AI字段

- AIScore
- AIInsight
- AITags
- AIConfidence
- HumanVerified

## 6.6 所有关键状态必须可事件化

例如：

- Inquiry Created
- Offer Generated
- SO Confirmed
- Payment Received
- Risk Detected

---

# 第7章 表间关系设计

核心关系：

```text
Customer
├── Contact
├── Inquiry
├── SO
└── AR Risk

Supplier
├── Offer
├── PO
└── Supplier Profile

Product
├── Inquiry
├── Offer
├── SO
└── PO

Inquiry
├── Offer
└── SO

SO
├── PO
├── Shipment
└── AR Risk
```

表间关系应尽量使用关联字段，不使用文本复制。

---

# 第8章 权限与视图设计

## 8.1 角色权限

| 角色 | 主要权限 |
| --- | --- |
| 销售 | 客户、询价、报价、SO、AR风险 |
| 采购 | 供应商、Offer、PO、库存、收货 |
| 财务 | AR、AP、信用、风险 |
| 管理层 | 全局驾驶舱 |
| QC | 收货、批次、质量异常 |
| Agent | 受限读取与建议写入 |

## 8.2 视图原则

每张表至少包含：

- 全部数据视图
- 我的数据视图
- 待处理视图
- 风险视图
- 本周/本月视图
- AI建议视图

## 8.3 敏感字段控制

敏感字段包括：

- 采购成本
- 毛利
- 信用额度
- 回款状态
- 付款计划
- 供应商风险

敏感字段应限制到角色和负责人可见。

---

# 第9章 自动化与Agent触发

多维表格不只是数据表，也应成为Workflow和Agent触发源。

典型触发：

- Inquiry新建 → 触发AI销售助手解析
- Inquiry状态为待采购 → 触发AI采购专家
- Offer新增 → 触发匹配评分
- AR逾期 → 触发AI风控管理员
- RiskLevel变为Critical → 通知负责人和管理层

所有自动化必须记录：

- 触发时间
- 触发对象
- 触发Agent
- 输出结果
- 人工确认状态

---

# 第10章 建设路线

## 10.1 Phase 1

建设7张核心表：

1. Customer Base
2. Supplier Base
3. Product Base
4. Inquiry Base
5. Offer Base
6. SO Base
7. AR Risk Base

## 10.2 Phase 2

补齐履约与风险表：

- PO Base
- Inventory Base
- Shipment Base
- Receiving Base
- Credit Base
- Risk Base

## 10.3 Phase 3

建设智能与知识层：

- Customer Profile
- Supplier Profile
- Product Profile
- Market Intelligence
- Knowledge Index
- Agent Task

## 10.4 最终形态

未来形成：

```text
ERP
金蝶
邮件
WhatsApp
企业微信
飞书
↓
ANOS Data Hub（飞书多维表格）
↓
Portal
↓
Agent Network
↓
Workflow Engine
↓
Knowledge Graph
```

## 10.5 本文档结论

飞书多维表格是ANOS第一阶段真正的数据中心。

它不只是表格，而是：

```text
Data Hub
+
Workflow Trigger
+
Agent Context
+
Portal Backend
```

第一阶段必须先把7张核心表打通，再建设Portal和Agent。
