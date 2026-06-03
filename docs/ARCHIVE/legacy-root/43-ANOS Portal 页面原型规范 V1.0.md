# 43-ANOS Portal 页面原型规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** Portal页面原型 / 飞书妙搭与Codex开发输入  
**上游文档：** [11-ANOS Portal 三纵列工作台设计规范 V1.0.md](11-ANOS%20Portal%20三纵列工作台设计规范%20V1.0.md)  
**版本：** V1.0  
**状态：** 开发前原型基线

---

# 第1章 Portal总体结构

统一采用AI Native三纵列布局：

```text
┌─────────────────────────────────────────────────────────────┐
│                         Top Bar                            │
├────────────┬──────────────────────┬─────────────────────────┤
│ Left Nav   │   AI Workspace       │    Context Panel        │
├────────────┴──────────────────────┴─────────────────────────┤
│                    Universal Input Bar                     │
└─────────────────────────────────────────────────────────────┘
```

Top Bar包含：

- AMPLE / ANOS标识
- 全局搜索：客户、供应商、型号、订单、知识、Agent
- 消息中心
- 待办
- Agent状态
- 个人中心

# 第2章 CEO工作台

页面编号：`PORTAL-CEO-001`

目标：3分钟掌握企业运行状态。

左侧导航：

- 经营驾驶舱
- 销售中心
- 采购中心
- 风控中心
- 知识中心
- Agent中心

中间区：

- 今日经营摘要
- CEO提问区
- 企业运行地图

右侧区：

- 风险雷达
- Agent建议
- Enterprise Asset Dashboard
- OIQ Dashboard

核心问题：

- 今天有什么值得关注？
- 未来90天现金流如何？
- 哪个客户增长最快？

# 第3章 销售工作台

页面编号：`PORTAL-SALES-001`

目标：RFQ → Offer → SO全过程管理。

左侧导航：

- 我的客户
- 我的RFQ
- 我的报价
- 我的订单
- 我的回款

中间区：

- 今日工作
- AI销售助手
- RFQ快速录入区
- Inquiry Intake Center

支持输入：

- 邮件
- Excel
- PDF
- 图片
- 微信/WhatsApp截图
- 拖拽上传

系统自动完成：

```text
OCR
↓
结构化
↓
生成Inquiry
↓
匹配供应资源
↓
生成报价建议
```

右侧区：

- Customer Intelligence Card
- Source Card
- 推荐产品
- 推荐供应商
- 推荐替代料

# 第4章 采购工作台

页面编号：`PORTAL-PROC-001`

目标：资源发现 → 供需匹配 → 采购执行。

左侧导航：

- 供应商
- 资源池
- 库存
- 采购单

中间区：

- AI采购专家
- Supply Intake Center

支持输入：

- Excel库存表
- 报价单
- 邮件
- 截图
- 微信群资源
- 原厂通知

系统自动完成：

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

右侧区：

- Resource Intelligence Card
- 供应商评分
- 价格评分
- 交期评分
- 市场情报
- 国产替代建议

# 第5章 风控工作台

页面编号：`PORTAL-RISK-001`

目标：风险发现、风险预警、风险处置。

中间区：

- AI风控管理员
- AR分析
- 客户风险分析
- 回款预测

右侧区：

- AR Risk Radar
- Collection Suggestion
- Top10高风险客户

典型问题：

- 哪些客户风险最高？
- 未来30天预计回款？
- 谁超过90天未付款？

# 第6章 知识中心

页面编号：`PORTAL-KNOWLEDGE-001`

统一入口：

- 企业知识
- 产品知识
- 原厂情报
- 会议纪要
- 项目复盘

支持能力：

- 搜索
- 问答
- 推荐
- 来源追踪
- 知识归档

# 第7章 Agent中心

页面编号：`PORTAL-AGENT-001`

展示：

- Sales Agent
- Procurement Agent
- Credit Agent
- CEO Agent
- Knowledge Agent

状态：

- 在线
- 忙碌
- 异常
- 停用

KPI：

- 任务数
- 节省时间
- 创造价值
- 业务结果改善

# 第8章 Source Card标准

所有页面统一显示Source Card。

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

# 第9章 Portal建设顺序

| Sprint | 上线范围 |
| --- | --- |
| Sprint 1 | 销售工作台、采购工作台、统一AI入口 |
| Sprint 2 | 风控工作台、知识中心 |
| Sprint 3 | CEO驾驶舱、Agent中心 |

# 第10章 成功标准

| 角色 | 90天成功标准 |
| --- | --- |
| 销售 | RFQ录入时间减少70% |
| 采购 | 资源录入时间减少80% |
| 风控 | 风险发现速度提升90% |
| 管理层 | 经营分析时间减少80% |

统一AI入口详见 [76-统一智能入口AI Inbox设计规范 V1.0.md](76-统一智能入口AI%20Inbox设计规范%20V1.0.md)。

