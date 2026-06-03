# 21-ERP字段映射方案 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** ERP → ANOS → 飞书Data Hub 统一映射规范  
**上游标准：** [20-ANOS企业数据字典V1.0.md](20-ANOS企业数据字典V1.0.md)  
**ERP字段来源：** [ERP数据结构字段清单.md](ERP数据结构字段清单.md)  
**原始附件：** [数据库结构.xlsx](附件/数据库结构.xlsx)  
**版本：** V1.0

---

## 目录

- 第1章 文档定位
- 第2章 映射原则
- 第3章 ERP对象重组
- 第4章 ERP Sheet总览
- 第5章 核心对象映射
- 第6章 字段优先级
- 第7章 ANOS新增字段
- 第8章 实施路径

---

# 第1章 文档定位

本文档定义 ERP → ANOS 的统一映射标准。

适用于：

- ERP API对接
- ERP数据导入
- 飞书多维表格建设
- Portal开发
- Agent开发
- Workflow开发
- 数据治理
- 数据迁移

本方案不是把ERP字段原样搬到飞书。

正确路径是：

```text
ERP原始字段
↓
ANOS标准领域模型
↓
飞书多维表格
↓
Portal
↓
Agent
↓
Workflow
```

---

# 第2章 映射原则

## 2.1 ERP不是标准，ANOS才是标准

错误思维：

```text
ERP字段
↓
直接搬到飞书
```

正确思维：

```text
ERP字段
↓
ANOS标准模型
↓
飞书多维表格
```

ERP只是数据来源之一。

未来ANOS还会接入：

- Email
- Feishu
- OpenClaw
- Aily
- API
- WhatsApp
- WeChat
- Excel
- PDF

因此ANOS数据模型必须高于ERP。

## 2.2 不映射表，只映射业务对象

ERP中可能存在多个表共同表达一个业务对象。

ANOS必须统一为一个领域对象。

例如：

```text
AR_SOH + AR_SOD
↓
Sales Order
```

```text
AP_PDH + AP_PDD
↓
Receiving
```

## 2.3 分四层映射

ERP字段映射必须做到四层：

#

## 第X章 数据域映射规则 (2026-06 GPT增订)

### Customer Domain

ERP 中所有 `actype=C` 的记录归属于 **Customer Domain**。

映射规则:
- BD_Customer → ANOS Customer Base
- BD_CommonContact (actype=C) → ANOS Contact Base
- 销售订单 → Sales Domain (可见: Sales/CEO)

### Supplier Domain

ERP 中所有 `actype=V` 的记录归属于 **Supplier Domain**。

映射规则:
- BD_Supplier → ANOS Supplier Base
- BD_CommonContact (actype=V) → ANOS Contact Base (Supplier侧)
- 采购订单 → Procurement Domain (可见: Buyer/CEO)

### 域隔离规则

Customer Domain 与 Supplier Domain 双向隔离。
ERP 导入时必须标注 OwnerRole 和 DataDomain。


---

## 第一层：ERP原始字段

例如：

```text
acno
acname
sellman
credit
payment
```

#

## 第X章 数据域映射规则 (2026-06 GPT增订)

### Customer Domain

ERP 中所有 `actype=C` 的记录归属于 **Customer Domain**。

映射规则:
- BD_Customer → ANOS Customer Base
- BD_CommonContact (actype=C) → ANOS Contact Base
- 销售订单 → Sales Domain (可见: Sales/CEO)

### Supplier Domain

ERP 中所有 `actype=V` 的记录归属于 **Supplier Domain**。

映射规则:
- BD_Supplier → ANOS Supplier Base
- BD_CommonContact (actype=V) → ANOS Contact Base (Supplier侧)
- 采购订单 → Procurement Domain (可见: Buyer/CEO)

### 域隔离规则

Customer Domain 与 Supplier Domain 双向隔离。
ERP 导入时必须标注 OwnerRole 和 DataDomain。


---

## 第二层：ANOS领域字段

例如：

```text
Customer.CustomerCode
Customer.CustomerName
Customer.AccountOwner
Customer.CreditLimit
Customer.PaymentMethod
```

#

## 第X章 数据域映射规则 (2026-06 GPT增订)

### Customer Domain

