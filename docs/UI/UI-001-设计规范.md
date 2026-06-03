# ANOS UI 设计规范 V1.0

**项目名称:** Ample AI Native OS (ANOS)
**文档定位:** UI Design Tokens / 组件 API / 开发级设计约束
**上游文档:** [11-ANOS Portal 三纵列工作台设计规范 V1.0.md](11-ANOS%20Portal%20三纵列工作台设计规范%20V1.0.md)、[43-ANOS Portal 页面原型规范 V1.0.md](43-ANOS%20Portal%20页面原型规范%20V1.0.md)、[76-统一智能入口AI Inbox设计规范 V1.0.md](76-统一智能入口AI%20Inbox设计规范%20V1.0.md)、[Portal界面渲染图/Portal UI Reference V1.0.md](Portal界面渲染图/Portal%20UI%20Reference%20V1.0.md)、[Portal界面渲染图/开发适配图/README.md](Portal界面渲染图/开发适配图/README.md)、[25-权限与审计规范 V1.0.md](25-权限与审计规范%20V1.0.md)
**适用对象:** Codex, Claude, 前端工程师, 产品设计
**版本:** V1.0
**状态:** 开发前设计基线

---

## 目录

- 第1章 设计原则
- 第2章 Design Tokens
- 第3章 布局系统
- 第4章 字体系统
- 第5章 核心组件 API
- 第6章 权限脱敏展示规则
- 第7章 状态组件规范
- 第8章 图标与插图
- 第9章 动效与过渡
- 第10章 响应式策略
- 第11章 引用映射表

---

# 第1章 设计原则

## 1.1 核心设计理念

ANOS Portal 不是传统后台管理系统，而是 AI Native Enterprise Workspace。

设计原则：

| 原则 | 说明 |
| --- | --- |
| **AI First** | AI 不是外挂功能，而是默认工作方式；每个页面都有 Agent 协同入口 |
| **Data Finds People** | 信息主动推送，而不是等待用户查询 |
| **Intent-Driven** | 用户输入意图（自然语言/文件上传），系统完成结构化 |
| **Role-Aware** | 每个页面基于当前角色自动渲染权限视图 |
| **Source First** | 所有信息必须可追溯来源、可信度和审计链 |
| **Human-in-the-Loop** | 高风险动作必须保留人工确认节点 |
| **Progressive Disclosure** | 默认展示摘要，按需展开详情 |
| **Minimal & Professional** | 专业商务风格，避免过度装饰 |

## 1.2 与 Material Design / Ant Design 的关系

ANOS UI 不强制绑定任何第三方设计系统。Phase 1 飞书妙搭实现时，优先使用飞书原生组件库；Codex 自主开发 Portal 时，可选择 Tailwind CSS + shadcn/ui 风格。

关键约束：

- 不引入 Angular Material、Ant Design 等重型全家桶。
- 不模仿现有 ERP 菜单风格（菜单树、传统数据表格）。
- 保持与飞书妙搭体验的一致性。


---

# 第2章 Design Tokens

## 2.1 色板

基于 Portal 渲染图提取，采用冷色调商务风格。

### 主色系 (Primary)

```css
--color-primary-50:  #EFF6FF;
--color-primary-100: #DBEAFE;
--color-primary-200: #BFDBFE;
--color-primary-300: #93C5FD;
--color-primary-400: #60A5FA;
--color-primary-500: #3B82F6;  /* 主色，用于按钮、链接、选中态 */
--color-primary-600: #2563EB;
--color-primary-700: #1D4ED8;
--color-primary-800: #1E40AF;
--color-primary-900: #1E3A8A;
```

### 中性色系 (Neutral)

```css
--color-white:     #FFFFFF;
--color-gray-50:   #F9FAFB;
--color-gray-100:  #F3F4F6;   /* 左侧导航背景 */
--color-gray-200:  #E5E7EB;   /* 边框、分割线 */
--color-gray-300:  #D1D5DB;
--color-gray-400:  #9CA3AF;   /* 占位文字 */
--color-gray-500:  #6B7280;   /* 辅助文字 */
--color-gray-600:  #4B5563;
--color-gray-700:  #374151;   /* 次要标题 */
--color-gray-800:  #1F2937;
--color-gray-900:  #111827;   /* 正文、主标题 */
```

### 语义色 (Semantic)

```css
/* 成功 / 健康 / 已确认 */
--color-success-50:  #F0FDF4;
--color-success-500: #22C55E;
--color-success-700: #15803D;

/* 警告 / 待处理 / 低风险 */
--color-warning-50:  #FFFBEB;
--color-warning-500: #F59E0B;
--color-warning-700: #B45309;

/* 危险 / 高风险 / 错误 / 逾期 */
--color-danger-50:   #FEF2F2;
--color-danger-500:  #EF4444;
--color-danger-700:  #B91C1C;

/* 信息 / 提示 */
--color-info-50:     #EFF6FF;
--color-info-500:    #3B82F6;
--color-info-700:    #1D4ED8;
```

