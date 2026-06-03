# 20-ANOS企业数据字典 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** 企业统一数据标准 / Data Bible  
**适用范围：** ERP字段映射、飞书多维表格、Portal、Agent、Workflow、Dashboard、API  
**版本：** V1.0  
**状态：** 架构基线版

---

## 目录

- 第1章 数据治理总则
- 第2章 Master Data（主数据）
- 第3章 Transaction Data（交易数据）
- 第4章 Financial Data（财务数据）
- 第5章 Intelligence Data（智能数据）
- 第6章 Event Data（事件数据）
- 第7章 Semiconductor Industry Domain Data（半导体行业领域数据）

---

# 第1章 数据治理总则

## 1.1 文档定位

本文档定义 ANOS 统一数据标准，是整个项目的数据圣经（Data Bible）。

未来以下工作均必须遵循本标准：

- ERP字段映射
- 飞书多维表格设计
- Portal开发
- Agent开发
- Workflow开发
- Dashboard开发
- API开发
- 数据迁移
- 数据治理

数据字典先于字段映射。

只有先定义ANOS标准语言，才能避免不同系统中出现多套命名：

```text
客户名称
CustomerName
Customer_Name
CustName
ClientName
Customer Full Name
```

## 1.2 设计目标

ANOS数据字典的目标是建立 Single Source of Truth（单一事实源）。

设计目标包括：

- 统一中文业务名称
- 统一英文标准名
- 统一字段编码
- 统一数据类型
- 统一来源追踪
- 统一时间字段
- 统一AI字段
- 统一事件字段

## 1.3 数据命名原则

统一采用三元结构：

| 中文名称 | 英文标准名 | 字段编码 |
| --- | --- | --- |
| 客户名称 | CustomerName | customer_name |
| 客户编码 | CustomerCode | customer_code |
| 信用额度 | CreditLimit | credit_limit |
| 最近活动时间 | LastActivityAt | last_activity_at |

命名原则：

- 中文名称面向业务人员
- 英文标准名面向模型、API、Agent
- 字段编码面向数据库、接口、同步脚本
- 不允许同一含义使用多个字段名
- 不允许把ERP字段名直接作为ANOS标准名，除非含义完全一致

## 1.4 数据分类体系

ANOS所有数据分为六类：

| 分类 | 中文 | 作用 |
| --- | --- | --- |
| Master Data | 主数据 | 定义企业基础对象 |
| Transaction Data | 交易数据 | 记录业务行为与过程 |
| Financial Data | 财务数据 | 支撑经营财务和风险判断 |
| Knowledge Data | 知识数据 | 承载组织知识与经验 |
| Intelligence Data | 智能数据 | 承载AI画像、评分、预测、建议 |
| Event Data | 事件数据 | 记录业务变化与Agent触发 |

## 1.5 时间标准

所有核心实体必须具备时间字段：

| 中文名称 | 英文标准名 | 字段编码 | 说明 |
| --- | --- | --- | --- |
| 创建时间 | CreatedAt | created_at | 记录在ANOS创建时间 |
| 更新时间 | UpdatedAt | updated_at | 最后更新时间 |
| 事件时间 | EventTime | event_time | 业务真实发生时间 |
| 最近活动时间 | LastActivityAt | last_activity_at | 最近业务活动时间 |

时间统一使用：

```text
UTC+8
Asia/Shanghai
```

时间字段是Agent推理、客户画像、风险预警、供需匹配的核心依据。

## 1.6 来源标准

所有核心数据必须记录来源：

| 中文名称 | 英文标准名 | 字段编码 |
| --- | --- | --- |
| 来源 | Source | source |
| 来源ID | SourceId | source_id |
| 来源类型 | SourceType | source_type |
| 来源负责人 | SourceOwner | source_owner |

SourceType标准值：

```text
ERP
Kingdee
Email
Feishu
OpenClaw
Aily
API
Manual
WeChat
WhatsApp
Excel
PDF
Image
AI
```