ERP 中所有 `actype=C` 的记录归属于 **Customer Domain**。

映射规则:
- BD_Customer → ANOS Customer Base
- BD_CommonContact (actype=C) → ANOS Contact Base
- 销售订单 → Sales Domain (可见: Sales/CEO)

### Supplier Domain

ERP 中所有 `actype=V` 的记录归属于 **Supplier Domain**。

映射规则:
- BD_Supplier → ANOS Supplier Base
- BD_CommonContact (actype=V) → ANOS Contact Base (Supplier侧)
- 采购订单 → Procurement Domain (可见: Buyer/CEO)

### 域隔离规则

Customer Domain 与 Supplier Domain 双向隔离。
ERP 导入时必须标注 OwnerRole 和 DataDomain。


---

## 第三层：飞书数据表

例如：

```text
Customer Base
```

字段：

- 客户编码
- 客户名称
- 销售负责人
- 信用额度
- 付款方式

#

## 第X章 数据域映射规则 (2026-06 GPT增订)

### Customer Domain

ERP 中所有 `actype=C` 的记录归属于 **Customer Domain**。

映射规则:
- BD_Customer → ANOS Customer Base
- BD_CommonContact (actype=C) → ANOS Contact Base
- 销售订单 → Sales Domain (可见: Sales/CEO)

### Supplier Domain

ERP 中所有 `actype=V` 的记录归属于 **Supplier Domain**。

映射规则:
- BD_Supplier → ANOS Supplier Base
- BD_CommonContact (actype=V) → ANOS Contact Base (Supplier侧)
- 采购订单 → Procurement Domain (可见: Buyer/CEO)

### 域隔离规则

Customer Domain 与 Supplier Domain 双向隔离。
ERP 导入时必须标注 OwnerRole 和 DataDomain。


---

## 第四层：Agent能力

例如：

AI销售助手使用：

- CustomerName
- LastOrderDate
- RFQCount
- QuoteCount
- WinRate

AI风控管理员使用：

- ARAmount
- OverdueDays
- CreditLimit
- PaymentTerm
- CollectionHistory

AI采购专家使用：

- SupplierScore
- PriceTrend
- QualityScore
- DeliveryReliability

---

# 第3章 ERP对象重组

根据当前ERP附件，ERP覆盖10个核心Sheet。

ANOS不按Sheet组织数据，而按领域对象组织数据。

## 3.1 Master Domain

- Customer
- Contact
- Supplier
- Brand
- Product
- Employee

## 3.2 Trading Domain

- Inquiry
- Offer
- Sales Order
- Purchase Order
- Inventory
- Shipment
- Receiving

## 3.3 Financial Domain

- AR
- AP
- Credit
- Risk
- AR Receipt
- AP Payment

## 3.4 Intelligence Domain

- Customer Profile
- Supplier Profile
- Product Profile
- Risk Profile

---

# 第4章 ERP Sheet总览

| ERP Sheet | ERP表 | ANOS对象 | 飞书表 | 优先级 |
| --- | --- | --- | --- | --- |
| 客户资料 | S_CLIENT，actype=C | Customer | Customer Base | P0 |
| 供应商资料 | S_CLIENT，actype=V | Supplier | Supplier Base | P0 |
| 销售询价 | RFQ_INQUIRY | Inquiry | Inquiry Base | P0 |
| 采购报价 | RFQ_SEEK | Offer | Offer Base | P0 |
| 销售订单 | AR_SOH / AR_SOD | Sales Order | SO Base | P0 |
| 采购订单 | AP_POH / AP_POD | Purchase Order | PO Base | P1 |
| 采购收货单 | AP_PDH / AP_PDD | Receiving | Receiving Base | P1 |
| 销售送货单 | AR_SDH / AR_SDD | Shipment / Delivery | Shipment Base | P1 |
| 付款凭证 | AP_PAYH / AP_PAYD | AP Payment | AP Base | P0 |
| 收款凭证 | AR_PAYH / AR_PAYD | AR Receipt | AR Base | P0 |

---

# 第5章 核心对象映射

## 5.1 Customer映射

来源：客户资料 Sheet，ERP表 `S_CLIENT`，`actype=C`。