### 背景色

```css
--bg-app:          #F3F4F6;    /* 整体应用背景 */
--bg-sidebar:      #F9FAFB;    /* 左侧导航背景（浅色） */
--bg-workspace:    #FFFFFF;    /* 中间工作区背景 */
--bg-panel:        #FFFFFF;    /* 右侧面板背景 */
--bg-card:         #FFFFFF;    /* 卡片背景 */
--bg-input:        #FFFFFF;    /* 输入框背景 */
--bg-hover:        #F3F4F6;    /* 悬停态 */
--bg-selected:     #EFF6FF;    /* 选中态 */
```

### 数据可视化色板

```css
/* 用于图表、评分、风险等级 */
--chart-blue:      #3B82F6;
--chart-green:     #22C55E;
--chart-yellow:    #F59E0B;
--chart-orange:    #F97316;
--chart-red:       #EF4444;
--chart-purple:    #8B5CF6;
--chart-teal:      #14B8A6;
```

### 风险等级色

| 等级 | 颜色 | 含义 |
| --- | --- | --- |
| L1 低风险 | `#22C55E` | 正常范围 |
| L2 关注 | `#F59E0B` | 需要留意 |
| L3 警告 | `#F97316` | 需要干预 |
| L4 高风险 | `#EF4444` | 需要立即处置 |

### 数据健康度色

| 分数 | 颜色 | 标签 |
| --- | --- | --- |
| 80-100 | `#22C55E` | 健康 |
| 60-79 | `#F59E0B` | 一般 |
| 0-59 | `#EF4444` | 需治理 |

## 2.2 圆角

```css
--radius-sm:    4px;    /* 标签、Badge、小按钮 */
--radius-md:    8px;    /* 卡片、输入框、大按钮 */
--radius-lg:    12px;   /* 面板、弹窗 */
--radius-full:  9999px; /* 药丸形标签、头像 */
```

## 2.3 阴影

```css
--shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
```


---

# 第3章 布局系统

## 3.1 全局布局

三纵列架构，源自 Portal 渲染图与 11/43 号文档定义：

```text
┌─────────────────────────────────────────────────────────────┐
│                         Top Bar (48px)                      │
├────────────┬──────────────────────┬─────────────────────────┤
│ Left Nav   │   Main Workspace     │    Context Panel        │
│ (280px)    │   (flex: 1)          │    (420px)              │
├────────────┴──────────────────────┴─────────────────────────┤
│                    Bottom Command Bar (56px)                  │
└─────────────────────────────────────────────────────────────┘
```

## 3.2 尺寸常量

```css
--sidebar-width:       280px;
--panel-width:         420px;
--topbar-height:       48px;
--commandbar-height:   56px;
--content-max-width:   1400px;  /* 内容区最大宽度 */
--content-min-width:   960px;   /* 内容区最小宽度 */
```

## 3.3 间距系统

采用 4px 基准的间距 scale：

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
```

### 常用间距标准

| 场景 | 间距 | Token |
| --- | --- | --- |
| 元素内边距（紧凑） | 8-12px | `--space-2` ~ `--space-3` |
| 卡片内边距 | 16-20px | `--space-4` ~ `--space-5` |
| 区块间距 | 24px | `--space-6` |
| 页面内边距 | 24-32px | `--space-6` ~ `--space-8` |
| 章节间距 | 32-48px | `--space-8` ~ `--space-12` |

## 3.4 网格系统

卡片区采用 12 列网格：

```css
--grid-columns: 12;
--grid-gap:     16px;  /* 列间距 */
```

## 3.5 断点定义

```css
--breakpoint-sm:  640px;   /* 移动端横屏 */
--breakpoint-md:  768px;   /* 平板竖屏 */
--breakpoint-lg:  1024px;  /* 平板横屏 / 小桌面 */
--breakpoint-xl:  1280px;  /* 标准桌面 */
--breakpoint-2xl: 1536px;  /* 宽屏 */
```

P0 阶段优先适配 1280px+ 桌面端。移动端适配见第10章。


---

# 第4章 字体系统

## 4.1 字体族

```css
--font-sans:     'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono:     'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
--font-display:  'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

飞书妙搭内使用飞书内置字体，自主开发 Portal 时建议使用 Inter。

## 4.2 字号与行高

