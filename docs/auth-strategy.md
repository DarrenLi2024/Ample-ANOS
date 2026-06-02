# ANOS 认证策略 V1.0

**状态:** 方案设计  
**版本:** 2026-06-02

---

## 整体架构

```
┌──────────────┐     OAuth 2.0      ┌──────────────┐
│  ANOS Portal  │ ◄──────────────► │  飞书 SSO     │
│  (Next.js)    │                   │  (Feishu)     │
└──────┬───────┘                   └──────────────┘
       │ JWT Token (自签发)
       ▼
┌──────────────┐
│  ANOS API     │
│  (Hono)       │
│  JWT 验证中间件│
└──────────────┘
```

## 认证流程

```
1. 用户访问 Portal → 未登录 → 重定向飞书 OAuth
2. 飞书验证身份 → 回调 /api/auth/callback
3. API 接收飞书 User Info:
   {
     user_id: "ou_xxx",        // 飞书用户唯一ID
     name: "张三",
     department: ["销售部"],
     job_title: "销售经理"
   }
4. 部门→角色映射:
   "销售部"     → Sales
   "采购部"     → Procurement
   "财务部"     → Risk
   "管理层/CEO" → CEO

5. 签发 JWT Token:
   {
     sub: "ou_xxx",
     name: "张三",
     role: "Sales",
     department: "销售部",
     iat: 1700000000,
     exp: 1700086400  // 24小时后过期
   }

6. 后续所有 API 请求:
   Authorization: Bearer <JWT Token>
```

## 部门→角色映射表 (需人类确认)

| 飞书部门 | ANOS 角色 | 权限范围 |
|---------|----------|---------|
| 销售部 / 业务部 | `Sales` | Customer, Inquiry, Offer |
| 采购部 / 供应链 | `Procurement` | Supplier, SupplyResource |
| 财务部 / 风控 | `Risk` | AR, Credit, RiskCase |
| 管理层 / CEO | `CEO` | 全部聚合视图 |
| 运营 / IT | `Operations` | Workflow, Agent管理 |
| 系统管理员 | `SystemAdmin` | 全部 |

## 开发环境的角色切换

在飞书 SSO 接入前，开发/测试环境使用 JWT 模拟:

```bash
# 生成测试 Token (开发用)
curl -X POST http://localhost:3001/api/auth/dev-token \
  -H "Content-Type: application/json" \
  -d '{"role": "Sales", "name": "测试销售"}'

# 返回 JWT Token，后续请求携带:
curl http://localhost:3001/api/customers \
  -H "Authorization: Bearer <token>"
```

## 待确认事项

1. 飞书部门名称是否与上表一致？
2. 是否允许一人多角色？（如既是销售又是风控）
3. CEO 角色是否需要飞书审批？
4. 飞书 OAuth 应用的 Redirect URI 是什么？
