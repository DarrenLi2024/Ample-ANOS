# TA-003 Permission Engine设计规范 V1.0

## ANOS Unified Permission Engine

文档编号：TA-003

文档名称：

统一权限引擎设计规范

版本：

V1.0.0

状态：

Active

Owner：

LTDC

所属层级：

Technical Architecture

依赖文档：

EA-010 组织治理架构

EA-014 企业安全与信任架构

GA-017 交易防火墙实施规范

TA-001 Data Hub总体架构

------

# 第一章 文档使命

定义：

Permission Engine

统一权限引擎。

------

回答：

```text
谁能访问

访问什么

访问多少

访问多久

如何审计
```

------

本系统是：

ANOS统一权限中枢。

------

# 第二章 核心原则

权限：

不是功能。

------

权限：

是组织治理。

------

原则：

```text
Default Deny
默认拒绝
```

------

必须：

显式授权。

------

# 第三章 总体架构

```text
User

↓

Identity Engine

↓

Permission Engine

↓

Trading Firewall

↓

Data Hub
```

------

# 第四章 权限模型

采用：

三层模型。

------

Layer 1

RBAC

------

Layer 2

ABAC

------

Layer 3

Trading Firewall

------

# 第五章 RBAC

Role Based Access Control

------

基于角色。

------

角色：

```text
CEO

CFO

Finance Manager

Accountant

Sales Manager

Sales

Buyer Manager

Buyer

HR Manager

HR

Quality Manager

Quality

LTDC
```

------

# 第六章 ABAC

Attribute Based Access Control

------

基于属性。

------

属性：

```text
部门

区域

团队

职级

项目

组织层级
```

------

# 第七章 Trading Firewall

第三层权限。

------

负责：

```text
客户域隔离

供应商域隔离

商业秘密保护
```

------

# 第八章 身份源

统一：

```text
Feishu User ID
```

------

禁止：

多身份体系。

------

# 第九章 User Profile

每个用户：

建立：

```text
USER_ID

Role

Department

Team

Manager

Region

Status
```

------

# 第十章 Role Matrix

示例：

Sales：

```text
Read Own Inquiry

Create Inquiry

Update Own Inquiry
```

------

禁止：

查看Supplier Domain。

------

# 第十一章 Sales权限

允许：

```text
本人Demand

本人Quote

本人客户
```

------

禁止：

```text
Supplier Name

Supplier Contact

Source Grade
```

------

# 第十二章 Sales Manager权限

允许：

```text
部门Demand

部门Quote

团队统计
```

------

# 第十三章 Buyer权限

允许：

```text
本人Offer

本人Supplier

本人Source
```

------

禁止：

```text
Customer Name

Customer Contact

Sales Note
```

------

# 第十四章 Buyer Manager权限

允许：

```text
部门Offer

部门Source

团队统计
```

------

# 第十五章 CFO权限

允许：

```text
AR

AP

Cash Flow

Profit
```

------

禁止：

HR信息。

------

# 第十六章 HR权限

允许：

```text
Employee

Recruitment

Performance
```

------

禁止：

AR

AP

Profit

```
---

# 第十七章 CEO权限

允许：

```text
全部访问
```

------

但：

必须审计。

------

# 第十八章 LTDC权限

允许：

```text
Agent

Workflow

Prompt

Knowledge

Memory
```

------

但：

默认不允许查看财务明细。

------

# 第十九章 数据权限

控制到：

```text
Domain

Table

Record

Field
```

四级。

------

# 第二十章 Domain级权限

例如：

```text
Customer Domain

Supplier Domain

Finance Domain
```

------

# 第二十一章 Table级权限

例如：

```text
Demand Pool

Supply Pool

AR

AP
```

------

# 第二十二章 Record级权限

例如：

Sales：

只能看：

```text
Owner = Me
```

------

Sales Manager：

```text
Department = My Team
```

------

# 第二十三章 Field级权限

例如：

Sales可见：

```text
Match Score
```

------

Sales不可见：

```text
Supplier Name

Supplier Contact

Source Person
```

------

# 第二十四章 数据脱敏

支持：

```text
手机号脱敏

邮箱脱敏

地址脱敏
```

------

# 第二十五章 动态权限

支持：

```text
项目权限

活动权限

临时授权
```

------

自动过期。

------

# 第二十六章 Agent权限

Agent：

继承用户权限。

------

禁止：

Agent越权。

------

# 第二十七章 Workflow权限

Workflow：

必须绑定：

```text
Owner

Approver
```

------

# 第二十八章 API权限

所有API：

必须校验：

```text
User ID

Role

Permission
```

------

# 第二十九章 导出权限

导出：

最高风险操作。

------

记录：

```text
Who

What

When

Volume
```

------

支持：

审批流。

------

# 第三十章 查询权限

所有查询：

必须经过：

```text
Permission Engine
```

------

禁止：

绕过权限。

------

# 第三十一章 审计日志

记录：

```text
User

Action

Object

Timestamp

Result
```

------

# 第三十二章 风险识别

检测：

```text
异常导出

批量查询

跨域访问

高频访问
```

------

自动告警。

------

# 第三十三章 权限缓存

引入：

```text
Permission Cache
```

------

减少：

重复计算。

------

# 第三十四章 权限继承

支持：

```text
CEO

↓

Director

↓

Manager

↓

Employee
```

------

# 第三十五章 权限审批

新增：

```text
Permission Request
```

------

支持：

申请

审批

回收

------

# 第三十六章 离职处理

离职：

立即回收：

```text
账号

权限

Agent

Token
```

------

# 第三十七章 数据主权

数据属于：

组织。

------

权限：

仅为使用权。

------

# 第三十八章 权限成熟度

L1

角色权限

------

L2

部门权限

------

L3

记录级权限

------

L4

字段级权限

------

L5

智能权限引擎

```
---

# 第三十九章 性能目标

Portal权限校验：

```text
<50ms
```

------

API权限校验：

```text
<20ms
```

------

# 第四十章 Permission Engine金律

1. 默认拒绝
2. 必须显式授权
3. 权限最小化
4. 所有访问必须审计
5. Agent不得越权
6. Workflow不得越权
7. API不得绕过权限
8. Trading Firewall优先级最高
9. 数据属于组织
10. Permission Engine是ANOS安全核心