```css
--text-xs:   0.75rem;   /* 12px - Badge、标签、辅助标注 */
--text-sm:   0.875rem;  /* 14px - 次级信息、表格内容、描述 */
--text-base: 1rem;      /* 16px - 正文基准 */
--text-lg:   1.125rem;  /* 18px - 卡片标题 */
--text-xl:   1.25rem;   /* 20px - 区块标题 */
--text-2xl:  1.5rem;    /* 24px - 页面标题 */
--text-3xl:  1.875rem;  /* 30px - KPI 数字、面板主标题 */

--leading-tight:   1.25;  /* 标题行高 */
--leading-normal:  1.5;   /* 正文行高 */
--leading-relaxed: 1.625; /* 段落行高 */
```

## 4.3 字重

```css
--font-normal:  400;
--font-medium:  500;
--font-semibold: 600;
--font-bold:    700;
```

### 使用规范

| 层级 | 字号 | 字重 | 行高 | 用途 |
| --- | --- | --- | --- | --- |
| H1 页面标题 | `text-2xl` (24px) | `semibold` | `tight` | 工作台顶部标题 |
| H2 区块标题 | `text-xl` (20px) | `semibold` | `tight` | 卡片区标题 |
| H3 卡片标题 | `text-lg` (18px) | `medium` | `tight` | 各卡片大标题 |
| H4 子标题 | `text-base` (16px) | `semibold` | `normal` | 表格标题、分组标题 |
| Body 正文 | `text-base` (16px) | `normal` | `normal` | 正文、描述、列表 |
| Body-Small | `text-sm` (14px) | `normal` | `normal` | 辅助信息、表格单元格 |
| Caption | `text-xs` (12px) | `normal` | `normal` | Badge、时间戳、字段标签 |
| KPI-Number | `text-3xl` (30px) | `bold` | `tight` | KPI 数字、核心指标 |

## 4.4 字色

```css
--text-primary:    #111827;  /* gray-900 正文 */
--text-secondary:  #4B5563;  /* gray-600 次级文字 */
--text-tertiary:   #9CA3AF;  /* gray-400 占位、禁用 */
--text-inverse:    #FFFFFF;  /* 深色背景上的文字 */
--text-link:       #2563EB;  /* primary-600 可点击链接 */
--text-danger:     #DC2626;  /* 危险/错误文字 */
--text-success:    #16A34A;  /* 成功/健康文字 */
```

## 4.5 脱敏文字

```css
--text-redacted: #9CA3AF;      /* 脱敏文字颜色 */
--bg-redacted:   #F3F4F6;      /* 脱敏字段背景 */
--text-redacted-pattern: '●●●●'; /* 脱敏占位符 */
```


---

# 第5章 核心组件 API

以下组件 API 提取自 Portal UI Reference V1.0 和开发适配图，是前端实现的最小合约。

## 5.1 SourceCard

数据来源卡片，必须绑定在所有业务对象右侧面板中。

```typescript
interface SourceCardProps {
  /** 来源 */
  source: string;
  /** 来源类型: 'Email' | 'WeChat' | 'WhatsApp' | 'Excel' | 'PDF' | 'Feishu' | 'ERP' | 'Manual' */
  sourceType: 'Email' | 'WeChat' | 'WhatsApp' | 'Excel' | 'PDF' | 'Feishu' | 'ERP' | 'Manual';
  /** 来源链接（按权限控制可访问性） */
  sourceURL?: string;
  /** 来源人或系统 */
  sourceOwner?: string;
  /** 原始事件时间 */
  eventTime: string; // ISO 8601
  /** 系统采集时间 */
  capturedAt: string; // ISO 8601
  /** 验证人 */
  verifiedBy?: string;
  /** 可信度 0-100 */
  confidenceScore: number;
  /** 审计记录 ID */
  auditId?: string;
  /** 是否显示脱敏版（按角色权限） */
  permissioned?: boolean;
  /** 状态: 'verified' | 'unverified' | 'disputed' */
  status?: 'verified' | 'unverified' | 'disputed';
  /** 审计轨迹展开回调 */
  onViewAudit?: () => void;
  /** 来源链接点击回调 */
  onOpenSource?: () => void;
}
```

### 状态变体

| 状态 | 图标 | 颜色 | 说明 |
| --- | --- | --- | --- |
| `verified` | ✓ 勾选 | 绿色 | 来源已验证 |
| `unverified` | ⏳ 时钟 | 黄色 | 待验证（低于阈值） |
| `disputed` | ⚠ 警告 | 红色 | 来源存疑 |

### 置信度展示

| 分数 | 颜色 | 标签 |
| --- | --- | --- |
| 90-100 | 绿色 | 高可信 |
| 70-89 | 蓝色 | 可信 |
| 40-69 | 黄色 | 待验证 |
| 0-39 | 红色 | 低可信 |

## 5.2 AgentSuggestionCard

