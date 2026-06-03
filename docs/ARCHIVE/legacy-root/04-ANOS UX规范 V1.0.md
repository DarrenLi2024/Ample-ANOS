# 04-ANOS UX 规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** Portal 交互体验统一标准  
**版本：** V1.0  
**状态：** UX基线

---

## Rule 1: AI First（AI 优先）

**不是菜单优先。** Portal 的第一入口是 AI Inbox，不是功能菜单。

- 首页展示 AI 会话 + KPI 动态流
- 用户输入自然语言，系统判断意图 → 自动路由
- 菜单仅为辅助导航

## Rule 2: Single Entry（单入口）

**Anything In。** 所有信息从底部指令栏进入：

- 文本 → AI 理解
- 文件 → 自动解析
- 截图 → OCR 识别
- 拖拽 → 即刻处理

不需要用户判断去哪个页面录入。

## Rule 3: Source First（来源优先）

所有数据显示来源：

```text
Source + SourceType + SourceOwner + EventTime + CapturedAt
```

- 没有来源的信息不允许进入正式业务表
- Agent 建议必须附带依据来源

## Rule 4: Time First（时间优先）

所有数据显示时间线：

```text
EventTime、CapturedAt、UpdatedAt
```

- 动态流按时间倒序
- 风险按逾期天数排序

## Rule 5: Confidence First（可信度优先）

所有 Agent 结论显示：

```text
Confidence Score + 进度条 + 依据展开
```

- 低于 40% 标记红色"低可信"
- 低于 70% 标记黄色"待验证"

## Rule 6: Human-in-the-Loop（人工确认）

关键动作必须保留人工确认入口：

- 报价审批
- 信用冻结
- 发货/停单
- Agent 建议采纳

## Rule 7: Role-Aware（角色感知）

页面渲染前先判断角色：

- 销售视图 → 供应商脱敏
- 采购视图 → 客户脱敏
- 风控视图 → 成本隐藏
- CEO 视图 → 聚合脱敏

## Rule 8: Progressive Disclosure（渐进式展开）

默认展示摘要，按需展开详情：

- 卡片 → 点击展开
- 表格行 → 点击查看详情
- Agent 依据 → 点击展开证据链

## Rule 9: Consistent Feedback（统一反馈）

- 加载态：Skeleton 骨架屏
- 空状态：图标 + 引导文字 + 快捷入口
- 错误态：红色提示 + 重试按钮 + 错误 ID
- 成功态：绿色 Tag + 自动消失

## Rule 10: Mobile Ready（移动端预备）

Phase 2 移动端适配时：

- 三纵列 → 单列 + 底部导航
- 表格 → 卡片列表
- 右侧面板 → 底部抽屉
