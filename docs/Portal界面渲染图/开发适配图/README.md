# ANOS Portal开发适配图

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** Portal前端开发适配原型图索引  
**上游文档：** `docs/Portal界面渲染图/README.md`、`docs/Portal界面渲染图/Portal UI Reference V1.0.md`、`docs/25-权限与审计规范 V1.0.md`  
**版本：** V1.0  
**状态：** P0开发参考图基线

---

## 1. 定位

本目录补充的是开发落地需要的状态图、组件图和交互图。它们不是营销展示图，主要用于帮助Codex、Claude和前端工程师理解：

- 路由和角色如何影响默认工作台。
- 权限不足与字段脱敏如何呈现。
- Source Card、审批、通知、搜索、表格、附件解析和审计日志如何组件化。
- 空状态、加载态、错误态如何统一处理。

## 2. 图片清单

| 序号 | 文件 | 开发价值 |
| --- | --- | --- |
| 01 | `01-Role-Routing-Workspace-Permission.png` | 定义登录后角色选择、默认路由、菜单可见性和字段权限预览 |
| 02 | `02-Access-Denied-Field-Redaction.png` | 定义权限不足页、锁定字段、脱敏字段和临时权限申请 |
| 03 | `03-Source-Card-State-Set.png` | 定义Source Card的状态、字段、操作和可见性策略 |
| 04 | `04-Human-Approval-Center.png` | 定义人工确认中心、审批队列、审批详情和操作按钮 |
| 05 | `05-Notification-Task-Center.png` | 定义通知与待办中心、SLA、任务详情和快捷处理 |
| 06 | `06-Global-Search-Results.png` | 定义全局搜索结果、筛选、权限说明和脱敏结果 |
| 07 | `07-Empty-Loading-Error-States.png` | 定义空、加载、错误、权限空态、解析中等通用状态组件 |
| 08 | `08-Table-Filter-Column-Batch-Actions.png` | 定义表格筛选、列设置、批量操作和右侧筛选面板 |
| 09 | `09-Upload-Parse-Pipeline.png` | 定义附件上传、解析流水线、字段置信度和异常处理 |
| 10 | `10-Audit-Log-Detail.png` | 定义审计日志详情、字段级决策、证据链和导出操作 |

## 3. 开发硬约束

1. 所有页面保持统一浅色左侧导航。
2. 人机指令入口固定在底部操作区。
3. 销售视图不得显示供应商真实名称、采购价、供应商联系人和供应商SourceURL。
4. 采购视图不得显示客户真实名称、客户信用额度和销售敏感备注。
5. 错误提示、搜索结果、通知、审计日志也必须遵守字段级脱敏。
6. Source Card必须有状态、可信度、来源时间、审计ID和可操作按钮。
7. Agent动作必须有人工确认或审计回放能力。

## 4. 给Codex/Claude的使用方式

开发Portal页面前，建议按顺序读取：

1. `docs/Portal界面渲染图/README.md`
2. `docs/Portal界面渲染图/Portal UI Reference V1.0.md`
3. `docs/Portal界面渲染图/开发适配图/README.md`
4. 当前要实现页面对应的PNG

实现时优先把这些图拆成复用组件，而不是逐页硬编码。

