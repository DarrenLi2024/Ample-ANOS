# 81-GitHub项目结构规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** GitHub仓库结构 / 多AI协作工程规范  
**上游文档：** [AGENTS.md](../AGENTS.md)、[CODEX.md](../CODEX.md)  
**版本：** V1.0  
**状态：** 工程化基线

---

# 第1章 仓库定位

GitHub仓库是ANOS项目的Single Source of Truth。

飞书可作为协作与实施平台，但正式文档、代码、任务拆解、接口契约、测试方案应在GitHub中沉淀。

# 第2章 推荐目录结构

```text
/
├── AGENTS.md
├── CODEX.md
├── CLAUDE.md
├── README.md
├── docs/
├── apps/
│   └── portal/
├── packages/
│   ├── shared/
│   ├── api-client/
│   └── agent-tools/
├── services/
│   ├── api/
│   ├── sync/
│   └── mcp/
├── scripts/
│   ├── import/
│   └── validate/
├── tests/
│   ├── fixtures/
│   ├── unit/
│   └── e2e/
└── infra/
```

# 第3章 docs目录规范

文档编号：

- 00-09：战略、范围、MVP、需求流程。
- 10-19：Portal、Agent、Workflow产品设计。
- 20-29：数据、ERP、API、权限、验收。
- 30-39：技术架构。
- 40-49：业务架构、Agent OS、治理。
- 70-79：飞书实施。
- 80-89：工程开发、API、MCP、数据库。

# 第4章 分支规范

默认分支：

```text
main
```

Codex分支前缀：

```text
codex/
```

建议：

- `codex/docs-p0`
- `codex/portal-mvp`
- `codex/erp-sync`
- `codex/mcp-tools`

# 第5章 提交规范

提交信息格式：

```text
type(scope): summary
```

类型：

- docs
- feat
- fix
- refactor
- test
- chore

示例：

```text
docs(p0): add MVP scope and workflow specs
feat(sync): add ERP customer import
```

# 第6章 多AI协作规范

每个AI工作前必须：

- 阅读AGENTS.md。
- 阅读docs/CONTEXT.md。
- 查看git status。
- 不覆盖未理解的修改。

交接必须说明：

- 修改了什么。
- 依据哪些文档。
- 如何验证。
- 剩余风险。

# 第7章 Issue规范

Issue模板字段：

- 背景
- 目标
- 范围内
- 范围外
- 上游文档
- 验收标准
- 风险

# 第8章 PR规范

PR必须包含：

- 变更摘要。
- 修改文件。
- 验证结果。
- 截图或日志。
- 是否影响权限/数据/接口。

# 第9章 禁止事项

禁止：

- 将真实敏感数据提交到仓库。
- 提交密钥、Token、Cookie。
- 在未确认前删除历史文档。
- 跳过文档直接开发核心业务逻辑。
- 将AI输出作为无审计事实写入生产数据。

