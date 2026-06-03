# SA-017 Portal角色工作台规范 V1.0

## ANOS Portal Role Workspace Specification

文档编号：SA-017

文档名称：

Portal角色工作台规范

版本：

V1.0.0

状态：

Active

Owner：

LTDC

所属层级：

Solution Architecture

依赖文档：

EA-013 AI Native组织蓝图

SA-015 交易智能网络总体设计

SA-016 AI Match Engine设计规范

GA-017 交易防火墙实施规范

------

# 第一章 文档使命

定义：

Portal Workspace Architecture

工作台架构。

------

回答：

```text
不同角色登录后

看到什么

能做什么

不能做什么
```

------

本规范是：

Portal开发总蓝图。

------

# 第二章 Portal定位

Portal不是ERP。

------

Portal不是菜单系统。

------

Portal本质：

```text
Role Based Intelligence Workspace
```

角色化智能工作台。

------

# 第三章 Portal设计原则

原则：

```text
千人千面

权限驱动

数据驱动

Agent驱动
```

------

统一：

基于飞书User ID。

------

# 第四章 Portal总体结构

统一三栏结构：

```text
左侧

导航区

——————

中间

工作区

——————

右侧

AI助手区
```

------

# 第五章 登录逻辑

用户登录：

↓

飞书User ID

↓

角色识别

↓

权限识别

↓

工作台加载

------

# 第六章 Portal角色矩阵

支持：

```text
CEO

CFO

Finance Manager

Accountant

Sales Manager

Sales

Buyer Manager

Buyer

Quality Manager

Quality

HR Manager

HR

LTDC
```

------

# 第七章 Sales Portal

核心目标：

经营客户。

------

禁止经营供应商。

------

# 第八章 Sales Portal首页

模块：

```text
我的Inquiry

AI匹配结果

待报价

待跟进

成交漏斗
```

------

# 第九章 Sales快捷录入区

最重要模块。

------

支持：

```text
截图

图片

邮件

微信内容

PDF

复制粘贴
```

------

统一进入：

```text
AI Inquiry Inbox
```

------

# 第十章 Sales AI解析区

解析：

```text
品牌

型号

数量

价格

客户

项目
```

------

自动生成：

Inquiry。

------

# 第十一章 Sales Demand Pool

仅显示：

```text
本人Inquiry
```

------

Sales Manager：

查看本部门。

------

# 第十二章 Sales Match Center

显示：

```text
AI匹配机会

Match Score

利润建议

风险提示
```

------

禁止显示：

```text
Supplier Name

Supplier Contact

Source Person
```

------

# 第十三章 Buyer Portal

核心目标：

经营供应商。

------

禁止经营客户。

------

# 第十四章 Buyer首页

模块：

```text
我的Offer

AI匹配结果

待验证资源

供应商分析

成交支持
```

------

# 第十五章 Buyer快捷录入区

支持：

```text
微信群

QQ群

邮件

飞书群

截图

PDF
```

------

统一进入：

```text
AI Offer Inbox
```

------

# 第十六章 Buyer AI解析区

解析：

```text
品牌

型号

价格

库存

交期

D/C
```

------

自动生成：

Offer。

------

# 第十七章 Buyer Supply Pool

仅显示：

```text
本人Offer
```

------

Buyer Manager：

查看本部门。

------

# 第十八章 Buyer Match Center

显示：

```text
需求热度

匹配数量

需求等级

建议行动
```

------

禁止显示：

```text
Customer Name

Customer Contact

Decision Maker
```

------

# 第十九章 Sales Manager Portal

新增：

```text
部门Inquiry

部门成交漏斗

销售排行

AI分析
```

------

# 第二十章 Buyer Manager Portal

新增：

```text
部门Offer

资源排行

供应商分析

AI分析
```

------

# 第二十一章 Finance Portal

模块：

```text
AR

AP

Overdue

现金流

信用风险
```

------

# 第二十二章 CFO Portal

模块：

```text
经营驾驶舱

利润分析

库存分析

现金流分析

风险分析
```

------

# 第二十三章 CEO Portal

定位：

企业智能驾驶舱。

------

模块：

```text
Demand Pool

Supply Pool

Match Dashboard

Revenue

Profit

OIQ
```

------

# 第二十四章 Quality Portal

模块：

```text
IQC

QCC

异常处理

CAPA

质量分析
```

------

# 第二十五章 HR Portal

模块：

```text
招聘

培训

绩效

能力模型

AI使用情况
```

------

# 第二十六章 LTDC Portal

定位：

组织智能运营中心。

------

模块：

```text
Agent Registry

Prompt Registry

Workflow Registry

Knowledge Hub

Memory Hub

Token Governance
```

------

# 第二十七章 AI助手区

所有Portal统一。

------

右侧固定：

```text
个人Agent
```

------

例如：

```text
Sales Copilot

Buyer Copilot

Finance Copilot
```

------

# 第二十八章 Portal权限控制

所有组件：

必须：

```text
后端鉴权
```

------

禁止：

前端隐藏式权限。

------

# 第二十九章 Portal性能策略

100万记录：

正常响应。

------

1000万记录：

自动路由。

------

1亿记录：

分布式查询。

------

# 第三十章 Portal金律

1. Portal服务角色
2. Portal服务交易
3. Portal服务决策
4. Portal必须隔离
5. Portal必须智能
6. Portal必须简洁
7. Portal必须可扩展
8. Portal必须支持Agent
9. Portal必须支持千万级数据
10. Portal最终服务成交