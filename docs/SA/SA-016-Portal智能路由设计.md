# SA-016 ANOS Portal 智能路由设计 V1.0

**document_id:** SA-016 | **version:** V1.0.0

## 飞书 USER ID → 角色 → Portal 路由

```text
USER ID → 查询角色映射表 → 确定默认工作台
  sales*   → Sales Portal   → /inquiries
  buyer*   → Procurement Portal → / (供应资源池+可匹配需求)
  finance* → Risk Portal     → /risk
  ceo*     → CEO Portal      → /ceo-dashboard
```

## 部门主管路由

- Sales Manager: Sales Portal + 部门聚合视图
- Procurement Manager: Procurement Portal + 部门聚合视图
