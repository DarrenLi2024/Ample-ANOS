# SA-016 AI Match Engine设计规范 V1.0

## ANOS Match Intelligence Engine

文档编号：SA-016

文档名称：

AI Match Engine设计规范

版本：

V1.0.0

状态：

Active

Owner：

LTDC

所属层级：

Solution Architecture

依赖文档：

EA-015 交易智能架构

DA-008 需求资源池数据模型

DA-009 供应资源池数据模型

SA-015 交易智能网络总体设计

------

# 第一章 文档使命

定义：

ANOS Match Engine。

------

回答：

```text
如何发现交易机会

如何匹配供需

如何排序机会

如何辅助成交
```

------

本系统是：

Trading Intelligence核心引擎。

------

# 第二章 核心定位

Match Engine：

不是搜索引擎。

------

不是数据库查询。

------

而是：

```text
Opportunity Discovery Engine
```

交易机会发现引擎。

------

# 第三章 核心公式

Match Score

=

Model Match

- 

Commercial Match

- 

Trust Match

- 

History Match

- 

AI Score

------

输出：

```text
0~100
```

------

# 第四章 五层匹配体系

Layer 1

型号匹配

------

Layer 2

商业匹配

------

Layer 3

信任匹配

------

Layer 4

历史匹配

------

Layer 5

AI智能匹配

------

# 第五章 Layer1 型号匹配

最高优先级。

------

字段：

```text
Brand

MPN

Package
```

------

规则：

```text
完全一致
```

得分最高。

------

# 第六章 模糊匹配

支持：

```text
MPN相似

后缀差异

封装差异

替代料
```

------

建立：

Part Intelligence Library。

------

# 第七章 替代料匹配

支持：

```text
Cross Reference

Replacement

Second Source
```

------

未来：

Agent自动推荐。

------

# 第八章 Layer2 商业匹配

维度：

```text
Qty

Target Price

Lead Time

Region
```

------

# 第九章 数量匹配

示例：

```text
需求：

100K

供应：

120K
```

------

评分：

高。

------

# 第十章 价格匹配

比较：

```text
Target Price

Offer Price
```

------

计算：

```text
Margin Potential
```

利润空间。

------

# 第十一章 交期匹配

比较：

```text
Required Date

Lead Time
```

------

生成：

```text
Delivery Score
```

------

# 第十二章 Layer3 信任匹配

核心：

```text
Source Grade
```

------

来源：

Supply Pool。

------

# 第十三章 信源权重

建议：

```text
S级

100

A级

90

B级

75

C级

50

D级

20
```

------

# 第十四章 Supplier Memory权重

引用：

Supplier Memory。

------

包括：

```text
历史成交

履约率

投诉率

质量记录
```

------

# 第十五章 Customer Memory权重

引用：

Customer Memory。

------

包括：

```text
付款记录

成交记录

采购习惯
```

------

# 第十六章 Layer4 历史匹配

系统检查：

```text
历史成交记录
```

------

例如：

```text
客户A

过去买过此型号
```

------

加权。

------

# 第十七章 Layer5 AI智能匹配

AI负责：

发现隐性机会。

------

例如：

```text
品牌不同

型号不同

但参数一致
```

------

# 第十八章 Match Score

最终：

```text
0~100
```

------

等级：

```text
90+

S

80+

A

70+

B

60+

C

60以下

D
```

------

# 第十九章 Match Candidate

生成：

```text
Match Candidate
```

------

字段：

```text
INQ_ID

OFF_ID

Match Score

Match Reason
```

------

# 第二十章 Match Reason

必须生成：

```text
Why Match
```

------

例如：

```text
型号完全一致

利润率18%

信源A级
```

------

# 第二十一章 Human Verification

AI匹配

≠

直接成交。

------

必须：

人工验证。

------

# 第二十二章 Sales验证

Sales验证：

```text
需求仍然有效

客户仍然采购
```

------

# 第二十三章 Buyer验证

Buyer验证：

```text
库存真实

价格真实

货仍在
```

------

# 第二十四章 Match Workflow

流程：

```text
Inquiry

↓

Demand Pool

↓

Match Engine

↓

Candidate

↓

Sales Verify

↓

Buyer Verify

↓

Quote

↓

SO
```

------

# 第二十五章 Match Queue

建立：

```text
Priority Queue
```

------

优先展示：

```text
高价值机会
```

------

# 第二十六章 实时匹配

新增Inquiry：

立即匹配。

------

新增Offer：

立即匹配。

------

# 第二十七章 定时重匹配

每日：

```text
Full Re-Match
```

------

发现遗漏机会。

------

# 第二十八章 Match Dashboard

展示：

```text
今日匹配

待验证

已成交

成交金额
```

------

# 第二十九章 Match KPI

核心指标：

```text
Match Rate

Verify Rate

Quote Rate

SO Rate

Revenue
```

------

# 第三十章 Match Engine金律

1. 匹配优先于搜索
2. 信任优先于价格
3. 验证必须保留
4. Match必须可解释
5. Match必须可追溯
6. Match必须实时
7. Match必须持续学习
8. Match必须沉淀知识
9. Match必须沉淀记忆
10. Match最终服务成交