# 03-ERP样例数据包说明

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** ERP脱敏样例数据准备说明 / P0导入测试Source要求  
**上游文档：** [../23-ERP同步策略与数据导入规范 V1.0.md](../23-ERP同步策略与数据导入规范%20V1.0.md)、[../84-ERP API集成规范 V1.0.md](../84-ERP%20API集成规范%20V1.0.md)  
**版本：** V1.0  
**状态：** 待准备

---

## 1. 目标

ERP样例数据包用于：

- 验证字段映射。
- 验证飞书P0建表。
- 验证导入脚本或手工导入流程。
- 验证Workflow和Agent输出。
- 验证权限和审计。

样例数据应尽量真实，但必须脱敏。

## 2. 文件组织建议

建议受控存放，不直接提交真实数据到GitHub。

```text
P0_ERP_Sample_Data/
├── README.md
├── 01_customer_sample.xlsx
├── 02_supplier_sample.xlsx
├── 03_product_sample.xlsx
├── 04_inquiry_sample.xlsx
├── 05_offer_sample.xlsx
├── 06_so_sample.xlsx
├── 07_ar_sample.xlsx
├── 08_supply_resource_sample.xlsx
└── 99_abnormal_cases.xlsx
```

若必须放入仓库，只能放脱敏或模拟数据。

## 3. 样例数据规模

| 对象 | 最小数量 | 推荐数量 | 说明 |
| --- | --- | --- | --- |
| Customer | 10 | 50 | 覆盖不同等级、国家、Owner |
| Supplier | 10 | 50 | 覆盖授权、贸易商、风险供应商 |
| Product | 50 | 200 | 覆盖品牌、MPN、封装、生命周期 |
| Inquiry | 20 | 100 | 覆盖不同客户和型号 |
| Offer | 20 | 100 | 覆盖不同供应商和价格 |
| SO | 10 | 50 | 用于订单与AR关联 |
| AR | 10 | 50 | 覆盖未逾期、30/60/90天 |
| Supply Resource | 20 | 100 | 覆盖现货、期货、不同来源 |
| Abnormal Cases | 5 | 20 | 缺字段、重复、错误格式 |

## 4. 脱敏要求

必须脱敏：

- 客户真实名称，可保留行业和国家。
- 联系人姓名、电话、邮箱。
- 真实价格、毛利、付款金额。
- 合同编号、发票号。
- 银行账号、税号。
- 非公开附件URL。

建议替换：

```text
真实客户 → CUSTOMER_A / CUSTOMER_B
真实供应商 → SUPPLIER_A / SUPPLIER_B
真实联系人 → CONTACT_001
真实金额 → 按比例缩放或区间化
```

## 5. 必须保留的测试字段

脱敏后仍需保留业务结构：

- ERP原始ID。
- 创建时间。
- 更新时间。
- 状态。
- 业务关系。
- 数量、交期、账期等可测试字段。
- SourceSystem。

否则无法验证同步和关联。

## 6. P0对象字段要求

## Customer Sample

必须包含：

- ERPRecordID
- CustomerNameMasked
- Country
- Industry
- AccountOwner
- CustomerLevel
- CreditLimitMasked
- PaymentTerm
- UpdatedAt

## Supplier Sample

必须包含：

- ERPRecordID
- SupplierNameMasked
- Country
- AuthorizationLevel
- SupplierType
- PaymentTerm
- RiskLevel
- UpdatedAt

## Product Sample

必须包含：

- Brand
- MPN
- Description
- Category
- Package
- Lifecycle
- UpdatedAt

## Inquiry Sample

必须包含：

- ERPRecordID
- CustomerERPRecordID
- Brand
- MPN
- Quantity
- TargetPriceMasked
- RequiredDate
- InquiryDate
- Status

## Supply Resource Sample

必须包含：

- SupplierERPRecordID
- Brand
- MPN
- StockQty
- PriceMasked
- LeadTime
- MOQ
- DateCode
- SourceType
- EventTime

## AR Sample

必须包含：

- ERPRecordID
- CustomerERPRecordID
- SORecordID
- ARAmountMasked
- PaidAmountMasked
- OutstandingAmountMasked
- DueDate
- OverdueDays
- UpdatedAt

## 7. 异常样例要求

必须准备：

- MPN缺失。
- Customer无法匹配。
- Supplier无法匹配。
- 重复客户。
- 重复供应资源。
- 日期格式错误。
- 金额为空。
- Source缺失。

异常样例用于验证人工确认队列和数据质量治理。

## 8. 数据包登记表

| 文件 | Owner | 数据日期 | 脱敏方式 | 存放位置 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| 01_customer_sample.xlsx | 待填写 | 待填写 | 待填写 | 待填写 | Pending |  |
| 02_supplier_sample.xlsx | 待填写 | 待填写 | 待填写 | 待填写 | Pending |  |
| 03_product_sample.xlsx | 待填写 | 待填写 | 待填写 | 待填写 | Pending |  |
| 04_inquiry_sample.xlsx | 待填写 | 待填写 | 待填写 | 待填写 | Pending |  |
| 05_offer_sample.xlsx | 待填写 | 待填写 | 待填写 | 待填写 | Pending |  |
| 06_so_sample.xlsx | 待填写 | 待填写 | 待填写 | 待填写 | Pending |  |
| 07_ar_sample.xlsx | 待填写 | 待填写 | 待填写 | 待填写 | Pending |  |
| 08_supply_resource_sample.xlsx | 待填写 | 待填写 | 待填写 | 待填写 | Pending |  |
| 99_abnormal_cases.xlsx | 待填写 | 待填写 | 待填写 | 待填写 | Pending |  |