Agent 建议卡片，用于展示 AI 输出结果。

```typescript
interface AgentSuggestionCardProps {
  /** Agent 名称 */
  agentName: string;
  /** Agent 类型 */
  agentType: 'Sales' | 'Procurement' | 'Credit' | 'Knowledge' | 'Risk';
  /** 结论/建议摘要 */
  conclusion: string;
  /** 依据列表 */
  evidence: string[];
  /** 关联来源 ID */
  sourceId?: string;
  /** 生成时间 */
  generatedAt: string;
  /** 可信度 0-100 */
  confidenceScore: number;
  /** 建议动作 */
  suggestedActions: SuggestedAction[];
  /** 是否需要人工确认 */
  requiresApproval: boolean;
  /** 是否展开详情 */
  expanded?: boolean;
  /** 确认回调 */
  onApprove?: () => void;
  /** 驳回回调 */
  onReject?: (reason: string) => void;
  /** 展开详情回调 */
  onViewDetails?: () => void;
}

interface SuggestedAction {
  label: string;
  action: string;
  risk: 'low' | 'medium' | 'high';
}
```

### 强制执行规则

- 若无 `sourceId` → 禁止显示。
- 若 `confidenceScore < 40` → 强制标记 "低可信，建议人工核实"。
- 若 `requiresApproval === true` → 必须显示确认/驳回按钮。

## 5.3 HumanApprovalPanel

人工确认面板，显示在右侧输出区或弹窗中。

```typescript
interface HumanApprovalPanelProps {
  /** 确认对象类型 */
  targetType: 'Inquiry' | 'Offer' | 'Opportunity' | 'RiskDisposition' | 'Quotation';
  /** 确认对象 ID */
  targetId: string;
  /** 确认标题 */
  title: string;
  /** AI 建议摘要 */
  aiSuggestion: string;
  /** 确认动作列表 */
  actions: ApprovalAction[];
  /** 审批历史 */
  history?: ApprovalHistoryItem[];
  /** 确认回调 */
  onSubmit: (action: string, comment?: string) => void;
  /** 取消回调 */
  onCancel: () => void;
}

interface ApprovalAction {
  id: string;
  label: string;     // 如 "确认报价" "驳回" "修改后提交"
  variant: 'primary' | 'secondary' | 'danger';
  requireComment?: boolean;
}

interface ApprovalHistoryItem {
  actor: string;
  action: string;
  comment?: string;
  timestamp: string;
}
```

## 5.4 BottomCommandBar

底部指令栏，固定在每个页面底部。

```typescript
interface BottomCommandBarProps {
  /** 占位提示文字 */
  placeholder?: string;
  /** 支持的输入类型 */
  supportedInputs?: ('text' | 'file' | 'image' | 'voice')[];
  /** 提交回调 */
  onSubmit: (input: CommandInput) => void;
  /** 是否在 agent 处理中 */
  processing?: boolean;
  /** Agent 思考文字 */
  agentThinking?: string;
}

interface CommandInput {
  type: 'text' | 'file' | 'image' | 'voice';
  content: string | File;
}
```

## 5.5 PermissionNotice

权限不足提示组件。

```typescript
interface PermissionNoticeProps {
  /** 受限原因 */
  reason: 'role' | 'field' | 'object' | 'action';
  /** 受限字段名（字段级权限时必填） */
  fieldName?: string;
  /** 需要的权限级别 */
  requiredLevel?: string;
  /** 是否支持临时权限申请 */
  canRequest?: boolean;
  /** 申请权限回调 */
  onRequestAccess?: () => void;
}
```

### 变体

| 变体 | 图标 | 说明 |
| --- | --- | --- |
| `role` | 🔒 锁定 | "此区域仅限 XXX 角色访问" |
| `field` | 👁 斜杠眼 | "此字段已脱敏，如需查看请申请权限" |
| `object` | 📋 禁入 | "此记录超出您的权限范围" |
| `action` | 🚫 禁止 | "此操作需要授权" |

## 5.6 AuditTrail

审计日志组件。

```typescript
interface AuditTrailProps {
  /** 审计对象类型 */
  objectType: string;
  /** 审计对象 ID */
  objectId: string;
  /** 审计条目列表 */
  entries: AuditEntry[];
  /** 是否显示时间线 */
  showTimeline?: boolean;
  /** 是否可导出 */
  exportable?: boolean;
}

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  source?: string;
  evidenceId?: string;
}
```

## 5.7 RoleAwareField

角色感知字段组件，自动根据角色控制字段的显示/脱敏/隐藏。

