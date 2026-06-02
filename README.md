# ANOS — Ample AI Native OS

**安芯易集团企业级 AI 原生操作系统**

## 项目定位

ANOS 不是传统 ERP 的替代品，而是面向 AI 时代的企业智能操作系统。第一阶段聚焦 Trading Intelligence OS，通过 Portal + Data Hub + Agent Network + Workflow 把分散的业务信息转化为可复用的数据、知识、智能和行动。

## 核心链路

```
Information → Knowledge → Intelligence → Action
```

## 技术栈

- **前端:** Next.js 14+ / React 18 / Tailwind CSS 4 / shadcn/ui
- **后端:** TypeScript / Hono / SQLite (开发) / PostgreSQL (生产)
- **Agent:** MCP 协议 / Agent 工具注册
- **集成:** ERP API / 金蝶 API / 飞书 API
- **测试:** Vitest / Playwright

## 项目结构

```
├── apps/portal/          # Portal 前端应用 (Next.js)
├── packages/
│   ├── shared/           # 共享类型、常量、工具函数
│   ├── api-client/       # API 客户端 SDK
│   └── agent-tools/      # Agent 工具集
├── services/
│   ├── api/              # API 服务 (Hono)
│   ├── sync/             # ERP 数据同步服务
│   └── mcp/              # MCP 服务
├── scripts/              # 导入、校验、迁移脚本
├── tests/                # 测试目录
├── infra/                # 基础设施配置
└── docs/                 # 项目文档
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发环境
pnpm dev

# 运行测试
pnpm test
```

## 文档索引

所有项目文档见 [docs/](./docs/) 目录。新成员进入项目请先阅读：

1. [AGENTS.md](./AGENTS.md) — AI 协作总则
2. [docs/CONTEXT.md](./docs/CONTEXT.md) — 项目上下文入口
3. [docs/00-ANOS总体架构设计白皮书V1.0.md](./docs/00-ANOS总体架构设计白皮书V1.0.md) — 总体架构

## 当前阶段

飞书实施与工程落地准备 → Sprint 0 工程基础设施搭建

## 许可证

Private — 安芯易集团内部项目
