# ANOS Instructions

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** 渐进式披露入口 / 新会话最小阅读说明  
**适用对象：** 所有AI助手与人类协作者  
**版本：** V1.0  
**状态：** 协作入口基线

---

## 1. 最小规则

进入本项目后，先遵守三条规则：

1. 全程使用中文。
2. 先读上下文，再动文件。
3. 不擅自覆盖、删除或写入真实生产系统。

## 2. 阅读顺序

不要一开始读取所有文档。

按任务类型渐进式读取。

## 3. 所有任务都先读

1. `AGENTS.md`
2. `docs/CONTEXT.md`

如果涉及人类决策、验收或敏感规则，再读：

3. `USER.md`

如果涉及多个AI协作或交接，再读：

4. `docs/AI_COLLABORATION.md`

## 4. 文档任务读取

文档整理、架构、需求、流程任务优先读：

- `docs/00-ANOS总体架构设计白皮书V1.0.md`
- `docs/01-ANOS项目范围与MVP定义 V1.0.md`
- `docs/02-ANOS业务流程与用户故事 V1.0.md`

涉及数据再读：

- `docs/20-ANOS企业数据字典V1.0.md`
- `docs/21-ERP字段映射方案V1.0.md`
- `docs/42-ANOS数据中台建表蓝图 V1.0.md`

涉及飞书实施再读：

- `docs/70-飞书生态实施手册总纲 V1.0.md`
- `docs/72-飞书多维表格实施手册 V1.0.md`
- `docs/73-飞书工作流实施手册 V1.0.md`
- `docs/75-飞书Portal实施手册 V1.0.md`
- `docs/87-飞书实施WBS V1.0.md`

涉及Portal UI、界面原型或前端实现再读：

- `docs/Portal界面渲染图/README.md`
- `docs/Portal界面渲染图/Portal UI Reference V1.0.md`
- `docs/43-ANOS Portal 页面原型规范 V1.0.md`
- `docs/76-统一智能入口AI Inbox设计规范 V1.0.md`

## 5. 开发任务读取

工程开发、脚本、API、MCP任务优先读：

- `CODEX.md`
- `docs/24-API与工具接口设计 V1.0.md`
- `docs/26-开发任务拆解与里程碑计划 V1.0.md`
- `docs/27-验收标准与测试方案 V1.0.md`
- `docs/81-GitHub项目结构规范 V1.0.md`

涉及ERP再读：

- `docs/23-ERP同步策略与数据导入规范 V1.0.md`
- `docs/84-ERP API集成规范 V1.0.md`

涉及数据库再读：

- `docs/83-ANOS数据库设计SQL版 V1.0.md`

涉及Agent工具再读：

- `docs/45-Agent操作系统规范 V1.0.md`
- `docs/85-MCP服务规范 V1.0.md`

## 6. 权限与安全任务读取

涉及权限、审计、敏感数据、Agent动作边界时，必须读：

- `docs/25-权限与审计规范 V1.0.md`
- `docs/46-ANOS组织智能治理框架 V1.0.md`
- `USER.md`

## 7. 当前项目阶段

当前阶段：

```text
飞书实施与工程落地准备
```

下一步重点：

- 真实飞书资源盘点。
- P0字段确认。
- ERP样例数据准备。
- 权限矩阵确认。
- 第一批飞书多维表格搭建。

## 8. 输出要求

完成任务后必须说明：

- 修改了哪些文件。
- 依据哪些文档。
- 做了哪些验证。
- 还有哪些待确认事项。
