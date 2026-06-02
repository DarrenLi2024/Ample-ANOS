# ANOS项目上下文入口

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** 新会话、新AI、新开发任务的上下文入口  
**适用对象：** 人类、Codex、Claude、ChatGPT及其他AI助手  
**版本：** V1.0  
**状态：** 飞书实施与工程落地准备基线

---

## 1. 项目一句话说明

ANOS是安芯易集团面向AI时代建设的企业级AI原生操作系统，第一阶段聚焦Trading Intelligence OS，通过Portal、Data Hub、Agent Network、Workflow和Knowledge Hub，把分散的业务信息转化为可复用的数据、知识、智能和行动。

## 2. 当前阶段

当前处于正式开发前准备阶段，但项目已经完成从战略架构到实施架构的关键扩展。

已有文档已经定义了项目愿景、总体架构、MVP范围、业务流程、数据标准、ERP映射、同步策略、API接口、权限审计、飞书多维表格、Portal工作台、Agent Network、技术架构、建表蓝图、交易智能网络、Agent OS、组织智能治理、飞书实施总纲、AI Inbox、GitHub结构、SQL演进、ERP API、MCP服务和飞书实施WBS。

下一步重点不是继续扩展概念，而是确认关键业务决策、建立真实飞书实施环境、准备ERP样例数据，并开始按WBS执行P0落地。

## 3. 已有核心文档

必须优先阅读：

- `docs/00-ANOS总体架构设计白皮书V1.0.md`
- `docs/01-ANOS项目范围与MVP定义 V1.0.md`
- `docs/02-ANOS业务流程与用户故事 V1.0.md`
- `docs/20-ANOS企业数据字典V1.0.md`
- `docs/21-ERP字段映射方案V1.0.md`
- `docs/22-飞书多维表格总体设计方案V1.0.md`
- `docs/23-ERP同步策略与数据导入规范 V1.0.md`
- `docs/24-API与工具接口设计 V1.0.md`
- `docs/25-权限与审计规范 V1.0.md`
- `docs/26-开发任务拆解与里程碑计划 V1.0.md`
- `docs/27-验收标准与测试方案 V1.0.md`
- `docs/11-ANOS Portal 三纵列工作台设计规范 V1.0.md`
- `docs/12-Agent Network总体设计规范 V1.0.md`
- `docs/30-ANOS技术架构设计规范 V1.0.md`
- `docs/42-ANOS数据中台建表蓝图 V1.0.md`
- `docs/43-ANOS Portal 页面原型规范 V1.0.md`
- `docs/44-ANOS Trading Intelligence Architecture V1.0.md`
- `docs/45-Agent操作系统规范 V1.0.md`
- `docs/46-ANOS组织智能治理框架 V1.0.md`
- `docs/70-飞书生态实施手册总纲 V1.0.md`
- `docs/72-飞书多维表格实施手册 V1.0.md`
- `docs/73-飞书工作流实施手册 V1.0.md`
- `docs/75-飞书Portal实施手册 V1.0.md`
- `docs/76-统一智能入口AI Inbox设计规范 V1.0.md`
- `docs/81-GitHub项目结构规范 V1.0.md`
- `docs/83-ANOS数据库设计SQL版 V1.0.md`
- `docs/84-ERP API集成规范 V1.0.md`
- `docs/85-MCP服务规范 V1.0.md`
- `docs/87-飞书实施WBS V1.0.md`
- `docs/ERP数据结构字段清单.md`
- `docs/Portal界面渲染图/README.md`
- `docs/Portal界面渲染图/Portal UI Reference V1.0.md`

辅助材料：

- `docs/附件/数据库结构.xlsx`
- `docs/会话归档/chatgpt_share_6a1c6208_latest.html`
- `docs/P0实施准备包/README.md`

## 4. ANOS核心定位

ANOS不是：

- 传统ERP
- 单点AI工具
- 普通知识库
- 报表系统
- 聊天机器人集合

ANOS是：