## 1.7 AI标准字段

所有核心实体必须支持AI治理字段：

| 中文名称 | 英文标准名 | 字段编码 |
| --- | --- | --- |
| AI生成 | AIGenerated | ai_generated |
| AI修改 | AIModified | ai_modified |
| AI置信度 | AIConfidence | ai_confidence |
| AI洞察 | AIInsight | ai_insight |
| AI标签 | AITags | ai_tags |
| 人工确认 | HumanVerified | human_verified |

AI字段用于区分事实、推理、建议和人工确认结果。

---

# 第2章 Master Data（主数据）

主数据定义企业长期存在、全局共享、低频变化的基础对象。

## 2.1 Customer（客户）

客户主数据是ANOS最重要的主数据之一。

### Customer Base

基础信息：

| 中文 | 英文 |
| --- | --- |
| 客户ID | CustomerID |
| 客户编码 | CustomerCode |
| 客户名称 | CustomerName |
| 客户简称 | CustomerShortName |
| 国家 | Country |
| 城市 | City |
| 地址 | Address |
| 官网 | Website |

商业属性：

| 中文 | 英文 |
| --- | --- |
| 客户类型 | CustomerType |
| 行业 | Industry |
| 客户等级 | CustomerLevel |
| 信用等级 | CreditLevel |
| 账期 | PaymentTerm |
| 付款方式 | PaymentMethod |
| 交易币种 | Currency |

销售属性：

| 中文 | 英文 |
| --- | --- |
| 销售负责人 | AccountOwner |
| 客户来源 | LeadSource |
| 首次合作日期 | FirstOrderDate |
| 最近成交日期 | LastOrderDate |
| 最近联系时间 | LastContactAt |

AI属性：

| 中文 | 英文 |
| --- | --- |
| 客户价值评分 | CustomerScore |
| 成交概率 | WinRate |
| 风险等级 | RiskLevel |
| 客户标签 | Tags |
| 成长潜力 | GrowthPotential |

## 2.2 Contact（联系人）

联系人属于Customer，是客户关系管理的重要对象。

| 中文 | 英文 |
| --- | --- |
| 联系人ID | ContactID |
| 所属客户 | Customer |
| 联系人姓名 | ContactName |
| 部门 | Department |
| 职位 | Title |
| 邮箱 | Email |
| 手机 | Mobile |
| 微信 | WeChat |
| LinkedIn | LinkedIn |
| 影响力评分 | InfluenceScore |
| 活跃度评分 | ActivityScore |
| 决策权等级 | DecisionLevel |

## 2.3 Supplier（供应商）

供应商主数据支撑采购、报价、质量、风险和供应链协同。

基础信息：

| 中文 | 英文 |
| --- | --- |
| 供应商ID | SupplierID |
| 供应商编码 | SupplierCode |
| 供应商名称 | SupplierName |
| 英文名称 | SupplierEnglishName |
| 国家 | Country |
| 官网 | Website |

商业属性：

| 中文 | 英文 |
| --- | --- |
| 供应商类型 | SupplierType |
| 授权状态 | AuthorizationStatus |
| 付款方式 | PaymentMethod |
| 账期 | PaymentTerm |
| 优势品牌 | PreferredBrands |
| 优势产品线 | PreferredProductLines |

AI属性：

| 中文 | 英文 |
| --- | --- |
| 供应商评分 | SupplierScore |
| 价格竞争力 | PriceScore |
| 质量评分 | QualityScore |
| 风险评分 | RiskScore |
| 交付稳定性 | DeliveryReliability |

## 2.4 Brand（品牌）

品牌主数据支撑产品、供应、市场和国产替代分析。

