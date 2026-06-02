# ANOS — Ample AI Native OS

**安芯易集团企业级 AI 原生操作系统**

第一阶段聚焦 Trading Intelligence OS：Portal + Data Hub + Agent Network + Workflow

## 核心链路

```
Information → Knowledge → Intelligence → Action
```

## 技术栈

| 层 | 技术 |
|---|------|
| Portal | Next.js 15 / React 19 / Tailwind CSS 4 / Lucide Icons |
| API | Hono 4 / Drizzle ORM / SQLite / Zod |
| Auth | JWT (Phase 1) → 飞书 SSO (Phase 2) |
| MCP | @modelcontextprotocol/sdk |
| DevOps | Docker / GitHub Actions / pnpm + turborepo |

## 快速开始

```bash
# 一键启动 (安装依赖 + 建库 + 种子数据 + 启动)
bash scripts/dev-setup.sh

# 或分步操作:
pnpm install
cd services/api && npx tsx src/db/migrate.ts && npx tsx src/db/seed.ts && npx tsx src/db/seed-extended.ts && cd ../..
pnpm dev
```

启动后:
- **Portal:** http://localhost:3000
- **API:** http://localhost:3001
- **Health:** http://localhost:3001/health

## 获取 Token

```bash
# 开发环境签发 JWT
curl -X POST http://localhost:3001/api/auth/dev-token \
  -H "Content-Type: application/json" \
  -d '{"role": "SystemAdmin", "name": "Admin"}'

# 登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "anos2026"}'
```

## 项目结构

```
├── apps/portal/             # Portal 前端 (Next.js)
├── packages/shared/         # 共享类型定义
├── services/api/            # API 服务 (Hono)
│   └── src/
│       ├── db/              # Schema + 迁移 + 种子
│       ├── routes/          # 10 组 REST API
│       ├── middleware/       # JWT/CSRF/RateLimit/Security
│       └── schemas/         # Zod 校验
├── services/mcp/            # MCP Agent 工具
├── scripts/                 # 开发脚本 + ERP 导入
├── tests/                   # 单元测试
└── docs/                    # 30+ 项目文档
```

## P0 演示用户

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | anos2026 | 系统管理员 |
| sales1 | anos2026 | 销售 |
| sales2   | anos2026 | 销售 |
| proc2    | anos2026 | 采购 |
| proc1 | anos2026 | 采购 |
| risk1 | anos2026 | 风控 |
| ceo | anos2026 | 管理层 |

## Docker 部署

```bash
docker compose up -d
```

## CI/CD

推送到 main 分支自动运行: TypeCheck → DB迁移 → API健康检查 → Portal构建 → Docker镜像

## 文档

- [AGENTS.md](./AGENTS.md) — AI 协作总则
- [docs/CONTEXT.md](./docs/CONTEXT.md) — 项目上下文
- [docs/design.md](./docs/design.md) — UI 设计规范
- [docs/auth-strategy.md](./docs/auth-strategy.md) — 认证策略
- [docs/P0-confirmation-form.html](./docs/P0-confirmation-form.html) — P0 确认表单
