# GA-019 Prompt治理规范 V1.0

## Prompt Governance Standard

文档编号：GA-019

文档名称：

Prompt治理规范

版本：

V1.0.0

状态：

Active

Owner：

LTDC

所属层级：

Governance Architecture

依赖文档：

TA-004 Agent运行时架构

GA-018 主数据权威源治理规范

------

# 第一章 文档使命

定义：

Prompt Governance。

------

解决：

Prompt失控

Prompt重复

Prompt漂移

Prompt版本混乱

------

# 第二章 核心原则

Prompt：

属于组织资产。

------

禁止：

个人私有Prompt。

------

# 第三章 Prompt Registry

建立：

Prompt Registry

统一注册中心。

------

# 第四章 Prompt唯一编号

格式：

```text
PRM-000001
```

------

全局唯一。

------

# 第五章 Prompt分类

统一：

```text
System Prompt

Role Prompt

Skill Prompt

Workflow Prompt

Agent Prompt

Evaluation Prompt
```

------

# 第六章 Prompt元数据

必须记录：

```text
Prompt ID

名称

版本

Owner

状态

创建时间
```

------

# 第七章 Prompt版本

统一：

```text
V1.0

V1.1

V2.0
```

------

禁止覆盖。

------

# 第八章 Prompt生命周期

```text
Draft

Review

Approved

Published

Deprecated

Archived
```

------

# 第九章 Prompt评审机制

必须经过：

```text
Owner

Reviewer

Approver
```

------

# 第十章 Prompt复用原则

优先复用。

------

禁止：

重复创建相同Prompt。

------

# 第十一章 Prompt测试

必须包含：

```text
输入样例

预期输出

边界案例
```

------

# 第十二章 Prompt KPI

监控：

```text
准确率

采纳率

调用量

ROI
```

------

# 第十三章 Prompt知识沉淀

优秀Prompt：

进入：

Prompt Library。

------

# 第十四章 Prompt安全规范

禁止：

```text
越权

泄露

绕过权限
```

------

# 第十五章 Prompt金律

1. Prompt属于组织
2. Prompt必须注册
3. Prompt必须版本化
4. Prompt必须测试
5. Prompt必须评审
6. Prompt优先复用
7. Prompt必须可审计
8. Prompt必须可回滚
9. Prompt必须持续优化
10. Prompt是组织智能资产