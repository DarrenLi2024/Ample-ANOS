# ADR-003 Agent Network 架构

## 状态
Accepted (2026-06)

## 背景
ANOS需要Agent协作架构。候选: 单体Agent vs Agent Network vs Multi-Agent Platform。

## 决策
采用 Agent Network 架构。每个Agent独立注册、独立权限、通过 MCP 协议通信。

## 决策理由
- 每个Agent可独立演进和部署
- MCP协议提供标准化的工具调用接口
- 避免单体Agent的权限失控

## 影响
- 需维护 Agent Registry (agents/registry.yaml)
- Agent间通信通过 MCP + Workflow Engine
