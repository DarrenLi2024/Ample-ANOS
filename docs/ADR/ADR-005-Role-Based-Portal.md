# ADR-005 Role-Based Portal 角色驱动Portal

## 状态
Accepted (2026-06)

## 背景
Portal需要为不同角色呈现不同视图。候选: 统一Portal vs Role-Based Portal vs 多独立Portal。

## 决策
采用 Role-Based Portal: 单系统多视图。同一URL根据角色自动切换可见内容和脱敏级别。

## 决策理由
- 降低维护成本(单一代码库)
- 用户体验一致
- 参见 GA-011 角色权限矩阵

## 影响
- RoleAwareField 组件需全局使用
- API需按角色过滤返回字段
