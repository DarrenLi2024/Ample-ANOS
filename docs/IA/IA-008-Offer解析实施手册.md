# IA-008 Offer解析实施手册 V1.0

## Offer Intelligence Processing Manual

文档编号：IA-008

文档名称：

Offer解析实施手册

版本：

V1.0.0

状态：

Active

Owner：

LTDC

所属层级：

Implementation Architecture

依赖文档：

DA-009 供应资源池数据模型设计

SA-015 交易智能网络总体设计

SA-017 Portal角色工作台规范

GA-017 交易防火墙实施规范

------

# 第一章 文档使命

定义：

Offer Processing Pipeline

供应信息解析流水线。

------

目标：

把所有非结构化Offer

自动转换为

标准Offer。

------

输出：

Supply Pool。

------

# 第二章 核心战略

Offer解析：

不仅解析型号。

------

更重要的是：

解析信源。

------

ANOS定义：

```text
Offer Value

=

Offer Data

+

Source Intelligence
```

------

# 第三章 Offer来源

支持：

```text
Email

WeChat Group

QQ Group

WhatsApp

Feishu Group

Excel

PDF

Image

Manual Input
```

------

统一进入：

AI Offer Inbox。

------

# 第四章 处理流程总图

```text
Raw Offer

↓

OCR

↓

NLP Parse

↓

Field Extraction

↓

Source Identification

↓

Supplier Matching

↓

AI Scoring

↓

Supply Pool

↓

Match Engine
```

------

# 第五章 AI Offer Inbox

采购唯一入口。

------

支持：

```text
拖拽上传

截图上传

群消息转发

邮件导入

Excel导入
```

------

# 第六章 文件接收规范

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

生成：

```text
INBOX_ID
```

------

# 第七章 OCR识别

适用：

```text
图片

截图

扫描件
```

------

识别：

```text
品牌

型号

数量

价格

交期

D/C
```

------

# 第八章 NLP解析

适用：

```text
邮件

群消息

聊天记录
```

------

识别：

```text
Offer Intent

库存

价格

交期

备注
```

------

# 第九章 MPN识别引擎

最高优先级。

------

输出：

```text
Brand

MPN

Package
```

------

建立：

Part Dictionary。

------

# 第十章 品牌标准化

统一：

```text
TI

Texas Instruments

德州仪器
```

↓

Texas Instruments

------

# 第十一章 型号标准化

统一：

```text
STM32F103C8T6
```

------

消除：

大小写差异

空格差异

后缀差异

------

# 第十二章 数量识别

统一：

```text
100K

100000

100,000
```

↓

100000

------

# 第十三章 价格识别

支持：

```text
USD

EUR

CNY

HKD
```

------

统一：

ISO币种标准。

------

# 第十四章 D/C识别

自动解析：

```text
Date Code

Year Code

Lot Code
```

------

形成：

D/C标准字段。

------

# 第十五章 交期识别

统一：

```text
In Stock

2 Weeks

4 Weeks

8 Weeks
```

↓

Lead Time。

------

# 第十六章 Supplier识别

自动识别：

```text
Supplier Name

Supplier Company

Supplier Contact
```

------

匹配：

Supplier Master。

------

# 第十七章 Source Intelligence Engine

核心模块。

------

识别：

```text
Source Person

Source Company

Source Channel
```

------

形成：

Source Profile。

------

# 第十八章 Source标准化

统一：

```text
同一联系人

同一公司

同一渠道
```

------

形成：

Source Master。

------

# 第十九章 Source Grade计算

自动评级：

```text
S

A

B

C

D
```

------

# 第二十章 Source Grade规则

评分依据：

```text
历史成交

成交金额

履约率

响应速度

投诉记录
```

------

# 第二十一章 Source Reliability

计算：

```text
0~100
```

------

形成：

Source Reliability Score。

------

# 第二十二章 Supplier Memory生成

自动沉淀：

```text
价格竞争力

库存真实性

交付能力

合作记录
```

------

形成：

Supplier Memory。

------

# 第二十三章 Source Memory生成

自动沉淀：

```text
历史报价次数

成交次数

成交金额

履约率

失信记录
```

------

形成：

Source Memory。

------

# 第二十四章 Offer质量评分

评分：

```text
0~100
```

------

维度：

```text
完整度

信源等级

价格竞争力

库存可信度

历史表现
```

------

# 第二十五章 Offer等级

输出：

```text
A级

B级

C级

D级
```

------

# 第二十六章 Confidence计算

输出：

```text
High

Medium

Low
```

------

必须记录。

------

# 第二十七章 Source记录

强制记录：

```text
Source

Source Type

Source Time

Captured At
```

------

禁止：

无来源Offer。

------

# 第二十八章 时间戳体系

记录：

```text
Event Time

Captured Time

Parsed Time

Stored Time
```

------

# 第二十九章 Owner绑定

自动绑定：

```text
Buyer Owner
```

------

来源：

飞书User ID。

------

# 第三十章 人工确认机制

AI解析后：

允许：

```text
确认

修改

驳回
```

------

# 第三十一章 批量解析

支持：

```text
100+

1000+

10000+
```

------

记录：

导入批次。

------

# 第三十二章 Supply Pool入库

生成：

```text
OFF_ID
```

------

写入：

Supply Pool。

------

# 第三十三章 Match Engine触发

入库后：

立即触发：

```text
Real Time Match
```

------

# 第三十四章 Knowledge沉淀

自动生成：

```text
Supplier Knowledge

Market Knowledge

Pricing Knowledge
```

------

# 第三十五章 Memory沉淀

自动生成：

```text
Supplier Memory

Source Memory
```

------

# 第三十六章 风险识别

自动识别：

```text
异常低价

异常库存

高风险信源

历史失信记录
```

------

进入：

Risk Queue。

------

# 第三十七章 KPI

监控：

```text
解析率

准确率

完整率

人工修正率

匹配率

成交率
```

------

# 第三十八章 Trading Firewall校验

写入前：

检查：

```text
Buyer权限

Source权限

Supplier权限
```

------

禁止：

越权访问。

------

# 第三十九章 超大规模处理

支持：

```text
1000万+

Offer
```

------

支持：

分区

路由

归档。

------

# 第四十章 Offer解析金律

1. 所有Offer必须结构化
2. MPN优先识别
3. 所有Offer必须记录Source
4. 所有Offer必须记录Source Grade
5. 所有Offer必须记录时间戳
6. 所有Offer必须绑定Owner
7. AI必须输出Confidence
8. AI必须输出Quality Score
9. Source Memory必须持续积累
10. Supply Pool是企业核心资产