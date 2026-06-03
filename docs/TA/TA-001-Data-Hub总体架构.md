# TA-001 Data Hub总体架构 V1.0

## ANOS Data Hub Architecture

文档编号：TA-001

文档名称：

Data Hub总体架构

版本：

V1.0.0

状态：

Active

Owner：

LTDC

所属层级：

Technical Architecture

依赖文档：

EA-006 企业数据架构

EA-015 交易智能架构

DA-008 Demand Pool数据模型

DA-009 Supply Pool数据模型

------

# 第一章 文档使命

定义：

Data Hub

企业数据中枢。

------

回答：

```text
数据放哪里

如何扩展

如何检索

如何支撑千万级数据

如何支撑未来AI
```

------

本架构是：

ANOS数据底座。

------

# 第二章 战略目标

Data Hub：

不是数据库。

------

不是ERP。

------

不是飞书多维表格。

------

定义：

```text
Enterprise Data Brain
```

企业数据大脑。

------

# 第三章 核心定位

统一承载：

```text
Demand Pool

Supply Pool

Match Pool

SO

PO

Inventory

AR

AP

Knowledge

Memory
```

------

# 第四章 架构演进路线

Phase1

飞书多维表格

------

Phase2

多维表格

- 

Middleware SQL

------

Phase3

Data Hub

- 

Vector Hub

------

Phase4

Distributed Data Hub

```
---

# 第五章 总体架构

```text
Portal

↓

Query Service

↓

Routing Engine

↓

Data Hub

↓

Storage Layer
```

------

# 第六章 Data Hub逻辑结构

划分：

```text
Demand Domain

Supply Domain

Trading Domain

Finance Domain

Quality Domain

Knowledge Domain

Memory Domain
```

------

# 第七章 Demand Domain

核心表：

```text
Demand Pool

Inquiry Item

Customer
```

------

# 第八章 Supply Domain

核心表：

```text
Supply Pool

Offer Item

Supplier

Source
```

------

# 第九章 Trading Domain

核心表：

```text
Match Candidate

Quote

SO

PO
```

------

# 第十章 Finance Domain

核心表：

```text
AR

AP

Cash Flow

Credit
```

------

# 第十一章 Quality Domain

核心表：

```text
IQC

QCC

Inspection

CAPA
```

------

# 第十二章 Knowledge Domain

核心表：

```text
Knowledge

Document

Prompt

Workflow
```

------

# 第十三章 Memory Domain

核心表：

```text
Customer Memory

Supplier Memory

Source Memory

Trading Memory
```

------

# 第十四章 数据分层

L1：

Hot Data

------

L2：

Warm Data

------

L3：

Cold Data

------

L4：

Archive Data

------

# 第十五章 Hot Data

保存：

最近12个月。

------

特点：

```text
高频访问
```

------

# 第十六章 Warm Data

保存：

1~3年。

------

特点：

```text
中频访问
```

------

# 第十七章 Cold Data

保存：

3年以上。

------

特点：

```text
低频访问
```

------

# 第十八章 Archive Data

长期归档。

------

支持：

```text
审计

追溯

合规
```

------

# 第十九章 主存储

建议：

```text
PostgreSQL
```

------

理由：

```text
成熟

稳定

成本低

生态完善
```

------

# 第二十章 缓存层

建议：

```text
Redis
```

------

缓存：

```text
热门查询

排行榜

Dashboard
```

------

# 第二十一章 向量层

建议：

```text
pgvector
```

Phase2即可。

------

存储：

```text
Knowledge

Memory

Embedding
```

------

# 第二十二章 文件层

存储：

```text
PDF

Excel

图片

邮件
```

------

建议：

```text
MinIO
```

------

# 第二十三章 数据增长模型

Year1：

```text
500万+
```

------

Year3：

```text
3000万+
```

------

Year5：

```text
1亿+
```

------

# 第二十四章 分区策略

Demand Pool：

按月份分区。

------

Supply Pool：

按月份分区。

------

# 第二十五章 路由策略

Portal禁止直接查表。

------

统一：

```text
Portal

↓

Query Service

↓

Routing Engine

↓

Data Hub
```

------

# 第二十六章 数据路由规则

优先：

```text
Hot

↓

Warm

↓

Cold

↓

Archive
```

------

自动选择。

------

# 第二十七章 索引策略

建立：

```text
MPN

Brand

Customer

Supplier

Source

Owner
```

索引。

------

# 第二十八章 数据主权

数据属于：

安芯易组织。

------

不是：

ERP。

------

不是：

飞书。

------

不是：

个人。

```
---

# 第二十九章 Data Hub成熟度

L1

多维表格

---

L2

SQL

---

L3

Data Hub

---

L4

Distributed Hub

---

L5

Enterprise Brain
```

------

# 第三十章 Data Hub金律

1. 数据属于组织
2. Data Hub高于ERP
3. Portal不得直接查表
4. 所有查询必须经过Routing
5. 所有数据必须可追溯
6. 所有数据必须支持扩展
7. 所有数据必须支持千万级增长
8. 所有数据必须支持AI
9. 所有数据必须支持记忆沉淀
10. Data Hub是ANOS核心底座