| 中文 | 英文 |
| --- | --- |
| 品牌ID | BrandID |
| 品牌名称 | BrandName |
| 品牌简称 | BrandShortName |
| 原厂名称 | Manufacturer |
| 国家 | Country |
| 官网 | Website |
| 是否国产 | IsDomestic |
| 热度指数 | PopularityIndex |
| 国产替代指数 | LocalizationIndex |

## 2.5 Product（产品）

产品主数据是电子元器件行业最核心对象。

基础属性：

| 中文 | 英文 |
| --- | --- |
| 产品ID | ProductID |
| 品牌 | Brand |
| 型号 | MPN |
| 封装 | Package |
| 生命周期 | Lifecycle |
| RoHS | RoHS |

技术属性：

| 中文 | 英文 |
| --- | --- |
| 分类 | Category |
| 子分类 | SubCategory |
| 参数 | Parameters |
| 替代料 | AlternativeMPN |
| 国产替代 | DomesticAlternative |

AI属性：

| 中文 | 英文 |
| --- | --- |
| 缺货指数 | ShortageIndex |
| 风险指数 | RiskIndex |
| 推荐指数 | RecommendationScore |
| 市场热度 | MarketHeat |

## 2.6 Employee（员工）

员工主数据支撑权限、任务、Agent协作和组织能力画像。

| 中文 | 英文 |
| --- | --- |
| 员工ID | EmployeeID |
| 工号 | EmployeeCode |
| 姓名 | EmployeeName |
| 部门 | Department |
| 岗位 | Position |
| 上级 | Manager |
| AI等级 | AILevel |
| Agent使用等级 | AgentMaturity |
| 能力评分 | CapabilityScore |

---

# 第3章 Transaction Data（交易数据）

交易数据记录发生了什么，而不是定义对象是什么。

例如：

```text
Customer = 对象
Inquiry = 行为
```

## 3.1 设计原则

交易数据必须具备：

- 业务对象关联
- 状态字段
- 时间字段
- 负责人字段
- 来源字段
- 事件字段
- AI增强字段

## 3.2 Inquiry（询价）

Inquiry是ANOS第一核心交易对象。

Inquiry Base字段：

| 中文 | 英文 |
| --- | --- |
| 询价ID | InquiryID |
| 客户 | Customer |
| 联系人 | Contact |
| 型号 | MPN |
| 品牌 | Brand |
| 数量 | Quantity |
| 目标价 | TargetPrice |
| 需求日期 | RequiredDate |
| 来源 | Source |
| 状态 | Status |
| 优先级 | Priority |
| 紧急程度 | Urgency |
| 成交概率 | WinProbability |
| 完整度评分 | CompletenessScore |
| AI建议 | AIRecommendation |

## 3.3 Offer（报价）

Offer是供应资源的结构化沉淀。

| 中文 | 英文 |
| --- | --- |
| 报价ID | OfferID |
| 关联询价 | InquiryID |
| 供应商 | Supplier |
| 型号 | MPN |
| 品牌 | Brand |
| 单价 | UnitPrice |
| 币种 | Currency |
| 库存数量 | StockQty |
| MOQ | MOQ |
| 交期 | LeadTime |
| 有效期 | ValidUntil |
| 毛利率 | Margin |
| 价格竞争力 | CompetitiveScore |
| 风险评分 | RiskScore |

## 3.4 Sales Order（销售订单）

| 中文 | 英文 |
| --- | --- |
| 销售订单ID | SOID |
| 销售订单号 | SONo |
| 客户 | Customer |
| 关联询价 | Inquiry |
| 关联报价 | Offer |
| 金额 | Amount |
| 币种 | Currency |
| 订单日期 | OrderDate |
| 交付日期 | DeliveryDate |
| 状态 | Status |
| 毛利预测 | MarginPrediction |
| 回款风险 | CollectionRisk |

## 3.5 Purchase Order（采购订单）

