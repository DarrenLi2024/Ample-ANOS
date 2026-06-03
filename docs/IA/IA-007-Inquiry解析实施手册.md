# IA-007 Inquiry解析实施手册 V1.0

## Inquiry Intelligence Processing Manual

文档编号：IA-007

文档名称：

Inquiry解析实施手册

版本：

V1.0.0

状态：

Active

Owner：

LTDC

所属层级：

Implementation Architecture

依赖文档：

DA-008 需求资源池数据模型设计

SA-015 交易智能网络总体设计

SA-017 Portal角色工作台规范

------

# 第一章 文档使命

定义：

Inquiry Processing Pipeline

询价解析流水线。

------

目标：

把所有非结构化需求信息

自动转换为

标准Inquiry。

------

输出：

Demand Pool。

------

# 第二章 Inquiry来源

支持：

```text
Email

WeChat

QQ

WhatsApp

Feishu

Image

PDF

Excel

Manual Input
```

------

统一入口：

AI Inquiry Inbox

------

# 第三章 处理流程总图

```text
Raw Message

↓

OCR

↓

NLP Parse

↓

Field Extraction

↓

Data Validation

↓

AI Scoring

↓

Demand Pool

↓
Match Engine
```

------

# 第四章 Inquiry Inbox

Sales唯一入口。

------

支持：

拖拽上传

复制粘贴

截图上传

邮件转发

批量导入

------

# 第五章 文件接收规范

支持：

```text
jpg

png

pdf

xlsx

csv

txt

eml
```

------

自动生成：

```text
INBOX_ID
```

------

# 第六章 OCR识别

适用：

```text
图片

截图

PDF扫描件
```

------

识别：

```text
品牌

型号

数量

价格

客户名称
```

------

# 第七章 NLP解析

适用：

```text
邮件正文

聊天记录

文字内容
```

------

识别：

```text
Inquiry Intent

品牌

型号

数量

交期

备注
```

------

# 第八章 MPN识别引擎

优先级最高。

------

输出：

```text
Brand

MPN

Package
```

------

建立：

MPN Dictionary。

------

# 第九章 品牌识别

自动映射：

```text
TI

Texas Instruments

德州仪器
```

统一：

Texas Instruments

------

建立：

Brand Master。

------

# 第十章 型号标准化

例如：

```text
STM32F103C8T6

stm32f103c8t6

STM32 F103 C8T6
```

统一：

STM32F103C8T6

------

# 第十一章 数量识别

支持：

```text
100K

100000

100,000
```

统一：

100000

------

# 第十二章 币种识别

支持：

```text
USD

RMB

CNY

EUR
```

------

统一：

ISO标准。

------

# 第十三章 客户识别

来源：

```text
邮件域名

历史客户库

Sales输入
```

------

自动匹配：

Customer Master。

------

# 第十四章 多型号解析

支持：

```text
一个Inquiry

多个MPN
```

------

自动生成：

Inquiry Item。

------

# 第十五章 缺失字段补全

AI自动建议：

```text
Brand

Package

Description
```

------

标记：

Suggested。

------

# 第十六章 数据校验

校验：

```text
MPN是否合法

品牌是否合法

数量是否合法
```

------

异常进入：

Review Queue。

------

# 第十七章 Inquiry质量评分

自动评分：

```text
0~100
```

------

维度：

```text
完整度

客户等级

历史成交

利润空间

紧急程度
```

------

# 第十八章 Inquiry等级

输出：

```text
A级

B级

C级

D级
```

------

# 第十九章 Confidence计算

输出：

```text
High

Medium

Low
```

------

必须记录。

------

# 第二十章 Source信息记录

强制记录：

```text
Source

Source Type

Source Time

Captured At
```

------

禁止：

无来源Inquiry。

------

# 第二十一章 时间戳体系

必须记录：

```text
Event Time

Captured Time

Parsed Time

Stored Time
```

------

# 第二十二章 Owner绑定

自动绑定：

```text
Sales Owner
```

------

来源：

飞书User ID。

------

# 第二十三章 人工确认机制

AI解析后：

允许：

```text
确认

修改

驳回
```

------

# 第二十四章 批量解析

支持：

```text
100+

1000+

10000+
```

记录批量导入。

------

# 第二十五章 Demand Pool入库

生成：

```text
INQ_ID
```

------

写入：

Demand Pool。

------

# 第二十六章 Match Engine触发

入库后：

立即触发：

```text
Real Time Match
```

------

# 第二十七章 Knowledge沉淀

自动生成：

```text
Customer Knowledge

Market Knowledge
```

------

# 第二十八章 Memory沉淀

自动生成：

```text
Customer Memory
```

------

# 第二十九章 KPI

监控：

```text
解析率

准确率

完整率

人工修正率

匹配率
```

------

# 第三十章 Inquiry解析金律

1. 所有Inquiry必须结构化
2. MPN优先识别
3. 所有数据必须记录Source
4. 所有数据必须记录时间戳
5. 所有数据必须绑定Owner
6. AI必须输出Confidence
7. AI必须输出Quality Score
8. 人工必须可修正
9. 入库即触发匹配
10. Inquiry是企业核心资产