| ERP字段 | ERP说明 | ANOS字段 | 飞书表 | Agent用途 |
| --- | --- | --- | --- | --- |
| autoid | 系统ID | SourceID | Customer Base | 来源追踪 |
| acno | 客户编号 | CustomerCode | Customer Base | 客户识别 |
| acname | 客户名称 | CustomerName | Customer Base | 销售助手/风控 |
| acname_en | 别名 | CustomerShortName | Customer Base | 客户检索 |
| c_sort | 客户类型 | CustomerType | Customer Base | 客户分层 |
| sellman | 业务员 | AccountOwner | Customer Base | 销售任务 |
| valuelevel | 客户潜在等级 | CustomerPotentialLevel | Customer Base | 客户画像 |
| reservation2 | 客户产出价值等级 | CustomerOutputLevel | Customer Base | 客户价值评分 |
| defaultcur | 交易货币 | Currency | Customer Base | 报价/订单 |
| reservation1 | 客户信用风险等级 | CreditRiskLevel | Customer Base | 风控Agent |
| area | 公司属地 | Region | Customer Base | 区域分析 |
| address | 公司地址 | Address | Customer Base | 客户档案 |
| payment | 付款方式 | PaymentMethod | Customer Base | 信用判断 |
| closepaydate | 结账日 | BillingDay | Customer Base | 回款预测 |
| industry | 行业 | Industry | Customer Base | 行业分析 |
| scale | 规模 | CompanyScale | Customer Base | 客户分层 |
| creditype | 信贷方式 | CreditType | Customer Base | 风控Agent |
| credit | 信贷额度 | CreditLimit | Customer Base | AR风险 |
| mainbusni | 产品服务 | MainBusiness | Customer Base | 客户画像 |
| http | 公司网站 | Website | Customer Base | 客户信息 |
| creator | 创建人 | CreatedBy | Customer Base | 审计 |
| createdate | 创建时间 | CreatedAt | Customer Base | 时间标准 |
| source | 开发渠道 | LeadSource | Customer Base | 来源分析 |
| attenlabel | 评价标签 | Tags | Customer Base | AI标签 |
| customerrequirements | 客户要求 | CustomerRequirements | Customer Base | 销售助手 |

ANOS新增字段：

- CustomerScore
- WinRate
- RiskLevel
- LastActivityAt
- RFQCount
- OrderCount
- PaymentPerformance

## 5.2 Supplier映射

来源：供应商资料 Sheet，ERP表 `S_CLIENT`，`actype=V`。

| ERP字段 | ERP说明 | ANOS字段 | 飞书表 | Agent用途 |
| --- | --- | --- | --- | --- |
| autoid | 系统ID | SourceID | Supplier Base | 来源追踪 |
| acno | 供应商编号 | SupplierCode | Supplier Base | 供应商识别 |
| acname | 供应商名称 | SupplierName | Supplier Base | 采购专家 |
| acname_en | 英文名称 | SupplierEnglishName | Supplier Base | 国际供应 |
| state | 审核状态 | ApprovalStatus | Supplier Base | 风险判断 |
| copen | 是否公开 | IsPublic | Supplier Base | 数据权限 |

ANOS新增字段：

- SupplierScore
- PriceScore
- QualityScore
- RiskScore
- DeliveryReliability
- AuthorizationStatus
- PreferredBrands
- FlyOrderRisk

## 5.3 Inquiry映射

来源：销售询价 Sheet，ERP表 `RFQ_INQUIRY`。

| ERP字段 | ERP说明 | ANOS字段 | 飞书表 | Agent用途 |
| --- | --- | --- | --- | --- |
| autoid | 序号 | InquiryID / SourceID | Inquiry Base | 询价识别 |
| itemcode | 型号 | MPN | Inquiry Base | 产品识别 |
| brand | 品牌 | Brand | Inquiry Base | 品牌识别 |
| pack | 封装 | Package | Inquiry Base | 产品识别 |
| lotno | 批号 | LotNo | Inquiry Base | 批次要求 |
| packing | 包装 | Packing | Inquiry Base | 供应要求 |

ANOS新增字段：

- Customer
- Contact
- Quantity
- TargetPrice
- RequiredDate
- InquiryReceivedTime
- Priority
- Urgency
- WinProbability
- CompletenessScore
- AIRecommendation
- MatchingStatus

## 5.4 Offer映射

