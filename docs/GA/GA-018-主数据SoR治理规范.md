# GA-018 主数据权威源（SoR）治理规范 V1.0

## System of Record Governance Standard

文档编号：GA-018

文档名称：

主数据权威源（SoR）治理规范

版本：

V1.0.0

状态：

Active

责任部门：

LTDC

所属层级：

Governance Architecture

依赖文档：

EA-006 企业数据架构

TA-001 数据中枢总体架构

GA-017 交易防火墙治理规范

------

# 第一章 文档使命

定义：

System of Record（SoR）

主数据权威源。

------

回答：

什么数据是真实数据。

什么系统拥有数据。

什么系统消费数据。

什么系统展示数据。

------

本规范是：

ANOS数据治理最高规范之一。

------

# 第二章 核心问题

企业数字化最大的风险：

不是没有数据。

而是：

多个真相。

------

例如：

```text
ERP显示库存100

Portal显示库存120

多维表格显示库存90
```

------

最终：

没人知道哪个是真的。

------

# 第三章 SoR定义

System of Record：

权威数据源。

------

定义：

某类数据唯一可信来源。

------

原则：

```text
一个对象

只能有一个SoR
```

------

# 第四章 核心原则

原则一：

唯一真相源

Single Source of Truth

------

原则二：

数据拥有权唯一

------

原则三：

展示系统不是SoR

------

原则四：

Agent不是SoR

------

原则五：

Portal不是SoR

------

# 第五章 ANOS总体原则

ANOS定义：

```text
Data Hub
=
唯一企业数据主系统
```

------

# 第六章 系统角色划分

Data Hub：

数据拥有者

------

Portal：

数据展示者

------

Agent：

数据消费者

------

Workflow：

数据处理者

------

ERP：

执行系统

------

飞书多维表格：

业务录入界面

------

# 第七章 Inquiry SoR

对象：

Inquiry

------

SoR：

Demand Pool

------

位置：

Data Hub

------

禁止：

ERP拥有Inquiry。

------

# 第八章 Offer SoR

对象：

Offer

------

SoR：

Supply Pool

------

位置：

Data Hub

------

# 第九章 Match SoR

对象：

Match Candidate

------

SoR：

Match Pool

------

位置：

Data Hub

------

# 第十章 Customer SoR

对象：

Customer

------

SoR：

Customer Master

------

位置：

Data Hub

------

# 第十一章 Supplier SoR

对象：

Supplier

------

SoR：

Supplier Master

------

位置：

Data Hub

------

# 第十二章 Source SoR

对象：

Source

------

SoR：

Source Master

------

位置：

Data Hub

------

# 第十三章 SO SoR

对象：

Sales Order

------

SoR：

SO Domain

------

位置：

Data Hub

------

ERP同步消费。

------

# 第十四章 PO SoR

对象：

Purchase Order

------

SoR：

PO Domain

------

位置：

Data Hub

------

ERP同步消费。

------

# 第十五章 Inventory SoR

对象：

Inventory

------

Phase1：

ERP SoR

------

Phase2：

Inventory Hub SoR

------

ERP降级为执行系统。

------

# 第十六章 AR SoR

对象：

应收账款

------

Phase1：

ERP SoR

------

Phase2：

AR Hub SoR

------

# 第十七章 AP SoR

对象：

应付账款

------

Phase1：

ERP SoR

------

Phase2：

AP Hub SoR

------

# 第十八章 Knowledge SoR

对象：

组织知识

------

SoR：

Knowledge Hub

------

# 第十九章 Memory SoR

对象：

组织记忆

------

SoR：

Memory Hub

------

# 第二十章 Agent SoR

对象：

Agent配置

------

SoR：

Agent Registry

------

# 第二十一章 Prompt SoR

对象：

Prompt

------

SoR：

Prompt Registry

------

# 第二十二章 Workflow SoR

对象：

Workflow

------

SoR：

Workflow Registry

------

# 第二十三章 Portal原则

Portal：

不是数据源。

------

Portal：

永远不保存主数据。

------

# 第二十四章 多维表格原则

多维表格：

不是最终数据源。

------

Phase1：

录入与协作工具。

------

Phase2：

逐步收敛。

------

# 第二十五章 ERP原则

ERP：

不是企业数据拥有者。

------

ERP：

执行系统。

------

定义：

```text
ERP is Data Consumer
```

------

# 第二十六章 Agent原则

Agent：

只读或授权写入。

------

禁止：

私有数据库。

------

# 第二十七章 数据同步原则

任何同步：

必须：

```text
SoR → Consumer
```

------

禁止：

反向覆盖。

------

# 第二十八章 数据冲突原则

发现冲突：

以SoR为准。

------

自动记录：

Conflict Event。

------

# 第二十九章 数据血缘

所有数据：

记录：

```text
来源

处理链路

更新时间

责任人
```

------

形成：

Data Lineage。

------

# 第三十章 数据版本

关键对象：

支持：

```text
Version

Change Log
```

------

# 第三十一章 主数据治理委员会

建议成立：

MDGC

Master Data Governance Committee

------

成员：

LTDC

财务

销售

采购

IT

------

# 第三十二章 数据审计

记录：

```text
创建

修改

删除

同步
```

------

# 第三十三章 数据生命周期

统一：

```text
Create

Update

Archive

Retire
```

------

# 第三十四章 数据质量指标

监控：

```text
完整率

准确率

一致率

重复率
```

------

# 第三十五章 SoR成熟度

L1

Excel

------

L2

ERP

------

L3

多系统

------

L4

Data Hub

------

L5

Enterprise Brain

------

# 第三十六章 ANOS未来路线

Phase1：

```text
多维表格
+
ERP
```

------

Phase2：

```text
Data Hub
+
ERP
```

------

Phase3：

```text
ANOS Core
+
ERP Adapter
```

------

Phase4：

```text
ANOS Native Enterprise
```

------

# 第三十七章 数据主权原则

数据属于：

安芯易组织。

------

不属于：

员工

ERP

飞书

Agent

供应商

客户

------

# 第三十八章 AI Native原则

AI必须读取：

SoR数据。

------

禁止：

影子数据库。

------

# 第三十九章 SoR与交易智能

Demand Pool

Supply Pool

Match Pool

Memory Hub

Knowledge Hub

共同构成：

企业智能资产。

------

# 第四十章 SoR金律

1. 一个对象只有一个SoR
2. Data Hub是企业主数据中心
3. Portal不是SoR
4. Agent不是SoR
5. ERP不是数据拥有者
6. 多维表格不是最终SoR
7. 所有同步必须以SoR为准
8. 所有冲突必须可追溯
9. 数据属于组织
10. SoR高于所有应用系统