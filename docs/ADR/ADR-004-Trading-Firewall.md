# ADR-004 Trading Firewall 交易信息防火墙

## 状态
Accepted (2026-06)

## 背景
电子元器件贸易行业核心规则: 销售不能直通供应商，采购不能直通客户。

## 决策
实施 Trading Firewall: Customer↔Sales / Supplier↔Buyer 严格隔离。Opportunity作为共享中间层。

## 决策理由
- 保护企业核心商业信息
- 符合行业惯例
- 参见 GA-010/GA-011

## 影响
- Portal需按角色做字段级脱敏
- Agent需按角色限制权限边界
- Workflow方向约束(Inquiry Sales→Buyer, Offer Buyer→Sales)
