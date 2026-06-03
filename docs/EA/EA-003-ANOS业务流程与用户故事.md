# 02-ANOS业务流程与用户故事 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** 业务流程 / 用户故事 / MVP需求来源  
**上游文档：** [01-ANOS项目范围与MVP定义 V1.0.md](01-ANOS项目范围与MVP定义%20V1.0.md)  
**版本：** V1.0  
**状态：** P0开发前基线

---

## 目录

- 第1章 核心业务闭环
- 第2章 销售流程
- 第3章 采购流程
- 第4章 风控流程
- 第5章 管理层流程
- 第6章 用户故事
- 第7章 异常流程

---

# 第1章 核心业务闭环

P0核心闭环：

```text
客户需求进入
↓
需求结构化
↓
供应资源结构化
↓
供需匹配生成商机
↓
销售确认报价建议
↓
订单与应收风险跟踪
```

核心原则：

- 信息先进入AI Inbox。
- 数据必须结构化沉淀。
- Agent生成建议，人工做最终确认。
- 所有结论必须可追溯来源。

# 第2章 销售流程

## SALES-FLOW-001 RFQ处理流程

```text
销售上传客户邮件/截图/Excel
↓
AI Inbox识别为Demand
↓
Inquiry Intake Workflow解析
↓
写入Inquiry Base
↓
Sales Agent生成需求摘要
↓
Matching Workflow寻找供应资源
↓
生成Opportunity
↓
销售确认后进入报价草案
```

关键数据：

- Customer
- Contact
- MPN
- Brand
- Quantity
- TargetPrice
- RequiredDate
- Source

## SALES-FLOW-002 客户上下文查看流程

销售打开客户卡片，系统展示：

- 客户等级
- 历史RFQ
- 历史订单
- 回款风险
- 最近沟通
- Agent建议

# 第3章 采购流程

## PROC-FLOW-001 供应资源录入流程

```text
采购上传供应商报价单/库存表/群聊截图
↓
AI Inbox识别为Supply
↓
Supply Intake Workflow解析
↓
写入Supply Resource Base
↓
Procurement Agent评估价格、库存、交期、风险
↓
触发Opportunity Matching
```

关键数据：

- Supplier
- Brand
- MPN
- StockQty
- Price
- LeadTime
- MOQ
- DateCode
- Source

## PROC-FLOW-002 替代料建议流程

```text
销售或采购输入目标型号
↓
Procurement Agent查询Product Base和行业知识
↓
生成替代料候选
↓
展示风险、来源、可信度
↓
人工确认是否采用
```

# 第4章 风控流程

## RISK-FLOW-001 AR风险识别流程

```text
ERP或金蝶更新AR数据
↓
AR Risk Workflow计算账龄
↓
Credit Agent生成风险等级
↓
写入AR Risk Base
↓
推送销售/财务/管理层
↓
人工确认处置动作
```

风险等级：

- Low
- Medium
- High
- Critical

可建议动作：

- 催收
- 停止新增授信
- 停单
- 法务介入

禁止自动执行高风险动作。

# 第5章 管理层流程

## CEO-FLOW-001 每日经营摘要

管理层进入Portal后查看：

- 今日新增RFQ
- 今日新增供应资源
- 新增Opportunity
- 高风险AR
- Agent建议

P0不追求完整CEO驾驶舱，但必须支持经营摘要。

# 第6章 用户故事

## 销售

- 作为销售，我希望上传客户RFQ后系统自动识别型号、数量、交期，以便减少手工录入。
- 作为销售，我希望看到客户历史订单和回款风险，以便判断报价策略。
- 作为销售，我希望系统生成报价邮件草案，以便提高响应速度。

## 采购

- 作为采购，我希望上传供应商库存表后自动识别资源，以便快速形成供应资源池。
- 作为采购，我希望系统自动比较价格、交期和风险，以便选择更优供应商。
- 作为采购，我希望看到国产替代建议，以便应对缺货和EOL风险。

## 风控

- 作为风控人员，我希望系统自动识别超期应收，以便提前介入。
- 作为财务人员，我希望看到客户风险变化来源，以便判断风险是否可信。
- 作为管理层，我希望看到高风险客户清单，以便及时决策。

## 系统管理员

- 作为管理员，我希望管理表权限和Agent权限，以便控制数据安全。
- 作为管理员，我希望看到Workflow失败记录，以便及时修复流程。

# 第7章 异常流程

| 异常 | 处理方式 |
| --- | --- |
| AI无法识别MPN | 标记为待人工补充 |
| 客户无法匹配 | 创建待匹配Customer候选 |
| 供应商无法匹配 | 创建待匹配Supplier候选 |
| 来源缺失 | 禁止进入正式业务表，只能进入待处理池 |
| 风险评分缺少依据 | 只显示风险提示，不允许生成处置建议 |
| Workflow失败 | 写入Workflow Operations Center并通知Owner |