来源：采购报价 Sheet，ERP表 `RFQ_SEEK`。

| ERP字段 | ERP说明 | ANOS字段 | 飞书表 | Agent用途 |
| --- | --- | --- | --- | --- |
| autoid | 序号 | OfferID / SourceID | Offer Base | 报价识别 |
| inquiryid | 需求ID | InquiryID | Offer Base | 供需关联 |
| acid | 供应商ID | SupplierID | Offer Base | 供应商识别 |
| acname | 供应商 | SupplierName | Offer Base | 采购专家 |
| linkman | 联系人 | ContactName | Offer Base | 供应商联系 |
| tel | 电话 | Phone | Offer Base | 供应商联系 |

ANOS新增字段：

- MPN
- Brand
- UnitPrice
- Currency
- StockQty
- MOQ
- LeadTime
- ValidUntil
- PriceCompetitiveness
- SupplierRisk
- MatchScore

## 5.5 Sales Order映射

来源：销售订单 Sheet，ERP表 `AR_SOH / AR_SOD`。

| ERP字段 | ERP说明 | ANOS字段 | 飞书表 | Agent用途 |
| --- | --- | --- | --- | --- |
| autoid | 序号 | SOID / SourceID | SO Base | 订单识别 |
| state | 审核状态 | ApprovalStatus | SO Base | 履约判断 |
| docno | 单据号 | SONo | SO Base | 订单编号 |
| period | 单据日期 | OrderDate | SO Base | 时间分析 |
| acid | 客户ID | CustomerID | SO Base | 客户关联 |
| acname | 客户 | CustomerName | SO Base | 客户识别 |

ANOS新增字段：

- RelatedInquiry
- RelatedOffer
- Amount
- Margin
- DeliveryDate
- CollectionRisk
- FulfillmentRisk

## 5.6 Purchase Order映射

来源：采购订单 Sheet，ERP表 `AP_POH / AP_POD`。

| ERP字段 | ERP说明 | ANOS字段 | 飞书表 | Agent用途 |
| --- | --- | --- | --- | --- |
| autoid | 序号 | POID / SourceID | PO Base | 采购识别 |
| docno | 单号 | PONo | PO Base | 采购编号 |
| state | 审核状态 | ApprovalStatus | PO Base | 采购状态 |
| period | 日期 | PODate | PO Base | 时间分析 |
| acid | 供应商ID | SupplierID | PO Base | 供应商关联 |
| acname | 供应商 | SupplierName | PO Base | 采购专家 |

ANOS新增字段：

- RelatedSO
- PurchaseAmount
- LeadTime
- DeliveryRisk
- QualityRisk
- ExpectedArrivalTime

## 5.7 Receiving映射

来源：采购收货单 Sheet，ERP表 `AP_PDH / AP_PDD`。

| ERP字段 | ERP说明 | ANOS字段 | 飞书表 | Agent用途 |
| --- | --- | --- | --- | --- |
| autoid | 序号 | ReceivingID / SourceID | Receiving Base | 收货识别 |
| docno | 单号 | ReceivingNo | Receiving Base | 单据编号 |
| state | 审核状态 | ApprovalStatus | Receiving Base | 状态判断 |
| period | 日期 | ReceivingDate | Receiving Base | 时间分析 |
| doctype | 单据类型 | DocumentType | Receiving Base | 单据分类 |
| acid | 供应商ID | SupplierID | Receiving Base | 供应商关联 |

ANOS新增字段：

- PO
- MPN
- Quantity
- LotNo
- QCStatus
- BatchTrace
- SupplierQualityImpact

## 5.8 Shipment / Delivery映射

来源：销售送货单 Sheet，ERP表 `AR_SDH / AR_SDD`。

| ERP字段 | ERP说明 | ANOS字段 | 飞书表 | Agent用途 |
| --- | --- | --- | --- | --- |
| autoid | 序号 | ShipmentID / SourceID | Shipment Base | 发货识别 |
| docno | 单号 | ShipmentNo | Shipment Base | 单据编号 |
| state | 状态 | Status | Shipment Base | 履约状态 |
| period | 日期 | ShipmentDate | Shipment Base | 时间分析 |
| doctype | 单据类型 | DocumentType | Shipment Base | 单据分类 |
| acid | 客户ID | CustomerID | Shipment Base | 客户关联 |