```typescript
interface RoleAwareFieldProps {
  /** 字段类别（用于映射权限矩阵） */
  fieldCategory: 'CustomerName' | 'CustomerCredit' | 'SupplierName' | 'ProcurementCost' | 'SourceURL' | 'AgentReasoning';
  /** 字段值 */
  value: string;
  /** 当前用户角色 */
  currentRole: 'Sales' | 'Procurement' | 'Risk' | 'Operations' | 'SystemAdmin' | 'CEO';
  /** 脱敏时显示的占位文字 */
  redactedPlaceholder?: string;
  /** 脱敏时是否保留部分可见（如前2后2） */
  partialVisible?: boolean;
}
```

详见第6章权限脱敏展示规则。


---

# 第6章 权限脱敏展示规则

本规则提取自 Portal UI Reference V1.0 (第3节) 和 Portal渲染图 README (第2节)，是前端字段级权限的最小合约。

## 6.1 角色 × 字段权限矩阵

| 字段类别 | Sales (销售) | Procurement (采购) | Risk (风控) | Operations (运营) | CEO (管理层) |
| --- | --- | --- | --- | --- | --- |
| CustomerName | **明文** | 脱敏为 CustomerID | 按需明文 | 脱敏为 CustomerID | 聚合脱敏，授权后明文 |
| CustomerCredit | 按权限摘要 | **隐藏** | 明文 | 隐藏 | 按权限显示 |
| SupplierName | 脱敏为 SR-XXX | **明文** | 隐藏 | 脱敏为 SupplierID | 聚合脱敏，授权后明文 |
| ProcurementCost | 区间化/隐藏 | **明文** | 隐藏 | 隐藏 | 默认隐藏，授权后可见 |
| SourceURL | 客户来源可见 | 供应来源可见 | 按对象 | 按对象（脱敏） | 按对象权限控制 |
| AgentReasoning | 与本角色相关可见 | 与本角色相关可见 | 按角色可见 | 脱敏摘要 | 脱敏摘要+审计链 |

## 6.2 脱敏展示方式

| 脱敏级别 | 展示样式 | 示例 | 适用 |
| --- | --- | --- | --- |
| 完全隐藏 | `--text-redacted` 灰色方块 | `●●●●` | 无权限字段 |
| 脱敏为 ID | 显示业务 ID | `客户C-10293` | 跨角色引用 |
| 区间化 | 显示价格区间 | `$1.00 - $5.00` | 采购成本 |
| 摘要化 | 显示脱敏摘要 | `华东地区客户，3年合作` | 管理层视图 |
| 明文 | 正常显示 | `安芯易集团` | 有权限 |

## 6.3 脱敏 CSS 样式

```css
.redacted {
  color: var(--text-redacted);
  background: var(--bg-redacted);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  cursor: not-allowed;
}

.redacted--partial {
  /* 只显示前2后2字符，中间脱敏 */
  letter-spacing: 0;
}

.redacted--id {
  /* 显示脱敏后的业务 ID */
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

.redacted--range {
  /* 价格区间显示 */
  color: var(--text-secondary);
  background: var(--bg-hover);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.redacted--summary {
  /* 摘要描述 */
  color: var(--text-secondary);
  font-style: italic;
}
```

## 6.4 权限不足页面 (`AccessDenied`)

```css
.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: var(--space-8);
  text-align: center;
  color: var(--text-secondary);
}

.access-denied__icon {
  font-size: 48px;
  margin-bottom: var(--space-4);
  opacity: 0.5;
}

.access-denied__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.access-denied__description {
  font-size: var(--text-sm);
  max-width: 360px;
  margin-bottom: var(--space-6);
}

.access-denied__action {
  /* 申请权限按钮 */
}
```


---

# 第7章 状态组件规范

本规范提取自开发适配图 `07-Empty-Loading-Error-States.png`。

## 7.1 通用状态组件 API

```typescript
interface StateViewProps {
  /** 状态类型 */
  state: 'loading' | 'empty' | 'error' | 'access-denied' | 'parsing' | 'offline';
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 操作按钮 */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  /** 是否全屏居中 */
  fullPage?: boolean;
}
```

## 7.2 空状态 (Empty)

```css
.empty-state {
  /* 灰色图标 + 居中文字 + 可选创建/导入按钮 */
}
```

触发场景：

- 无 RFQ 数据
- 无供应资源
- 无风险记录
- 知识中心无搜索结果

行为：

- 显示引导性文字（如 "暂无询价记录"）
- 提供快捷入口（如 "上传第一份 RFQ"）

## 7.3 加载态 (Loading)

```css
.loading-state {
  /* Skeleton 占位图，不是 spinner */
}
```

Skeleton 规范：

