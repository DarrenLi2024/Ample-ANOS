# 75-飞书Portal实施手册 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** Feishu Portal Implementation Guide / 飞书Portal实施手册  
**上游文档：** [43-ANOS Portal 页面原型规范 V1.0.md](43-ANOS%20Portal%20页面原型规范%20V1.0.md)、[73-飞书工作流实施手册 V1.0.md](73-飞书工作流实施手册%20V1.0.md)  
**关联文档：** [76-统一智能入口AI Inbox设计规范 V1.0.md](76-统一智能入口AI%20Inbox设计规范%20V1.0.md)  
**版本：** V1.0  
**状态：** 飞书实施基线

---

## 目录

- 第1章 Portal建设原则
- 第2章 Portal总体架构
- 第3章 Top Bar设计
- 第4章 销售工作台实施规范
- 第5章 采购工作台实施规范
- 第6章 风控工作台实施规范
- 第7章 CEO工作台实施规范
- 第8章 Portal组件标准
- 第9章 Source Card标准
- 第10章 Portal权限体系
- 第11章 Portal建设顺序
- 第12章 Portal成功标准
- 第13章 Unified Intelligence Inbox

---

# 第1章 Portal建设原则

Portal是ANOS第一阶段真正面向用户的交付物。

如果说：

```text
Data Hub = 数据底座
Workflow = 神经系统
Knowledge Hub = 认知中心
Portal = 企业操作界面
```

那么员工每天打开的不应再是ERP、Excel、邮件和微信群，而应是ANOS Portal。

## AI First

传统ERP：

```text
菜单
↓
页面
↓
数据
```

ANOS：

```text
目标
↓
AI
↓
数据
↓
行动
```

## 角色驱动

销售看到客户、RFQ、报价、订单。

采购看到资源、供应商、库存、采购。

CEO看到经营、风险、增长、智能资产。

# 第2章 Portal总体架构

统一采用三纵列布局：

```text
┌─────────────────────────────────────────────┐
│ Top Bar                                     │
├─────────┬───────────────────┬───────────────┤
│ Left    │ Center Workspace  │ Right Panel   │
├─────────┴───────────────────┴───────────────┤
│ Universal AI Input Bar                      │
└─────────────────────────────────────────────┘
```

三列职责：

- Left：角色导航、业务入口、我的任务。
- Center：AI Workspace、业务主画布、表单/会话/工作流。
- Right：上下文卡片、Source Card、Agent建议、风险提示。

# 第3章 Top Bar设计

统一组件：

## 企业标识

```text
AMPLE
ANOS
```

## 全局搜索

支持搜索：

- 客户
- 供应商
- 型号
- 订单
- 知识
- Agent

## 全局通知

来源：

- Workflow
- Agent
- 审批
- 风险预警

## Agent状态

显示：

- Sales Agent
- Procurement Agent
- Credit Agent
- Knowledge Agent

# 第4章 销售工作台实施规范

页面编号：`PORTAL-SALES-001`

目标：

```text
RFQ → Offer → SO
```

## 左栏

我的工作：

- 今日RFQ
- 待报价
- 待跟进
- 待回款

## 中栏

### AI销售助手

支持：

- 分析RFQ
- 分析客户
- 生成报价
- 生成邮件

### Inquiry Intake Center

支持输入：

- 邮件
- PDF
- Excel
- 图片
- 微信截图
- WhatsApp截图

AI自动：

```text
OCR
↓
结构化
↓
Inquiry Base
```

## 右栏

### Customer Intelligence Card

显示：

- 客户等级
- 成交率
- 信用评分
- 最近订单
- 风险等级

### Source Card

所有客户需求信息必须展示：

- 来源
- 时间
- 可信度

# 第5章 采购工作台实施规范

页面编号：`PORTAL-PROC-001`

目标：

```text
资源发现
↓
供需匹配
↓
采购执行
```

## 左栏

