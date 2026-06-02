# P0 跟进事项清单

**生成日期:** 2026-06-02  
**来源:** P0确认报告 (22项决策)

---

## ✅ 已确认 (17项)

所有推荐方案已确认，代码和文档已对齐：

| 领域 | 已确认项 |
|------|---------|
| P0范围 | Trading Intelligence OS为唯一主线、AI Inbox首页、SO增强项、8张P0表 |
| 数据 | Unique Key标准(Brand+MPN/CustomerID+名称)、Excel导入优先 |
| Agent | 禁止自动发送报价/创建PO/冻结信用 |
| 上线 | 试点5人(sales×2+proc×2+risk×1)、2-4周试运行、27验收标准 |
| 飞书 | ANOS Data Hub空间、全部新建表 |
| 认证 | Phase1 JWT + Phase2 飞书SSO、部门→角色映射已确认 |

## 🔴 需要跟进 (4项)

### F1: Match Score 权重调整
- **负责人:** 销售负责人 + 采购负责人
- **截止:** 试运行前
- **当前代码:** 默认权重 (型号40/库存20/价格15/交期15/风险10) 已实现在 `scripts/import/match-score.ts`
- **待确认:** 业务侧确认实际权重分配

### F2: ERP API 接口对接
- **负责人:** 数据负责人 / ERP接口人
- **截止:** Phase 2
- **当前状态:** 先使用种子演示数据 + Excel导入模式
- **代码就绪:** `scripts/import/erp-import.ts` 支持 CSV→SQLite 三种导入

### F3: 知识源 URL 补充
- **负责人:** 销售/采购/风控部门负责人
- **截止:** 试运行前
- **待补充:** 销售SOP URL、采购SOP URL、风控/回款规则 URL
- **用途:** Phase 2 对接飞书知识库，给Agent提供上下文

### F4: 多角色支持
- **负责人:** 开发
- **截止:** Phase 2
- **需求:** 飞书 SSO 接入后，用户可能在多个部门，需支持角色切换
- **当前代码:** JWT payload已支持单角色，Phase 2扩展为多角色数组

---

## 🟢 无需跟进 (已处理)

### 权限矩阵 5项 (3.1-3.5)
报告标注了5个权限项"需要跟进讨论"，但选择的答案与推荐方案完全一致（全部选 NO），无需额外跟进。当前代码权限矩阵已正确实现：

| 权限规则 | 代码状态 |
|---------|---------|
| 销售不能看供应商名称 | ✅ `permission.ts` RedactedAsId |
| 采购不能看客户名称 | ✅ `permission.ts` RedactedAsId |
| Sales Agent不自动发报价 | ✅ Agent输出 requiresApproval=true |
| Credit Agent不自动冻结信用 | ✅ Agent输出 requiresApproval=true |
| 风控不能看采购成本 | ✅ `permission.ts` Hidden |

### ERP 样例数据 (4.1)
选 "use-demo" — 使用种子演示数据。当前数据库已有:
- 10 customers + 10 suppliers + 51 products + 20 RFQ + 20 supply resources + 10 AR

---

## 📊 试运行就绪检查

| 检查项 | 状态 |
|--------|------|
| P0决策全部确认 | ✅ 17/22 |
| 后端API完成 | ✅ 11 routes + JWT + 12 middleware |
| Portal页面完成 | ✅ 10 pages + 3 error boundaries |
| 数据库就绪 | ✅ 10 tables + 23 indexes + 种子数据 |
| 试点用户配置 | ✅ 7 users (sales×2, proc×2, risk, ceo, admin) |
| CI/CD就绪 | ✅ GitHub Actions |
| Docker部署就绪 | ✅ Dockerfile + docker-compose |
| 权限矩阵实现 | ✅ FIELD_PERMISSION_MATRIX |
| 验收标准定义 | ✅ 27-验收标准 |

**试运行阻塞项:** 仅 F3(知识源URL) — 非代码阻塞，可在试运行中补充