```css
.skeleton {
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-200) 50%, var(--color-gray-100) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes skeleton-loading {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

Skeleton 变体：

| 类型 | 高度 | 用途 |
| --- | --- | --- |
| `text` | 16px | 文字行占位 |
| `title` | 24px | 标题占位 |
| `card` | 120px | 卡片占位 |
| `table-row` | 48px | 表格行占位 |
| `kpi` | 48px | KPI 数字占位 |
| `avatar` | 40px | 头像占位 (圆角 `--radius-full`) |

## 7.4 错误态 (Error)

```css
.error-state {
  /* 红色警告图标 + 错误描述 + 重试/反馈按钮 */
}
```

变体：

- `general`: 通用错误，"加载失败，请重试"
- `network`: 网络错误，"网络连接异常"
- `server`: 服务端错误，"服务暂时不可用"
- `parse`: 解析失败，"文件格式不支持或内容无法识别"

每种错误提供：

- 错误原因（面向用户）
- 重试按钮
- 错误详情（可展开）
- 错误 ID（用于排查）

## 7.5 解析中态 (Parsing)

特有状态，用于文件上传解析过程。

```css
.parsing-state {
  /* 文件图标 + 进度条 + 解析步骤列表 */
}
```

展示：

- 文件名和大小
- 当前步骤（OCR → 结构化 → 字段校验 → 写入）
- 已完成的字段预览
- 取消按钮

## 7.6 Agent 思考态 (Agent Thinking)

```css
.agent-thinking {
  /* 脉冲动画 + Agent 图标 + 思考文字 */
}
```

展示在 BottomCommandBar 上方或右侧面板中：

```css
.agent-thinking__dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  animation: agent-pulse 1.5s infinite;
}

@keyframes agent-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50%      { opacity: 1.0; transform: scale(1.1); }
}
```


---

# 第8章 图标与插图

## 8.1 图标集

P0 阶段优先使用 Heroicons (MIT 协议) 或 Lucide Icons，与 Tailwind CSS 生态兼容。

推荐图标包：`lucide-react` (Phase 1 自主开发 Portal 时)

## 8.2 图标尺寸

```css
--icon-xs:  12px;
--icon-sm:  16px;
--icon-base: 20px;
--icon-lg:  24px;
--icon-xl:  32px;
--icon-2xl: 48px;
```

| 场景 | 尺寸 | Token |
| --- | --- | --- |
| 行内图标 (Badge, Tag) | 12px | `--icon-xs` |
| 按钮内图标 | 16px | `--icon-sm` |
| 导航/菜单图标 | 20px | `--icon-base` |
| 卡片标题图标 | 24px | `--icon-lg` |
| 空状态/错误图标 | 48px | `--icon-2xl` |

## 8.3 图标语义色

图标颜色应继承语义 Token：

```css
.icon--success  { color: var(--color-success-500); }
.icon--warning  { color: var(--color-warning-500); }
.icon--danger   { color: var(--color-danger-500); }
.icon--info     { color: var(--color-info-500); }
.icon--muted    { color: var(--color-gray-400); }
.icon--default  { color: var(--color-gray-600); }
```

## 8.4 导航图标使用映射

| 导航项 | 建议图标 (Lucide) |
| --- | --- |
| 工作台 | `LayoutDashboard` |
| 待办事项 | `ListChecks` |
| Inquiry Center | `FileSearch` |
| Offer Center | `FileText` |
| SO Center | `PackageCheck` |
| 风控中心 | `ShieldAlert` |
| AR 中心 | `CalendarClock` |
| 知识库 | `Library` |
| Agent 中心 | `Bot` |
| 设置 | `Settings` |

## 8.5 品牌 Logo

- Portal Top Bar 左侧显示 ANOS / Ample 品牌标识。
- Logo 高度：28px。
- 左侧导航顶部可放置简化版 Logo (24px)。


---

# 第9章 动效与过渡

## 9.1 基本原则

- 动效不应超过 300ms（避免拖慢操作）。
- 优先使用 `ease-out` 用于入场，`ease-in` 用于离场。
- 关键业务操作（如 Agent 确认、审批提交）应使用微动效反馈。

## 9.2 过渡 Token

```css
--duration-fast:    150ms;
--duration-normal:  200ms;
--duration-slow:    300ms;

--ease-out:   cubic-bezier(0, 0, 0.2, 1);
--ease-in:    cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## 9.3 常用过渡场景

| 场景 | 持续 | 缓动 | 说明 |
| --- | --- | --- | --- |
| 悬停态 | 150ms | `ease-out` | 按钮/链接/卡片悬停颜色过渡 |
| 下拉展开 | 200ms | `ease-out` | 下拉菜单、折叠面板展开 |
| 面板切换 | 200ms | `ease-in-out` | 右侧面板内容切换 |
| 弹窗入场 | 200ms | `ease-out` | Modal/Dialog 入场 |
| 弹窗离场 | 150ms | `ease-in` | Modal/Dialog 关闭 |
| 通知入场 | 300ms | `ease-out` | Toast 从右侧滑入 |
| Skeleton | 1500ms 循环 | `linear` | 骨架屏加载动画 |
| Agent Pulse | 1500ms 循环 | `ease-in-out` | Agent 思考脉冲 |