ANOS新增字段：

- SO
- MPN
- Quantity
- LotNo
- LogisticsInfo
- ARTrigger
- CustomerFulfillmentStatus

## 5.9 AP Payment映射

来源：付款凭证 Sheet，ERP表 `AP_PAYH / AP_PAYD`。

| ERP字段 | ERP说明 | ANOS字段 | 飞书表 | Agent用途 |
| --- | --- | --- | --- | --- |
| autoid | 序号 | APPaymentID / SourceID | AP Base | 付款识别 |
| docno | 单号 | PaymentNo | AP Base | 单据编号 |
| state | 状态 | Status | AP Base | 状态判断 |
| period | 日期 | PaymentDate | AP Base | 现金流 |
| acid | 客户ID | CounterpartyID | AP Base | 往来单位 |
| acname | 客户 | CounterpartyName | AP Base | 往来单位 |

ANOS新增字段：

- Supplier
- APAmount
- OutstandingAmount
- PaymentPriority
- CashPressureScore
- SupplierRelationshipImpact

## 5.10 AR Receipt映射

来源：收款凭证 Sheet，ERP表 `AR_PAYH / AR_PAYD`。

| ERP字段 | ERP说明 | ANOS字段 | 飞书表 | Agent用途 |
| --- | --- | --- | --- | --- |
| autoid | 序号 | ARReceiptID / SourceID | AR Base | 收款识别 |
| docno | 单号 | ReceiptNo | AR Base | 单据编号 |
| state | 状态 | Status | AR Base | 状态判断 |
| period | 日期 | ReceiptDate | AR Base | 回款分析 |
| acid | 客户ID | CustomerID | AR Base | 客户关联 |
| acname | 客户 | CustomerName | AR Base | 客户识别 |

ANOS新增字段：

- PaymentReceivedEvent
- CollectionCycle
- CreditUpdate
- OverdueRecoveryStatus

---

# 第6章 字段优先级

## 6.1 P0 必须同步

P0字段支撑第一阶段Trading Intelligence OS。

- Customer
- Supplier
- Product
- Inquiry
- Offer
- SO
- AR
- AP

## 6.2 P1 重要同步

- Contact
- PO
- Shipment
- Receiving
- Inventory
- Credit
- Risk

## 6.3 P2 可选同步

- Remark
- Attachment
- Log
- Historical Archive

---

# 第7章 ANOS新增字段

ERP没有但ANOS必须新增的字段包括：

## 7.1 时间智能

- CreatedAt
- UpdatedAt
- EventTime
- LastActivityAt
- FirstOrderDate
- LastOrderDate
- LastContactAt

## 7.2 AI智能

- AIScore
- RiskScore
- PredictionScore
- AIInsight
- AITags
- AIRecommendation
- AIConfidence

## 7.3 数据治理

- Source
- SourceID
- SourceType
- SourceOwner
- AIGenerated
- AIModified
- HumanVerified
- ConfidenceScore

## 7.4 事件驱动

- EventID
- EventType
- EventTime
- PreviousState
- CurrentState
- RelatedAgent

---

# 第8章 实施路径

## 8.1 映射执行顺序

建议执行顺序：

```text
20-ANOS企业数据字典
↓
21-ERP字段映射方案
↓
22-飞书多维表格总体设计方案
↓
11-ANOS Portal三纵列工作台设计规范
↓
12-Agent Network总体设计
```

## 8.2 第一批落地对象

第一阶段建议只建设7张核心数据表：

1. Customer Base
2. Supplier Base
3. Product Base
4. Inquiry Base
5. Offer Base
6. SO Base
7. AR Risk Base

这7张表覆盖销售、采购、风控三个最核心部门。

## 8.3 最终链路

映射完成后形成：

```text
ERP
↓
ERP API / 导入
↓
ANOS Data Model
↓
Feishu Data Hub
↓
Portal
↓
Agent
↓
Workflow
```

## 8.4 本文档结论

ERP字段映射不是技术搬运，而是业务对象重构。

ERP保存历史事实。

ANOS定义未来标准。

飞书多维表格承载第一阶段数据中台。

Agent和Portal基于ANOS标准模型开展智能协同。
