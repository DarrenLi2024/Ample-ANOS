# 89-ANOS 测试规范 V1.0

**版本：** V1.0  

---

## 测试分级

| 级别 | 工具 | 覆盖目标 |
|------|------|---------|
| 单元测试 | Vitest | 类型定义 / 权限矩阵 / JWT |
| 集成测试 | Vitest + fetch | 端到端业务链路 |
| E2E测试 | Playwright | Portal页面交互 |

## 测试目录

```
tests/unit/         → 单元测试
tests/integration/  → 集成测试
tests/e2e/          → E2E测试
tests/fixtures/     → 测试数据
```

## 运行命令

```bash
pnpm test           # 全量测试
npx vitest run      # 单元+集成
npx playwright test # E2E
```
