# 87-飞书实施WBS V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** 飞书实施WBS / 6周落地计划 / 执行清单  
**上游文档：** [70-飞书生态实施手册总纲 V1.0.md](70-飞书生态实施手册总纲%20V1.0.md)、[72-飞书多维表格实施手册 V1.0.md](72-飞书多维表格实施手册%20V1.0.md)、[73-飞书工作流实施手册 V1.0.md](73-飞书工作流实施手册%20V1.0.md)、[75-飞书Portal实施手册 V1.0.md](75-飞书Portal实施手册%20V1.0.md)  
**版本：** V1.0  
**状态：** 实施执行基线

---

# 第1章 WBS目标

用6周完成ANOS P0飞书生态试运行基础。

目标：

- P0多维表格建成。
- P0数据导入完成。
- P0 Workflow可运行。
- 销售、采购、风控Portal基础可用。
- AI Inbox基础可用。
- Source Card和权限框架可用。

# 第2章 Week 1 资源盘点与字段确认

任务：

- 盘点飞书空间、知识库、多维表格、群聊、自动化。
- 确认P0表Owner。
- 确认P0字段。
- 确认权限分组。
- 准备ERP样例数据。

交付：

- 飞书资源盘点表。
- P0字段确认表。
- 权限矩阵草案。

# 第3章 Week 2 多维表格搭建

任务：

- 建立ANOS Data Hub空间。
- 建立Customer Base。
- 建立Supplier Base。
- 建立Product Base。
- 建立Inquiry Base。
- 建立Supply Resource Base。
- 建立Opportunity Base。
- 建立AR Risk Base。

交付：

- P0表。
- P0视图。
- Source字段。
- Data Health字段。

# 第4章 Week 3 数据导入与校验

任务：

- 导入客户样例数据。
- 导入供应商样例数据。
- 导入产品样例数据。
- 导入SO/AR样例数据。
- 建立导入日志。
- 校验数据质量。

交付：

- 初始数据集。
- 导入日志。
- 数据质量报告。

# 第5章 Week 4 Workflow搭建

任务：

- WF-000 Asset Registration。
- WF-001 Inquiry Intake。
- WF-002 Supply Intake。
- WF-003 Opportunity Matching。
- WF-004 AR Risk。

交付：

- P0 Workflow。
- Workflow测试记录。
- 异常处理视图。

# 第6章 Week 5 Portal与AI Inbox

任务：

- 销售工作台基础版。
- 采购工作台基础版。
- 风控工作台基础版。
- AI Inbox基础入口。
- Source Card组件。

交付：

- Portal P0页面。
- AI Inbox入口。
- Source Card展示。

# 第7章 Week 6 Agent与试运行

任务：

- Sales Agent基础配置。
- Procurement Agent基础配置。
- Credit Agent基础配置。
- Agent Tool权限配置。
- 试运行真实或脱敏场景。
- 收集反馈。

交付：

- 三个P0 Agent。
- 试运行报告。
- 问题清单。
- 下一阶段优化计划。

# 第8章 角色分工

| 角色 | 职责 |
| --- | --- |
| 业务负责人 | 确认流程、字段、验收 |
| 数据负责人 | 数据导入、质量校验 |
| 飞书实施负责人 | 表格、Workflow、Portal搭建 |
| Agent负责人 | Agent配置、工具权限、输出标准 |
| 安全负责人 | 权限、审计、敏感字段 |
| Codex | 文档、接口、脚本、测试支持 |

# 第9章 风险清单

| 风险 | 应对 |
| --- | --- |
| ERP接口不可用 | 先用Excel导入 |
| 字段口径不统一 | 以20数据字典为准 |
| 权限过宽 | 先收紧，逐步开放 |
| AI解析不稳定 | 引入人工确认队列 |
| 一线使用负担高 | 保持AI Inbox和拖拽上传优先 |

# 第10章 试运行完成标准

试运行通过条件：

- 至少20条RFQ完成结构化。
- 至少20条供应资源完成结构化。
- 至少5条Opportunity生成。
- 至少10条AR风险进入风险池。
- 销售、采购、风控各完成一次真实任务。
- 所有样例均有Source字段。
- 权限测试无高危问题。