| 中文 | 英文 |
| --- | --- |
| 采购订单ID | POID |
| 采购订单号 | PONo |
| 供应商 | Supplier |
| 关联销售订单 | SO |
| 金额 | PurchaseAmount |
| 币种 | Currency |
| 交期 | LeadTime |
| 状态 | Status |
| 交付风险 | DeliveryRisk |
| 质量风险 | QualityRisk |

## 3.6 Inventory（库存）

ERP库存通常只记录数量，ANOS库存必须拆分为可经营的库存状态。

| 中文 | 英文 |
| --- | --- |
| 库存ID | InventoryID |
| 型号 | MPN |
| 品牌 | Brand |
| 可用数量 | AvailableQty |
| 预留数量 | ReservedQty |
| 在途数量 | InTransitQty |
| 仓库 | Warehouse |
| 批号 | LotNo |
| 库龄 | InventoryAge |
| 呆滞风险 | SlowMovingRisk |
| 缺货风险 | ShortageRisk |

## 3.7 Shipment（发货）

| 中文 | 英文 |
| --- | --- |
| 发货ID | ShipmentID |
| 发货单号 | ShipmentNo |
| 销售订单 | SO |
| 客户 | Customer |
| 型号 | MPN |
| 数量 | Quantity |
| 发货日期 | ShipmentDate |
| 物流信息 | LogisticsInfo |
| 状态 | Status |

## 3.8 Receiving（收货）

| 中文 | 英文 |
| --- | --- |
| 收货ID | ReceivingID |
| 收货单号 | ReceivingNo |
| 采购订单 | PO |
| 供应商 | Supplier |
| 型号 | MPN |
| 数量 | Quantity |
| 批号 | LotNo |
| 收货日期 | ReceivingDate |
| QC状态 | QCStatus |

## 3.9 Event标准

所有交易对象都应产生事件。

典型事件：

- InquiryCreated
- InquiryParsed
- OfferGenerated
- OfferMatched
- SOConfirmed
- POCreated
- GoodsReceived
- GoodsDelivered
- PaymentReceived
- RiskDetected

---

# 第4章 Financial Data（财务数据）

ANOS当前阶段不替代金蝶。

金蝶负责总账、凭证、税务、财务报表。

ANOS负责交易财务、经营财务、风险财务、预测财务。

## 4.1 AR（Accounts Receivable）

AR是AI风控管理员最重要的数据源。

| 中文 | 英文 |
| --- | --- |
| 应收ID | ARID |
| 客户 | Customer |
| 发票号 | InvoiceNo |
| 应收金额 | ARAmount |
| 未回款金额 | OutstandingAmount |
| 到期日 | DueDate |
| 逾期天数 | OverdueDays |
| 回款状态 | CollectionStatus |
| 风险等级 | RiskLevel |
| 催收优先级 | CollectionPriority |
| 坏账概率 | BadDebtProbability |

## 4.2 AP（Accounts Payable）

| 中文 | 英文 |
| --- | --- |
| 应付ID | APID |
| 供应商 | Supplier |
| 应付金额 | APAmount |
| 未付款金额 | OutstandingAmount |
| 到期日 | DueDate |
| 付款状态 | PaymentStatus |
| 付款优先级 | PaymentPriority |
| 资金压力评分 | CashPressureScore |

## 4.3 Customer Credit（客户信用）

ERP一般没有完整信用模型，ANOS必须新增。

| 中文 | 英文 |
| --- | --- |
| 客户 | Customer |
| 信用额度 | CreditLimit |
| 已用额度 | UsedCredit |
| 可用额度 | AvailableCredit |
| 信用评分 | CreditScore |
| 信用风险等级 | CreditRiskLevel |
| 暂停出货建议 | HoldShipmentSuggestion |

## 4.4 Supplier Credit（供应商信用）

| 中文 | 英文 |
| --- | --- |
| 供应商 | Supplier |
| 付款信用 | PaymentCredit |
| 合作等级 | CooperationLevel |
| 风险等级 | RiskLevel |
| 付款优先级 | PaymentPriority |

