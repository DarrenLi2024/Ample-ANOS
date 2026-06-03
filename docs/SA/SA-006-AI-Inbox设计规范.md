# 76-统一智能入口AI Inbox设计规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** Unified Intelligence Inbox / ANOS首页与意图入口设计规范  
**上游文档：** [43-ANOS Portal 页面原型规范 V1.0.md](43-ANOS%20Portal%20页面原型规范%20V1.0.md)  
**版本：** V1.0  
**状态：** Portal核心入口设计基线

---

# 第1章 AI Inbox定位

传统ERP首页是菜单、报表和快捷入口。

ANOS首页应是：

```text
AI Inbox
```

核心理念：

```text
Anything In
Everything Connected
```

任何信息进入，AI自动识别、分类、连接数据、触发Workflow。

这意味着ANOS从菜单驱动升级为意图驱动。

# 第2章 首页结构

```text
┌──────────────────────────────────────────────┐
│                AI Inbox                       │
├──────────────────────────────────────────────┤
│                                              │
│   今天你想完成什么？                         │
│                                              │
│  [输入文字...]                               │
│                                              │
│  [上传文件] [截图] [邮件] [语音] [Excel]     │
│                                              │
└──────────────────────────────────────────────┘
```

下方展示：

- 待处理事项
- 推荐事项
- Agent建议
- 企业动态
- 今日新增需求
- 今日新增资源
- 今日新增风险
- 今日新增商机

# 第3章 Anything In引擎

支持输入：

| 类型 | 示例 |
| --- | --- |
| 文本 | 帮我找STM32H743资源 |
| 图片 | 微信聊天截图 |
| PDF | 客户RFQ |
| Excel | 供应商库存表 |
| 邮件 | 客户询价邮件 |
| 群聊 | 资源群消息 |
| 语音 | 采购电话录音 |

# 第4章 AI Routing Engine

AI先判断输入类型：

| 分类 | 含义 | 进入Workflow |
| --- | --- | --- |
| Demand | 客户需求 | Inquiry Workflow |
| Supply | 供应资源 | Supply Workflow |
| Knowledge | 知识 | Knowledge Workflow |
| Risk | 风险 | Risk Workflow |
| Project | 项目 | Project Workflow |

# 第5章 Asset Registration Engine

所有信息进入后，先进入Asset Registration Workflow。

自动完成：

- 编号
- 分类
- 版本
- 标签
- 来源登记
- 可信度评分

示例编号：

```text
ASSET-RFQ-20260601-001
ASSET-SUP-20260601-001
KA-SAL-001
```

# 第6章 Source First Engine

任何内容进入ANOS，必须生成：

- Source
- SourceType
- SourceOwner
- EventTime
- CapturedAt
- VerifiedBy
- ConfidenceScore

示例：

```text
来源：微信
来源人：张三
原始时间：2026-06-01 10:31
采集时间：2026-06-01 10:32
可信度：95%
```

# 第7章 AI Classification Engine

自动打标签。

客户邮件示例：

```text
客户
RFQ
MCU
STM32
紧急
```

供应资源示例：

```text
现货
授权代理
ST
交期短
```

知识文档示例：

```text
采购SOP
V2.0
已审核
```

# 第8章 Unified Asset Center

所有内容最终汇聚到企业资产中心：

- Demand Assets
- Supply Assets
- Knowledge Assets
- Memory Assets
- Agent Assets

AI Inbox不是上传框，而是企业智能资产入口。

# 第9章 Agent自动协同

上传RFQ后的协同链路：

```text
Sales Agent
↓
Procurement Agent
↓
Credit Agent
↓
Knowledge Agent
↓
Opportunity
```

系统不只是保存信息，而是自动生成下一步业务机会和行动建议。

# 第10章 AI Inbox Dashboard

首页指标：

| 指标 | 含义 |
| --- | --- |
| 今日新增需求 | 新进入Demand资产数量 |
| 今日新增资源 | 新进入Supply资产数量 |
| 今日新增知识 | 新进入Knowledge资产数量 |
| 今日新增风险 | 新进入Risk事件数量 |
| 今日新增商机 | 由Matching Engine生成的Opportunity数量 |

# 第11章 战略价值

AI Inbox把ERP时代的录入数据升级为AI时代的输入信息。

它将：

- 菜单驱动升级为意图驱动。
- 功能系统升级为企业智能操作系统。
- 分散信息升级为结构化信息资产。
- 单人处理升级为Agent协同处理。

AI Inbox应作为ANOS Home Page优先建设。

