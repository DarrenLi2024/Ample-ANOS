# ANOS Portal界面渲染图

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** Portal高保真界面参考图索引  
**上游文档：** `docs/11-ANOS Portal 三纵列工作台设计规范 V1.0.md`、`docs/43-ANOS Portal 页面原型规范 V1.0.md`、`docs/25-权限与审计规范 V1.0.md`、`docs/76-统一智能入口AI Inbox设计规范 V1.0.md`  
**版本：** V1.0  
**状态：** 开发参考基线

---

## 1. 使用原则

本目录只归档经过权限隔离复核的Portal界面渲染图，供后续Codex、Claude或前端工程师开发时参考。

早期生成图中存在销售视图与采购视图同时展示客户名称和供应商名称的问题，不得作为开发参考。正式开发应以本目录图片和本文档约束为准。

## 2. 权限红线

| 角色视图 | 可以展示 | 必须脱敏或隐藏 |
| --- | --- | --- |
| 销售/业务 | 客户名称、客户RFQ、目标价格、匹配度、采购Owner、供应资源ID、交期区间、授权状态、风险等级 | 供应商真实名称、供应商联系人、采购价、采购Source URL、供应商原始报价明细 |
| 采购 | 供应商名称、供应商报价、库存、采购价、交期、授权状态、供应商Source | 客户真实名称、客户联系人、客户信用额度、销售敏感备注、客户Source原文 |
| 风控 | 客户信用、AR、发票、回款、审计轨迹 | 与风险处置无关的采购成本、供应商私域信息 |
| 运营/系统 | 工作流状态、Agent状态、审计ID、对象ID、脱敏摘要 | 未授权的客户/供应商明文、原始敏感附件 |
| CEO/管理层 | 聚合指标、脱敏钻取入口、经营趋势 | 未授权明细；如需明细必须走权限申请或审批 |

## 3. 图片清单

| 序号 | 文件 | 页面/视图 | 主要用途 | 权限说明 |
| --- | --- | --- | --- | --- |
| 01 | `01-AI-Inbox-Home-Sales-Permissioned.png` | AI Inbox首页 / 销售视图 | 统一入口、动态流、底部指令栏 | 供应资源只展示ID和采购Owner |
| 02 | `02-Sales-Workspace-Permissioned.png` | 销售工作台 | 销售RFQ、报价建议、客户卡片 | 供应商名称和采购价已脱敏 |
| 03 | `03-Procurement-Workspace-Permissioned.png` | 采购工作台 | 供应资源池、需求匹配、采购确认 | 客户名称和客户信用已脱敏 |
| 04 | `04-Risk-Workspace.png` | 风控工作台 | AR风险监控、催收建议、人工确认 | 风控角色可见客户信用与AR |
| 05 | `05-Opportunity-Sales-View-Permissioned.png` | Opportunity详情 / 销售视图 | 商机匹配、报价前确认 | 供应商信息脱敏为SR资源 |
| 06 | `06-Opportunity-Procurement-View-Permissioned.png` | Opportunity详情 / 采购视图 | 供应资源确认、采购建议 | 客户信息脱敏为客户ID |
| 07 | `07-RFQ-Inquiry-Create-Sales-View.png` | RFQ解析与Inquiry创建 | 客户RFQ录入、字段校验 | 销售视图，不展示供应商 |
| 08 | `08-Supply-Resource-Create-Procurement-View.png` | 供应资源解析 | 供应商报价单解析、写入资源池 | 采购视图，客户侧信息脱敏 |
| 09 | `09-Quotation-Approval-Sales-View.png` | 报价建议与人工确认 | 生成报价草案、销售审批 | 报价依据仅展示脱敏供应资源 |
| 10 | `10-AR-Risk-Disposition.png` | AR风险详情与处置 | 催收、停单、法务升级 | 风控视图，保留审计轨迹 |
| 11 | `11-Customer-360-Sales-View.png` | 客户360画像 | 客户经营、RFQ、订单、风险 | 销售视图，不展示供应商明文 |
| 12 | `12-Workflow-Operations-Center.png` | Workflow Operations Center | 工作流运行、失败重试、Source First检查 | 对象ID和来源摘要优先脱敏 |
| 13 | `13-Agent-Center.png` | Agent Center | Agent状态、任务、权限、审计 | 跨部门任务中的对象名脱敏 |
| 14 | `14-Knowledge-Center-QA.png` | 知识中心问答 | SOP检索、引用来源、权限状态 | 无权限文档只显示不可访问 |
| 15 | `15-Localization-Recommendation-Procurement-View.png` | 国产替代推荐 / 采购视图 | 替代料推荐、样品申请、技术确认 | 客户需求仅展示脱敏摘要 |
| 16 | `16-CEO-Daily-Summary-Aggregated.png` | CEO经营摘要 / 聚合视图 | 聚合指标、受控钻取、经营趋势 | 明细默认脱敏，钻取需权限 |

## 4. 为什么是16张

原计划是15张Portal功能渲染图，但`Opportunity详情`不能用一张图同时服务销售和采购。为满足权限隔离要求，该页面拆分为：

- 销售视图：客户可见，供应商脱敏。
- 采购视图：供应商可见，客户脱敏。

因此本批正式归档为16张。

## 5. 开发引用要求

开发时不得逐像素复刻图片中的随机文本或错别字，应提炼为组件、布局、状态和权限规则。

必须固化的设计约束：

1. 左侧导航统一浅色背景。
2. 人机指令入口常驻底部，靠近用户操作区。
3. 销售工作台与采购工作台保持同一信息架构和视觉语言。
4. 所有Source Card必须绑定来源、可信度和审计记录。
5. 任何Agent建议都必须保留人工确认入口。
6. 跨销售/采购的数据展示必须先经过权限判断和字段级脱敏。

## 6. 开发适配图

除本目录16张页面级渲染图外，`开发适配图/` 子目录补充了10张P0开发适配图，覆盖角色路由、权限不足、Source Card状态、人工确认中心、通知待办、全局搜索、页面状态、表格操作、附件解析和审计日志详情。

这些图应作为前端组件、状态管理、权限守卫和审计链路实现的优先参考。

## 7. P0实施开发图

`P0实施开发图/` 子目录补充了12张实施与开发联调参考图，覆盖Data Hub、P0表关系、ERP Raw Zone、字段映射、同步监控、冲突队列、Workflow失败接管、Agent Tool调用、Agent权限矩阵和MVP验收驾驶舱。

这些图应作为数据中台、ERP集成、Workflow、Agent工具、权限审计和验收后台的优先参考。
