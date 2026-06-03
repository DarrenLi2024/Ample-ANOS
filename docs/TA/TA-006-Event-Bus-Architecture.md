# TA-006 Event Bus Architecture V1.0

## ANOS Event Bus Architecture

文档编号：TA-006

文档名称：

事件总线架构

版本：

V1.0.0

状态：

Active

Owner：

LTDC

所属层级：

Technical Architecture

依赖文档：

TA-001 Data Hub

TA-004 Agent Runtime

TA-005 Memory Hub

SA-016 Match Engine

------

# 第一章 文档使命

定义：

Event Bus

事件总线。

------

回答：

```text
系统如何通信

Agent如何协同

Workflow如何触发

Memory如何自动沉淀

如何避免强耦合
```

------

本系统是：

ANOS神经系统。

------

# 第二章 核心定义

ANOS采用：

```text
Event Driven Architecture
EDA
```

事件驱动架构。

------

核心原则：

```text
事件优于调用
```

------

# 第三章 Event定义

Event：

表示：

```text
某件事情已经发生
```

------

例如：

```text
Inquiry Parsed

Offer Parsed

Match Found

Quote Created

SO Created
```

------

# 第四章 Event Bus定位

Event Bus：

不是消息队列。

------

不仅仅是：

```text
Message Queue
```

------

而是：

```text
Enterprise Event Backbone
```

企业事件骨干网络。

------

# 第五章 总体架构

```text
Portal

↓

Agent Runtime

↓

Event Bus

↓

Consumers

↓

Data Hub

Memory Hub

Workflow
```

------

# 第六章 Event组成

统一结构：

```text
Event ID

Event Type

Source

Payload

Timestamp

Version
```

------

# 第七章 Event ID

格式：

```text
EVT-YYYYMMDD-XXXXXX
```

------

全局唯一。

------

# 第八章 Event Type

统一分类：

```text
Business Event

System Event

Agent Event

Workflow Event

Memory Event
```

------

# 第九章 Business Event

例如：

```text
Inquiry Created

Offer Created

Quote Created

SO Created

PO Created
```

------

# 第十章 Agent Event

例如：

```text
Agent Started

Agent Finished

Agent Failed

Memory Updated
```

------

# 第十一章 Workflow Event

例如：

```text
Workflow Started

Workflow Approved

Workflow Rejected
```

------

# 第十二章 Memory Event

例如：

```text
Memory Created

Memory Updated

Memory Archived
```

------

# 第十三章 Event Publisher

事件发布者：

```text
Portal

Agent

Workflow

Data Hub
```

------

# 第十四章 Event Consumer

事件消费者：

```text
Match Agent

Memory Agent

Knowledge Agent

Dashboard

Workflow Engine
```

------

# 第十五章 Inquiry事件

标准事件：

```text
Inquiry Created

Inquiry Parsed

Inquiry Updated

Inquiry Closed
```

------

# 第十六章 Offer事件

标准事件：

```text
Offer Created

Offer Parsed

Offer Updated

Offer Closed
```

------

# 第十七章 Match事件

标准事件：

```text
Match Found

Match Verified

Match Rejected

Match Converted
```

------

# 第十八章 SO事件

标准事件：

```text
SO Created

SO Approved

SO Delivered

SO Closed
```

------

# 第十九章 PO事件

标准事件：

```text
PO Created

PO Approved

PO Received

PO Closed
```

------

# 第二十章 AR事件

标准事件：

```text
Invoice Created

Payment Received

AR Overdue

AR Escalated
```

------

# 第二十一章 Memory事件

标准事件：

```text
Memory Created

Memory Merged

Memory Updated
```

------

# 第二十二章 Event Topic

统一：

```text
inquiry.*

offer.*

match.*

so.*

po.*

ar.*

memory.*

agent.*
```

------

# 第二十三章 Event Payload

示例：

```json
{
  "eventType":"InquiryParsed",
  "inqId":"INQ-20260603-001",
  "owner":"sales001",
  "score":92
}
```

------

# 第二十四章 Event Version

支持：

```text
V1

V2

V3
```

------

兼容升级。

------

# 第二十五章 Event Ordering

关键事件：

必须保证顺序。

------

例如：

```text
SO Created

↓

SO Approved

↓

SO Closed
```

------

# 第二十六章 Event Replay

支持：

```text
Replay
```

------

允许：

重新执行历史事件。

------

# 第二十七章 Event Store

保存：

所有事件。

------

形成：

```text
Event Log
```

------

# 第二十八章 Event Sourcing

重要业务支持：

```text
Event Sourcing
```

------

例如：

```text
AR

AP

Inventory
```

------

# 第二十九章 Event Retention

保留：

```text
7年
```

------

支持：

审计。

------

# 第三十章 Agent Bus

所有Agent通信：

统一：

```text
Agent Runtime

↓

Event Bus
```

------

禁止：

Agent直接调用Agent。

------

# 第三十一章 Workflow触发

Workflow：

订阅事件。

------

例如：

```text
AR Overdue

↓

催收流程启动
```

------

# 第三十二章 Match触发

事件：

```text
Inquiry Parsed
```

------

自动触发：

```text
Match Agent
```

------

# 第三十三章 Memory触发

事件：

```text
SO Closed
```

------

自动触发：

```text
Memory Agent
```

------

生成：

Trading Memory。

------

# 第三十四章 Dashboard触发

事件：

```text
Quote Created
```

------

自动更新：

Dashboard。

------

# 第三十五章 Event Audit

记录：

```text
Publisher

Consumer

Timestamp

Status
```

------

# 第三十六章 Event Monitoring

监控：

```text
Throughput

Latency

Failure Rate

Retry Rate
```

------

# 第三十七章 Dead Letter Queue

失败事件：

进入：

```text
DLQ
```

------

等待处理。

------

# 第三十八章 Event Security

继承：

```text
Permission Engine
```

------

禁止：

跨权限事件。

------

# 第三十九章 技术选型

Phase1：

```text
PostgreSQL Event Table
```

------

Phase2：

```text
Redis Streams
```

------

Phase3：

```text
Kafka
```

------

# 第四十章 Event Bus金律

1. 事件优于调用
2. Agent不得直接互调
3. Workflow订阅事件
4. Memory订阅事件
5. 所有事件必须可追溯
6. 所有事件必须可重放
7. 所有事件必须可审计
8. Event Log属于组织资产
9. Event Bus是ANOS神经系统
10. ANOS所有智能协同基于事件驱动