- 供应商
- 资源池
- 库存
- 采购单

## 中栏

### AI采购专家

支持：

- 找资源
- 找替代料
- 分析报价
- 分析库存

### Supply Intake Center

支持输入：

- Excel库存表
- 报价单
- 邮件
- 截图
- 微信群资源
- 原厂通知

AI自动：

```text
OCR
↓
MPN识别
↓
价格识别
↓
库存识别
↓
交期识别
↓
供应商识别
↓
写入Supply Resource Base
```

## 右栏

### Resource Intelligence Card

显示：

- 资源评分
- 风险评分
- 匹配度
- 来源
- 时间
- 可信度

# 第6章 风控工作台实施规范

页面编号：`PORTAL-RISK-001`

目标：

- 风险发现
- 风险预警
- 风险处置

中栏：

- AI风控管理员
- AR分析
- 客户风险分析
- 回款预测

右栏：

### AR Risk Radar

显示：

- 超30天
- 超60天
- 超90天

### Collection Suggestion

显示：

- 催收建议
- 停单建议
- 法务建议

# 第7章 CEO工作台实施规范

页面编号：`PORTAL-CEO-001`

目标：

```text
3分钟掌握企业状态
```

中栏：

### CEO Agent

支持：

- 未来90天预测
- 增长机会
- 经营风险
- 现金流预测

右栏：

### OIQ Dashboard

显示：

- Data IQ
- Knowledge IQ
- Agent IQ
- Memory IQ
- Decision IQ

### Enterprise Asset Dashboard

显示：

- 客户资产
- 供应资产
- 知识资产
- Agent资产
- Memory资产

# 第8章 Portal组件标准

建立Component Registry统一管理组件。

字段：

- ComponentID
- ComponentName
- Page
- Owner
- Version
- Status

示例：

```text
CMP-001 Customer Card
CMP-002 Supply Resource Card
CMP-003 Source Card
CMP-004 Agent Suggestion Card
```

# 第9章 Source Card标准

所有页面统一展示Source Card。

结构：

```text
来源：ABC Electronics
来源方式：Email
原始时间：2026-06-01 10:31
采集时间：2026-06-01 10:35
验证人：Tony Li
可信度：95%
```

适用对象：

- 客户需求
- 供应资源
- 知识
- 情报
- Agent结论

# 第10章 Portal权限体系

基于飞书组织架构。

| 角色 | 默认可见 |
| --- | --- |
| 销售 | Customer、Inquiry、Offer |
| 采购 | Supplier、Supply Resource、Inventory |
| 财务 | AR、AP、Credit |
| CEO | 全部 |
| Agent | 按任务授权 |

Portal不得突破底层数据权限。

# 第11章 Portal建设顺序

## Sprint 1

- 销售工作台
- 采购工作台
- AI Inbox基础版

## Sprint 2

- 风控工作台
- 知识中心
- Workflow Operations Center

## Sprint 3

- CEO驾驶舱
- Agent中心
- OIQ Dashboard

# 第12章 Portal成功标准

未来90天：

| 角色 | 成功标准 |
| --- | --- |
| 销售 | RFQ录入时间减少70% |
| 采购 | 资源录入时间减少80% |
| 风控 | 风险发现速度提升90% |
| 管理层 | 经营分析时间减少80% |

# 第13章 Unified Intelligence Inbox

AI Inbox是Portal最核心页面。

统一接收：

- 客户需求
- 供应资源
- 邮件
- 截图
- 群聊
- 知识
- 情报

用户无需判断去哪录入，全部进入AI Inbox。

AI自动判断：

```text
这是RFQ → Inquiry
这是供应资源 → Supply Resource
这是知识 → Knowledge Asset
这是风险 → Risk Case
```

AI Inbox详见 [76-统一智能入口AI Inbox设计规范 V1.0.md](76-统一智能入口AI%20Inbox设计规范%20V1.0.md)。