## 4.5 Cash Flow（现金流）

| 中文 | 英文 |
| --- | --- |
| 现金流ID | CashFlowID |
| 日期 | Date |
| 流入金额 | CashIn |
| 流出金额 | CashOut |
| 净现金流 | NetCashFlow |
| 预测现金流 | ForecastCashFlow |

## 4.6 Risk Case（风险事件）

| 中文 | 英文 |
| --- | --- |
| 风险ID | RiskID |
| 风险类型 | RiskType |
| 严重程度 | Severity |
| 责任人 | Owner |
| 状态 | Status |
| 风险描述 | RiskDescription |
| 建议动作 | SuggestedAction |

---

# 第5章 Intelligence Data（智能数据）

智能数据是ANOS区别于ERP的核心。

传统ERP记录事实，ANOS在事实之上生成画像、预测、建议和风险判断。

## 5.1 Customer Profile

| 中文 | 英文 |
| --- | --- |
| 客户 | Customer |
| RFQ次数 | RFQCount |
| 成交次数 | OrderCount |
| 成交率 | WinRate |
| 回款表现 | PaymentPerformance |
| 成长性 | GrowthScore |
| 战略价值 | StrategicValue |

## 5.2 Supplier Profile

| 中文 | 英文 |
| --- | --- |
| 供应商 | Supplier |
| 报价次数 | QuoteCount |
| 成交次数 | DealCount |
| 平均价格竞争力 | AvgPriceScore |
| 交付稳定性 | DeliveryReliability |
| 质量表现 | QualityPerformance |

## 5.3 Product Profile

| 中文 | 英文 |
| --- | --- |
| 产品 | Product |
| 询价热度 | InquiryHeat |
| 成交热度 | DealHeat |
| 缺货指数 | ShortageIndex |
| 生命周期风险 | LifecycleRisk |
| 国产替代指数 | LocalizationIndex |

## 5.4 Risk Profile

| 中文 | 英文 |
| --- | --- |
| 对象类型 | ObjectType |
| 对象ID | ObjectID |
| 风险评分 | RiskScore |
| 风险等级 | RiskLevel |
| 风险来源 | RiskSource |
| 建议动作 | SuggestedAction |

## 5.5 Prediction Model

| 中文 | 英文 |
| --- | --- |
| 预测ID | PredictionID |
| 预测对象 | PredictionObject |
| 预测类型 | PredictionType |
| 预测结果 | PredictionResult |
| 置信度 | ConfidenceScore |

## 5.6 Recommendation Model

| 中文 | 英文 |
| --- | --- |
| 建议ID | RecommendationID |
| 建议对象 | RecommendationObject |
| 建议类型 | RecommendationType |
| 建议内容 | RecommendationContent |
| 优先级 | Priority |
| 负责人 | Owner |

---

# 第6章 Event Data（事件数据）

Event Data记录业务变化，是ANOS从记录型系统升级为事件驱动系统的基础。

## 6.1 Event Base

| 中文 | 英文 |
| --- | --- |
| 事件ID | EventID |
| 事件类型 | EventType |
| 事件时间 | EventTime |
| 业务对象 | BusinessObject |
| 对象ID | ObjectID |
| 触发人 | Actor |
| 来源 | Source |
| 前状态 | PreviousState |
| 当前状态 | CurrentState |
| 关联Agent | RelatedAgent |

## 6.2 Event Type

标准事件类型包括：

- CustomerCreated
- SupplierCreated
- ProductCreated
- InquiryCreated
- InquiryParsed
- OfferGenerated
- OfferMatched
- SOConfirmed
- POCreated
- GoodsReceived
- GoodsDelivered
- InvoiceIssued
- PaymentReceived
- RiskDetected
- AgentRecommendationGenerated

---

# 第7章 Semiconductor Industry Domain Data（半导体行业领域数据）

这一章是ANOS区别于通用ERP、CRM和飞书系统的核心行业护城河。

