# 42-ANOS数据中台建表蓝图 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** ANOS Data Hub建表蓝图 / 飞书多维表格与未来SQL边界设计  
**上游文档：** [20-ANOS企业数据字典V1.0.md](20-ANOS企业数据字典V1.0.md)、[22-飞书多维表格总体设计方案V1.0.md](22-飞书多维表格总体设计方案V1.0.md)  
**版本：** V1.0  
**状态：** 开发前建表基线

---

# 第1章 总体架构

ANOS Data Hub分为六层：

```text
L0 主数据层
L1 交易层
L2 财务层
L3 智能层
L4 知识层
L5 Agent / Event层
```

第一阶段不追求一次建全表，而是先建设能形成销售、采购、风控闭环的P0表。

# 第2章 L0 主数据层

## 01_Customer_Base

客户主表，一客户一档。

核心字段：

| 分类 | 字段 |
| --- | --- |
| 基础 | CustomerID、CustomerCode、CustomerName、Country、Industry |
| 销售 | AccountOwner、CustomerLevel |
| 财务 | CreditLimit、PaymentTerm |
| AI | CustomerScore、RiskLevel |

关联对象：

```text
Customer
├── Contact
├── Inquiry
├── Offer
├── SO
└── AR
```

## 02_Contact_Base

联系人表，与Customer为1:N关系。

核心字段：

- ContactID
- CustomerID
- Name
- Title
- Email
- Mobile
- WeChat
- LinkedIn

## 03_Supplier_Base

供应商主表。

核心字段：

- SupplierID
- SupplierCode
- SupplierName
- Country
- AuthorizationLevel
- SupplierScore
- RiskLevel

## 04_Product_Base

产品主表，是交易智能的基础。

核心字段：

- ProductID
- Brand
- MPN
- Description
- Category
- Package
- Lifecycle
- RoHS
- HeatIndex
- ShortageIndex
- LocalizationIndex

## 05_Brand_Base

品牌库。

核心字段：

- BrandID
- BrandName
- Manufacturer
- Country
- IsDomestic
- LocalizationIndex

# 第3章 L1 交易层

## 11_Inquiry_Base

询价主表，第一阶段核心表。

来源：

- 邮件
- 截图
- Excel
- WhatsApp / 微信
- 手工录入

核心字段：

- InquiryID
- CustomerID
- ContactID
- MPN
- Brand
- Quantity
- TargetPrice
- RequiredDate
- Status
- WinProbability
- Priority
- Urgency
- AISuggestion

## 12_Offer_Base

报价表。

核心字段：

- OfferID
- InquiryID
- SupplierID
- UnitPrice
- LeadTime
- StockQty
- Margin

## 13_SO_Base

销售订单表。

核心字段：

- SOID
- CustomerID
- OfferID
- OrderAmount
- OrderDate
- DeliveryDate
- CollectionRisk
- MarginPrediction

## 14_PO_Base

采购订单表。

核心字段：

- POID
- SupplierID
- SOID
- PurchaseAmount
- OrderDate

## 15_Inventory_Base

库存中心，建议拆为库存主表与库存流水表。

库存主表：

- InventoryID
- MPN
- Warehouse
- AvailableQty
- ReservedQty
- InTransitQty

库存流水表：

- InventoryTxnID
- InventoryID
- TxnType
- Qty
- TxnDate

## 16_Supply_Resource_Base

供应资源池，用于沉淀供应信息，不等同于供应商主数据。

核心字段：

- ResourceID
- SupplierID
- Brand
- MPN
- StockQty
- Price
- LeadTime
- MOQ
- DateCode
- SourceType
- SourceURL
- SourceOwner
- EventTime
- CapturedAt
- VerifiedAt
- VerifiedBy
- ResourceScore
- MatchScore
- RiskScore

# 第4章 L2 财务层

## 21_AR_Base

应收中心。

核心字段：

- ARID
- CustomerID
- SOID
- InvoiceNo
- ARAmount
- PaidAmount
- OutstandingAmount
- OverdueDays
- RiskLevel
- CollectionForecast

## 22_AP_Base

应付中心。

核心字段：

- APID
- SupplierID
- POID
- APAmount
- OutstandingAmount

## 23_Credit_Base

信用中心。

核心字段：

- CustomerID
- CreditLimit
- UsedCredit
- AvailableCredit
- CreditScore

## 24_Risk_Base

风险中心。

核心字段：

- RiskID
- RiskType
- Source
- Severity
- Owner
- Status

# 第5章 L3 智能层

| 表 | 定位 | 核心字段 |
| --- | --- | --- |
| 31_Customer_Profile | 客户画像 | RFQCount、OrderCount、WinRate、ARPerformance、GrowthScore |
| 32_Supplier_Profile | 供应商画像 | QualityScore、PriceScore、DeliveryScore、RiskScore |
| 33_Product_Profile | 产品画像 | MPN、HeatIndex、LifecycleRisk、LocalizationIndex |
| 34_Market_Intelligence | 市场情报库 | IntelID、Brand、MPN、Source、PublishTime、Summary、SourceURL、CapturedAt、VerifiedBy |

# 第6章 L4 知识层

## 41_Knowledge_Base

统一知识目录。

核心字段：

- KnowledgeID
- Title
- Category
- Department
- Owner
- SourceURL
- CreatedAt
- UpdatedAt
- ConfidenceScore

## 42_Datasheet_Base

产品知识库。

核心字段：

- MPN
- DatasheetURL
- PCN
- EOL
- Lifecycle

# 第7章 Agent与Event层

## 51_Agent_Registry

Agent注册中心。

核心字段：

- AgentID
- AgentName
- AgentType
- Owner
- PromptVersion
- ModelVersion
- Status

## 52_Agent_Task

Agent任务中心。

核心字段：

- TaskID
- AgentID
- TaskType
- Input
- Output
- ExecutionTime
- ConfidenceScore

## 61_Event_Store

统一事件中心。

核心字段：

- EventID
- EventType
- Source
- SourceID
- Operator
- EventTime
- Payload

典型事件：

- InquiryCreated
- OfferGenerated
- SOConfirmed
- AROverdue
- KnowledgeCreated

# 第8章 第一阶段P0建表范围

第一阶段建议只建设以下8张表：

1. 01_Customer_Base
2. 03_Supplier_Base
3. 04_Product_Base
4. 11_Inquiry_Base
5. 12_Offer_Base
6. 13_SO_Base
7. 16_Supply_Resource_Base
8. 21_AR_Base

其中 `16_Supply_Resource_Base` 是本轮新增的关键表，用于承接采购侧多源供应信息。

# 第9章 飞书与SQL边界

飞书保留：

- Portal
- 协同
- 表单
- 审批
- 知识库
- 轻量业务表

未来SQL承载：

- SO
- PO
- Inventory
- AR
- AP
- Event Store
- Memory Store

最终结构：

```text
Portal
↓
Agent Network
↓
Workflow Engine
↓
ANOS Data Hub
├── 飞书多维表格
└── Middleware SQL
```