## 9.4 页面级过渡

```css
/* 路由切换过渡 */
.page-enter {
  opacity: 0;
  transform: translateY(4px);
}
.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--duration-normal) var(--ease-out),
              transform var(--duration-normal) var(--ease-out);
}

/* 右侧面板滑入 */
.panel-enter {
  transform: translateX(20px);
  opacity: 0;
}
.panel-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all var(--duration-normal) var(--ease-out);
}
```

## 9.5 微交互

| 交互 | 效果 |
| --- | --- |
| 按钮点击 | `scale(0.97)` → `scale(1)` , 100ms |
| 卡片悬停 | `shadow-sm` → `shadow-md` + `translateY(-2px)` |
| 成功确认 | 绿色勾选图标弹入 + 200ms |
| 风险告警 | 边框红色脉冲一次，500ms |
| Agent 建议生成 | 逐条淡入，每条间隔 100ms |
| 表格行悬停 | 背景变 `--bg-hover`，150ms |


---

# 第10章 响应式策略

## 10.1 P0 优先桌面

Phase 1 优先保证 1280px+ 桌面端体验。移动端不作硬性要求，但组件应预留适配接口。

## 10.2 各断点布局

| 断点 | 宽度 | 布局 | 说明 |
| --- | --- | --- | --- |
| Desktop XL | ≥ 1536px | 完整三纵列 | 所有面板展开 |
| Desktop | ≥ 1280px | 完整三纵列 | 标准工作态 |
| Desktop Small | ≥ 1024px | 三纵列（右面板可折叠） | 右面板默认收起 |
| Tablet | ≥ 768px | 导航折叠 + 两列 | 左导航缩小为图标 |
| Mobile | < 768px | 单列 | 底部导航 + 全屏工作区 |

## 10.3 响应式策略

```css
/* 左侧导航响应式 */
.sidebar {
  width: var(--sidebar-width); /* 280px */
}

@media (max-width: 1024px) {
  .sidebar {
    width: 64px; /* 仅图标模式 */
  }
  .sidebar__label {
    display: none; /* 隐藏导航文字 */
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none; /* 切换为底部导航 */
  }
}

/* 右侧面板响应式 */
.panel {
  width: var(--panel-width); /* 420px */
}

@media (max-width: 1280px) {
  .panel {
    width: 340px;
  }
}

@media (max-width: 1024px) {
  .panel {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
    transform: translateX(100%);
    transition: transform var(--duration-normal) var(--ease-out);
  }
  .panel--open {
    transform: translateX(0);
  }
}
```

## 10.4 移动端优先级

Phase 2 再规划移动端适配。P0 仅保留以下移动端基础能力：

- 通知推送
- 待办审批（简化版）
- AR 风险告警查看
- Agent 查询响应


---

# 第11章 引用映射表

本文档所有设计约束均来自项目已有文档和渲染图。以下是每个章节的上游引用：

## 11.1 文档引用索引

| 本文档章节 | 上游文档 | 章节/位置 |
| --- | --- | --- |
| 第1章 设计原则 | `11-Portal三纵列` 第1章、`43-页面原型` | 设计哲学 + Portal 定位 |
| 第2章 Design Tokens (色板) | 16张渲染图 (视觉提取)、`Portal UI Reference` 第1节 | 全局 UI 约束 |
| 第2章 Design Tokens (风险色) | Portal渲染图 `04-Risk-Workspace.png`、`10-AR-Risk-Disposition.png` | AR 风险视觉 |
| 第3章 布局系统 | `11-Portal三纵列` 第2章、`43-页面原型` 第1章 | 总体布局 + 尺寸建议 |
| 第4章 字体系统 | 渲染图 (视觉提取) | 字号/字色 |
| 第5章 核心组件 API (SourceCard) | `Portal UI Reference` 第3节、`开发适配图` `03-Source-Card-State-Set.png` | 组件抽象 |
| 第5章 核心组件 API (AgentSuggestionCard) | `Portal UI Reference` 第3节、`76-AI Inbox` 第9章 | Agent 输出规范 |
| 第5章 核心组件 API (HumanApprovalPanel) | `开发适配图` `04-Human-Approval-Center.png`、`Portal UI Reference` 第1节 | Human-in-the-loop |
| 第5章 核心组件 API (BottomCommandBar) | `76-AI Inbox` 第2章、`Portal UI Reference` 第1节 | 统一输入入口 |
| 第5章 核心组件 API (PermissionNotice) | `开发适配图` `02-Access-Denied-Field-Redaction.png`、`25-权限审计` | 权限不足 |
| 第5章 核心组件 API (AuditTrail) | `开发适配图` `10-Audit-Log-Detail.png`、`25-权限审计` | 审计日志 |
| 第5章 核心组件 API (RoleAwareField) | `Portal UI Reference` 第3节、`25-权限审计` | 字段级脱敏 |
| 第6章 权限脱敏 | `Portal UI Reference` 第3节、`Portal渲染图 README` 第2节 | 字段级权限矩阵 |
| 第7章 状态组件 | `开发适配图` `07-Empty-Loading-Error-States.png`、`Portal UI Reference` | 状态处理 |
| 第8章 图标 | (新增标准化) | — |
| 第9章 动效 | `开发适配图` 组件交互 (提取) | 微交互 |
| 第10章 响应式 | `11-Portal三纵列` 第3.1节 | 尺寸建议 + 移动端预留 |