- 企业信息入口
- 企业数据中台
- 企业知识记忆
- 企业Agent网络
- 企业工作流引擎
- 企业AI原生工作入口

核心链路：

```text
Information
↓
Knowledge
↓
Intelligence
↓
Action
```

## 5. 第一阶段范围

第一阶段聚焦Trading Intelligence OS。

重点业务域：

- 客户智能
- 供应商智能
- 询价智能
- 报价智能
- 供需匹配
- AR/AP风险
- Portal V1
- 第一批Agent

第一批建议数据表：

1. Customer Base
2. Supplier Base
3. Product Base
4. Inquiry Base
5. Offer Base
6. SO Base
7. Supply Resource Base
8. AR Base

第一批建议Agent：

- AI销售助手
- AI采购专家
- AI风控管理员

## 6. 当前已确认原则

项目原则：

- Business First
- AI First
- Feishu First
- Knowledge First
- Quick Win First
- Chinese First
- Long-Term First

实施原则：

- 小步快跑
- 数据先行
- 飞书原生优先
- Agent渐进
- 人工可控
- 安全可审计
- 持续复盘

## 7. 技术和生态方向

第一阶段优先使用飞书生态和轻量扩展能力：

- 飞书文档
- 飞书知识库
- 飞书多维表格
- 飞书妙搭
- Aily
- OpenClaw
- ERP / 金蝶保留存量系统能力

当前不建议优先建设重型自研中台。

合理路径：

```text
飞书原生验证
↓
轻量扩展
↓
关键能力沉淀
↓
必要时独立系统化
```

## 8. 已补齐P0文档

以下P0文档已经补齐，可作为实施准备基线：

1. `01-ANOS项目范围与MVP定义 V1.0.md`
2. `02-ANOS业务流程与用户故事 V1.0.md`
3. `23-ERP同步策略与数据导入规范 V1.0.md`
4. `24-API与工具接口设计 V1.0.md`
5. `25-权限与审计规范 V1.0.md`
6. `26-开发任务拆解与里程碑计划 V1.0.md`
7. `27-验收标准与测试方案 V1.0.md`
8. `81-GitHub项目结构规范 V1.0.md`
9. `83-ANOS数据库设计SQL版 V1.0.md`
10. `84-ERP API集成规范 V1.0.md`
11. `85-MCP服务规范 V1.0.md`
12. `87-飞书实施WBS V1.0.md`

下一步应进入：

- 完成 `docs/P0实施准备包/README.md` 中定义的准备包。
- 真实飞书资源盘点。
- P0字段确认会。
- ERP样例数据准备。
- 权限矩阵确认。
- 端到端验收样例确认。
- 第一批飞书多维表格搭建。

## 9. 关键待确认问题

以下事项不能由AI单方面拍板：

- MVP首批上线范围
- 真实飞书空间、表格和权限结构
- ERP同步方式、频率和接口可用性
- 客户信用和供应商风险评分口径
- 报价、付款、账期、毛利等敏感策略
- Agent可自动执行和必须人工确认的边界
- 第一阶段验收负责人和验收口径
- AI Inbox是否作为ANOS Home Page优先上线
- `Supply Resource Base` 的真实字段、来源渠道和验证责任人
- Matching Engine第一版评分口径

## 10. 新AI进入项目的建议动作

新AI或新会话开始时，应按以下步骤执行：

```text
阅读AGENTS.md
↓
阅读本CONTEXT.md
↓
阅读白皮书
↓
阅读当前任务相关专项文档
↓
确认当前任务边界
↓
执行文档、设计或开发任务
↓
输出修改文件、依据、风险和下一步
```

## 11. 协作文件

根目录协作文件：

- `instructions.md`：渐进式披露入口，定义最小阅读路径
- `AGENTS.md`：所有AI的项目总规则
- `CODEX.md`：Codex开发和文件修改规则
- `CLAUDE.md`：Claude分析、文档和评审规则
- `USER.md`：人类协作、决策和验收规则

多AI协作文件：

- `docs/AI_COLLABORATION.md`：多AI分工、交接和冲突处理协议
