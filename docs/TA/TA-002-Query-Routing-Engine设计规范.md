# TA-002 Query Routing Engine设计规范 V1.0

## ANOS Query Routing Engine Architecture

文档编号：TA-002

文档名称：

Query Routing Engine设计规范

版本：

V1.0.0

状态：

Active

Owner：

LTDC

所属层级：

Technical Architecture

依赖文档：

TA-001 Data Hub总体架构

DA-008 Demand Pool数据模型

DA-009 Supply Pool数据模型

------

# 第一章 文档使命

定义：

Query Routing Engine

查询路由引擎。

------

回答：

```text
查询去哪张表

查询去哪台服务器

查询优先查哪里

如何支撑千万级数据
```

------

本系统是：

ANOS数据交通调度中心。

------

# 第二章 核心定位

Portal：

不得直接查表。

------

Agent：

不得直接查表。

------

Workflow：

不得直接查表。

------

统一：

```text
Portal

↓

Query API

↓

Routing Engine

↓

Data Hub
```

------

# 第三章 战略价值

解决：

```text
大表性能问题

冷热数据问题

历史归档问题

扩展问题
```

------

# 第四章 总体架构

```text
Portal

↓

Agent

↓

Workflow

↓

Query Service

↓

Routing Engine

↓

Hot Data

Warm Data

Cold Data

Archive Data
```

------

# 第五章 Routing原则

原则：

```text
最快优先

最近优先

最小成本优先
```

------

# 第六章 查询分类

统一划分：

```text
Realtime Query

Operational Query

Analytical Query

Historical Query
```

------

# 第七章 Realtime Query

场景：

```text
Portal首页

AI匹配

Dashboard
```

------

要求：

```text
<1秒
```

------

# 第八章 Operational Query

场景：

```text
销售查询

采购查询

财务查询
```

------

要求：

```text
<3秒
```

------

# 第九章 Analytical Query

场景：

```text
BI

统计

趋势分析
```

------

要求：

```text
<30秒
```

------

# 第十章 Historical Query

场景：

```text
历史追溯

审计

归档查询
```

------

允许：

分钟级。

------

# 第十一章 数据分层

L1：

Hot

------

L2：

Warm

------

L3：

Cold

------

L4：

Archive

------

# 第十二章 Hot Data路由

优先查询：

最近12个月。

------

来源：

```text
Demand Pool Current

Supply Pool Current
```

------

# 第十三章 Warm Data路由

查询：

1~3年数据。

------

自动切换。

------

# 第十四章 Cold Data路由

查询：

3年以上数据。

------

仅：

按需访问。

------

# 第十五章 Archive路由

审计查询。

------

默认：

不参与实时查询。

------

# 第十六章 Demand Pool路由

逻辑：

```text
Demand Pool

↓

Month Partition

↓

Shard
```

------

# 第十七章 Supply Pool路由

逻辑：

```text
Supply Pool

↓

Month Partition

↓

Shard
```

------

# 第十八章 Brand Routing

建立：

Brand Index。

------

例如：

```text
TI

ADI

ST

NXP
```

------

快速定位。

------

# 第十九章 MPN Routing

建立：

MPN Index。

------

支持：

```text
Exact Match

Fuzzy Match
```

------

# 第二十章 Owner Routing

支持：

```text
Sales Owner

Buyer Owner
```

快速查询。

------

# 第二十一章 Customer Routing

建立：

Customer Index。

------

支持：

Customer 360。

------

# 第二十二章 Supplier Routing

建立：

Supplier Index。

------

支持：

Supplier 360。

------

# 第二十三章 Match Routing

Match Engine：

优先：

Hot Data。

------

必要时：

跨层查询。

------

# 第二十四章 Cache Layer

引入：

Redis。

------

缓存：

```text
热门型号

热门客户

热门供应商

排行榜
```

------

# 第二十五章 Query Cache

建立：

```text
Query Result Cache
```

------

TTL：

可配置。

------

# 第二十六章 Query Priority

优先级：

P1：

Portal

------

P2：

Match Engine

------

P3：

Workflow

------

P4：

BI

------

# 第二十七章 Read Replica

支持：

读写分离。

------

写：

Primary DB

------

读：

Replica DB

------

# 第二十八章 查询审计

记录：

```text
User

Role

Query

Time

Duration
```

------

# 第二十九章 Query KPI

监控：

```text
P95 Response Time

P99 Response Time

Cache Hit Rate

Route Accuracy

DB Load
```

------

# 第三十章 Routing Engine金律

1. Portal不得直接查表
2. Agent不得直接查表
3. Workflow不得直接查表
4. 所有查询必须经过Routing
5. Hot Data优先
6. Cache优先
7. 查询必须可审计
8. 查询必须可扩展
9. 支持亿级数据增长
10. Routing Engine是Data Hub的交通中枢