# ANOS P0实施开发图

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** P0实施与开发联调参考图索引  
**上游文档：** `docs/22-飞书多维表格总体设计方案V1.0.md`、`docs/23-ERP同步策略与数据导入规范 V1.0.md`、`docs/24-API与工具接口设计 V1.0.md`、`docs/26-开发任务拆解与里程碑计划 V1.0.md`、`docs/27-验收标准与测试方案 V1.0.md`  
**版本：** V1.0  
**状态：** P0实施开发参考基线

---

## 1. 定位

本目录补齐从文档到开发落地之间的实施型界面参考，重点覆盖：

- 飞书多维表格 / ANOS Data Hub 建表与关系。
- ERP Raw Zone、字段映射、同步任务与冲突队列。
- Workflow失败重试、Agent Tool调用与权限矩阵。
- MVP验收驾驶舱。

这些图应优先服务Codex、Claude和开发人员理解系统后台、数据治理、集成联调和验收闭环。

## 2. 图片清单

| 序号 | 文件 | 对应文档 | 开发价值 |
| --- | --- | --- | --- |
| 01 | `01-ANOS-Data-Hub-Home.png` | `72-飞书多维表格实施手册` | 展示Data Hub空间目录、P0表状态、Source覆盖和实施清单 |
| 02 | `02-P0-Core-Table-Relationship-Map.png` | `22-飞书多维表格总体设计方案` | 展示P0核心表之间的主关系、引用关系和Source/Audit关联 |
| 03 | `03-Inquiry-Base-Table-View.png` | `72-飞书多维表格实施手册` | 展示Inquiry Base表格字段、销售视图权限和右侧记录详情 |
| 04 | `04-Supply-Resource-Base-Table-View.png` | `72-飞书多维表格实施手册` | 展示Supply Resource Base表格字段、采购视图权限和客户侧脱敏 |
| 05 | `05-ERP-Raw-Zone-Import-Workspace.png` | `23-ERP同步策略与数据导入规范` | 展示ERP原始导入、字段识别、校验和错误处理 |
| 06 | `06-ERP-to-ANOS-Field-Mapping.png` | `21-ERP字段映射方案`、`23-ERP同步策略` | 展示ERP字段到ANOS字段的映射、转换规则和发布版本 |
| 07 | `07-Sync-Job-Monitor.png` | `23-ERP同步策略与数据导入规范` | 展示同步任务、失败记录、重试、日志和错误分类 |
| 08 | `08-Data-Conflict-Queue.png` | `23-ERP同步策略与数据导入规范` | 展示ERP与ANOS人工增强字段冲突时的治理队列 |
| 09 | `09-Workflow-Failure-Retry-Handoff.png` | `27-验收标准与测试方案` | 展示Workflow失败、重试、人工接管和SLA影响 |
| 10 | `10-Agent-Tool-Call-Detail.png` | `24-API与工具接口设计`、`25-权限与审计规范` | 展示Agent Tool调用链、权限决策、字段脱敏和AuditID |
| 11 | `11-Agent-Permission-Matrix.png` | `25-权限与审计规范`、`45-Agent操作系统规范` | 展示Agent对对象、工具、Workflow、导出的权限矩阵 |
| 12 | `12-MVP-Acceptance-Dashboard.png` | `27-验收标准与测试方案` | 展示P0表、Workflow、Portal、Agent、权限、审计的验收状态 |

## 3. 权限与质量说明

1. `03-Inquiry-Base-Table-View.png` 为销售视图，不出现供应商名称和采购成本字段。
2. `04-Supply-Resource-Base-Table-View.png` 为采购视图，客户名称、联系人和信用信息脱敏。
3. `10-Agent-Tool-Call-Detail.png` 明确展示Sales Agent调用工具后的字段级脱敏结果。
4. ERP、同步、冲突、验收类界面默认展示对象ID、统计、错误摘要和审计ID，避免暴露明细敏感数据。
5. 这批图中部分后台表格由本地程序绘制，用于保证字段文字、权限标注和开发结构准确。

## 4. 给开发AI的使用方式

实现P0阶段后台、数据中台或联调页面时，建议先读：

1. `instructions.md`
2. `docs/CONTEXT.md`
3. `docs/Portal界面渲染图/P0实施开发图/README.md`
4. 当前页面对应PNG
5. 对应上游规范文档

实现时应优先抽象：

- `DataHubTable`
- `RelationshipMap`
- `ImportJobPanel`
- `FieldMappingGrid`
- `SyncJobMonitor`
- `ConflictResolutionQueue`
- `WorkflowRunDetail`
- `ToolCallTrace`
- `AgentPermissionMatrix`
- `AcceptanceDashboard`