## 11.2 渲染图引用索引

| 渲染图 | 提取的设计参数 |
| --- | --- |
| `01-AI-Inbox-Home` | 首页布局、KPI 卡片、动态流、BottomCommandBar |
| `02-Sales-Workspace` | 销售三纵列、RFQ 列表、Sales Agent 建议 |
| `03-Procurement-Workspace` | 采购三纵列、供应资源池 |
| `04-Risk-Workspace` | AR 风险雷达色、信用卡片、风控面板 |
| `05-Opportunity-Sales-View` | Opportunity 卡片、匹配展示 |
| `06-Opportunity-Procurement-View` | 供应商对比、采购确认 |
| `07-RFQ-Inquiry-Create` | RFQ 解析流程、字段校验态 |
| `08-Supply-Resource-Create` | 供应资源解析、重复提示 |
| `09-Quotation-Approval` | 报价确认面板、毛利护栏 |
| `10-AR-Risk-Disposition` | AR 处置、Credit Agent 建议、审计轨迹 |
| `11-Customer-360` | 客户画像、时间线、综合卡片 |
| `12-Workflow-Operations` | 工作流运行视图、错误队列 |
| `13-Agent-Center` | Agent 卡片、状态指示、审计记录 |
| `14-Knowledge-Center-QA` | 知识问答、引用来源 |
| `15-Localization-Recommendation` | 替代料推荐、参数匹配 |
| `16-CEO-Daily-Summary` | 聚合 KPI、OIQ 指数、钻取入口 |
| 开发适配图 `01`-`10` | 角色路由、权限不足、Source Card 状态、审批、通知、搜索、状态组件、表格、解析、审计日志 |

## 11.3 与飞书妙搭的关系

若 Phase 1 在飞书妙搭内实现 Portal 原型：

- 色板应尽量使用飞书妙搭内置主题色。
- 组件优先使用飞书妙搭控件。
- 三纵列布局在飞书妙搭中可能受限，可简化为左导航 + 中央区的两列结构。
- SourceCard、AgentSuggestionCard、HumanApprovalPanel 保持核心逻辑一致，但实现方式以飞书妙搭为准。

## 11.4 版本演进

| 版本 | 内容 |
| --- | --- |
| V1.0 | 基于现有16+10+12张渲染图和5份UI文档提取，覆盖 Design Tokens + 核心组件 API + 权限展示规则 |
| V1.1+ | 待开发开始后，根据实际组件开发补充 Props 细节、变体截图和 Storybook 链接 |

---

## 附录A: 快速决策速查表

| 问题 | 答案 | 出处 |
| --- | --- | --- |
| 主色是什么？ | `#3B82F6` (Blue-500) | §2.1 |
| 左侧导航多宽？ | 280px | §3.2 |
| 右面板多宽？ | 420px | §3.2 |
| 用什么字体？ | Inter | §4.1 |
| 圆角多大？ | 卡片 8px，按钮 8px | §2.2 |
| 阴影多深？ | 卡片 `shadow-card` (0 1px 3px + 0 1px 2px) | §2.3 |
| 间距基准？ | 4px scale | §3.3 |
| 用什么图标库？ | Lucide (Heroicons 兼容) | §8.1 |
| 加载态用什么？ | Skeleton 骨架屏，不用 Spinner | §7.3 |
| 销售能看到供应商名吗？ | 不能，脱敏为 SR-XXX | §6.1 |
| Agent 建议必须有 source 吗？ | 是，无 source 禁止显示 | §5.2 |
| 支持移动端吗？ | P0 不强制，P1 再规划 | §10 |
| 动效多久？ | 150-300ms | §9.2 |

