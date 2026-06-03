# 88-ANOS 开发规范 V1.0

**版本：** V1.0  

---

## 目录规范

```
apps/portal/        → Next.js Portal 前端
packages/shared/    → 共享类型和常量
services/api/       → Hono API 服务
services/mcp/       → MCP 工具服务
scripts/            → 脚本（导入/迁移/飞书）
tests/              → 测试
docs/               → 项目文档
```

## 命名规范

| 场景 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `customer-360/page.tsx` |
| 组件名 | PascalCase | `AgentSuggestionCard` |
| API路由 | kebab-case | `/api/supply-resources` |
| 数据库表 | snake_case | `ar_items` |
| TypeScript类型 | PascalCase | `InquiryStatus` |
| 常量 | UPPER_SNAKE | `FIELD_PERMISSION_MATRIX` |

## 组件规范

- 每个组件一个文件，150行以内
- 使用 `'use client'` 标记客户端组件
- Props 使用 interface 定义
- 导出使用 named export

## 日志规范

- 使用 `console.error` 记录异常
- 生产环境禁止 `console.log`
- 使用 auditLogMiddleware 记录业务操作