AI销售助手、AI采购专家、AI国产替代顾问、AI原厂情报官、AI供应链经理都依赖这层行业数据。

## 7.1 Brand Dictionary（品牌字典）

Brand Base基础字段：

| 中文 | 英文 |
| --- | --- |
| 品牌ID | BrandID |
| 品牌名称 | BrandName |
| 品牌简称 | BrandShortName |
| 原厂名称 | ManufacturerName |
| 国家 | Country |
| 地区 | Region |
| 是否原厂 | IsManufacturer |
| 是否代理品牌 | IsAgencyBrand |
| 是否国产 | IsDomestic |
| 产品线 | ProductLine |
| 技术领域 | TechnologyDomain |
| 品牌影响力 | BrandInfluenceScore |
| 市场热度 | MarketHeatScore |
| 国产替代指数 | LocalizationIndex |

## 7.2 Manufacturer Dictionary（原厂字典）

| 中文 | 英文 |
| --- | --- |
| 原厂名称 | ManufacturerName |
| 总部国家 | HQCountry |
| 官网 | Website |
| 上市公司 | IsPublicCompany |
| 股票代码 | Ticker |
| 晶圆厂模式 | FabModel |
| 封测模式 | AssemblyModel |
| 地缘风险 | GeoRisk |
| 供应风险 | SupplyRisk |

## 7.3 MPN Dictionary（型号字典）

| 中文 | 英文 |
| --- | --- |
| MPN | MPN |
| 品牌 | Brand |
| 分类 | Category |
| 子分类 | SubCategory |
| 生命周期 | Lifecycle |
| EOL日期 | EOLDate |
| 技术参数 | TechnicalParameters |
| 缺货指数 | ShortageIndex |
| 替代指数 | AlternativeIndex |
| 国产替代指数 | LocalizationIndex |

## 7.4 Package Dictionary（封装字典）

| 中文 | 英文 |
| --- | --- |
| 封装名称 | PackageName |
| 封装类型 | PackageType |
| 引脚数 | PinCount |
| 尺寸 | Dimensions |
| 焊接方式 | MountingType |
| 替代兼容性 | CompatibilityScore |

## 7.5 Lifecycle Dictionary（生命周期字典）

生命周期标准值：

- Active
- NRND
- EOL
- Obsolete

AI字段：

- LifecycleRisk
- EOLProbability
- ReplacementUrgency

## 7.6 Authorization Dictionary（授权体系字典）

授权等级包括：

- Manufacturer
- Authorized Distributor
- Franchise Distributor
- Independent Distributor
- Broker
- Unknown

AI字段：

- AuthorizationRisk
- ChannelReliability
- FlyOrderRisk

## 7.7 Commodity Category Dictionary（物料分类字典）

一级分类示例：

- MCU
- MPU
- FPGA
- Memory
- Analog
- Power
- Sensor
- Connector
- Passive
- Discrete

AI字段：

- CategoryHeat
- SupplyRisk
- DemandTrend

## 7.8 Country & Region Dictionary（国家与区域字典）

| 中文 | 英文 |
| --- | --- |
| 国家 | Country |
| 区域 | Region |
| 关税风险 | TariffRisk |
| 地缘风险 | GeoRisk |
| 物流风险 | LogisticsRisk |

## 7.9 Semiconductor Intelligence Layer

半导体行业智能层包括：

- Brand Intelligence
- Manufacturer Intelligence
- MPN Intelligence
- Lifecycle Intelligence
- Localization Intelligence
- Supply Risk Intelligence

这些数据将服务于：

- AI销售助手
- AI采购专家
- AI国产替代顾问
- AI总经理助理

## 7.10 本文档结论

《20-ANOS企业数据字典V1.0》定义了ANOS统一数据语言。

后续所有ERP字段映射、飞书多维表格设计、Portal页面、Agent工具和Workflow流程，都必须引用本数据字典。
