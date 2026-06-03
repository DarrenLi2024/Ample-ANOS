# ADR-002 SQLite 用作 MVP 数据库

## 状态
Accepted (2026-06)

## 背景
MVP阶段需要数据存储方案。候选: SQLite vs PostgreSQL vs 飞书多维表格独用。

## 决策
MVP采用 SQLite+飞书多维表格双通道。SQLite 作为本地开发/单机部署，飞书多维表格作为协作/共享存储。

## 决策理由
- SQLite零配置，适合快速迭代
- 飞书多维表格提供协作能力
- 250并发场景下需迁移到 PostgreSQL (Phase 2)

## 影响
- 单机写入性能受限 (SQLITE_BUSY)
- 需制定 PostgreSQL 迁移路径 (ADR-007)
