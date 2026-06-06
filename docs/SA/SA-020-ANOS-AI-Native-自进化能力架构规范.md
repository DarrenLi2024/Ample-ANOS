# SA-020 ANOS AI Native 自进化能力架构规范 V1.0

## ANOS AI Native Self-Evolving Capability Architecture

**document_id:** SA-020  
**title:** AI Native 自进化能力架构规范  
**version:** V1.0.0  
**status:** Active  
**owner:** LTDC  
**layer:** Solution Architecture  
**depends_on:** [SA-018, SA-019, GA-010, GA-011, GA-022]  
**created_at:** 2026-06-04

---

# 第一章 文档使命

定义 ANOS 作为 AI Native OS 的核心能力架构——如何从"功能型系统"升级为"可自进化的 AI 原生操作系统"。

回答：

```text
为什么 ANOS 不能采用传统页面功能型架构？

所有输入如何统一进入 Unified AI Inbox？

CommandBar 为什么必须是全局智能指令入口？

Command Session 为什么是系统核心数据单元？

Agent / Skill / Workflow / Tool Registry 的职责边界是什么？

新增能力如何通过 Registry 驱动而非代码改动？

路由机制如何从硬编码进化为三层智能路由？

高风险动作为什么必须用户确认？

Evaluation Loop 如何驱动系统自进化？
```

本规范是 ANOS 从 Phase 1 迈向 Phase 2 的**核心工程纲领**。

---

# 第二章 为什么不能采用传统页面功能型架构

## 2.1 传统架构的本质

```text
传统 ERP/CRM/BI 架构:
  URL → 页面 → 表单 → CRUD → 数据库
  
  用户操作 = 页面内点击
  系统能力 = 页面内功能
  数据流转 = 页面间跳转
```

## 2.2 传统架构在 AI 时代的问题

| 问题 | 后果 |
|------|------|
| 能力与页面绑定 | 换个页面就无法使用同一个AI能力 |
| 路由逻辑分散 | 每个页面各自处理输入，行为不一致 |
| 无会话概念 | AI处理完无记录，用户不知道发生了什么 |
| 新增能力需改代码 | 每次加Agent/Skill都要改前端+后端 |
| 无评估机制 | 不知道路由是否正确、Agent是否有效 |
| 无法自进化 | 系统能力上限=开发团队精力上限 |

## 2.3 ANOS 的正确架构

```text
ANOS AI Native 架构:
  任何输入 → Unified AI Inbox → Intent Router → Agent Registry 
  → Workflow Dispatcher → Skill Executor → Tool/API 
  → Command Session → Evaluation Loop → Capability Evolution
  
  用户操作 = 自然语言/截图/文件
  系统能力 = Registry 声明 + Workflow 编排
  数据流转 = Command Session 驱动
```

**核心差异：能力在 Registry 中而非在页面中。**

---

# 第三章 Unified AI Inbox — 统一输入入口

## 3.1 定义

Unified AI Inbox 是 ANOS 的全局智能入口。所有信息输入——无论来源、格式、页面——必须经过同一入口进入系统。

## 3.2 输入来源

```text
CommandBar          — 文本指令
AI Inbox            — 文本 + 文件 + 截图
工作台输入框         — 角色工作台内指令
截图粘贴 (Ctrl+V)   — 剪贴板图片
文件上传/拖拽        — Excel/PDF/图片
邮件转发 (Phase 2)  — 自动解析
飞书群消息 (Phase 2) — 群聊触发
ERP事件 (Phase 2)   — 系统事件
API Webhook (Phase 2)— 外部触发
```

## 3.3 统一入口原则

**无论用户在哪个页面、以何种方式输入，系统行为必须一致。**

禁止出现：

```text
❌ 首页输入有反馈，其他页面输入无反馈
❌ 文本输入走一个逻辑，截图走另一个逻辑
❌ 不同页面对同一输入产生不同结果
```

---

# 第四章 CommandBar — 全局智能指令入口

## 4.1 定位

CommandBar 不是页面内搜索框，不是页面内表单入口。它是 ANOS 的全局智能指令入口。

## 4.2 产品定义

> CommandBar 是安芯助手的全局智能指令入口，承担信息接收、意图识别、任务路由、业务执行与会话反馈的统一入口能力。它不是页面搜索框，也不是单页面录入控件，而是整个 AI Trading OS 的人机协作中枢。

## 4.3 架构要求

- CommandBar 必须由 WorkspaceLayout 统一渲染（不在各页面单独放置）
- 所有页面的 CommandBar 调用同一个 `GlobalCommandRouter`
- GlobalCommandRouter 接入 Intent Router → Agent Registry → Workflow Dispatcher
- 路由规则不得硬编码在前端页面

---

# 第五章 Command Session — 系统核心数据单元

## 5.1 定义

每次用户输入必须生成一条 Command Session。Command Session 是 ANOS 中 AI 行为的最小记录单元。

## 5.2 Session 结构

```typescript
interface CommandSession {
  session_id: string;           // SESS-{timestamp}
  user_id: string;              // 用户ID
  user_role: string;            // 用户角色
  source_page: string;          // 来源页面
  input_type: 'text' | 'image' | 'file' | 'clipboard' | 'voice';
  raw_input: string;            // 原始输入
  detected_intent: string;      // 识别意图
  matched_agent: string;        // 匹配Agent名称
  matched_agent_code: string;   // Agent编码 (GA-022: AGT-DOMAIN-ENV-SERIAL)
  matched_workflow: string;     // 匹配Workflow
  extracted_fields: Record<string, any>;  // 提取的结构化字段
  confidence_score: number;     // 置信度 (0-100)
  action_suggestions: string[]; // 建议操作
  execution_status: 'pending' | 'running' | 'completed' | 'failed' | 'requires_confirmation';
  user_confirmation: boolean | null;     // 用户确认状态
  routing_layer: 'keyword' | 'ai' | 'context';  // 路由层级
  source_timestamp: string;     // 信息源时间
  captured_timestamp: string;   // 系统录入时间
  completed_timestamp: string | null;  // 完成时间
}
```

## 5.3 Session 的价值

Command Session 让 AI 行为变成：

```text
可见 → 可追踪 → 可纠错 → 可审计 → 可复盘 → 可优化
```

---

# 第六章 Registry 体系 — 职责边界

## 6.1 四层 Registry

ANOS 的能力分为四个注册层级，各有明确职责：

| Registry | 职责 | 回答的问题 |
|----------|------|-----------|
| **Agent Registry** | 声明 AI 数字员工的岗位角色 | 谁能处理这件事？ |
| **Skill Registry** | 声明可复用的具体技能 | Agent 会哪些技能？ |
| **Workflow Registry** | 声明业务流程的步骤编排 | 这件事应该怎么做？ |
| **Tool Registry** | 声明底层可调用的工具/API | 需要调用哪些系统？ |

## 6.2 Agent Registry 结构 (GA-022编码: AGT-DOMAIN-ENV-SERIAL)

```yaml
- code: AGT-TRD-DEV-000001
  id: procurement-agent
  name: Procurement Agent
  type: Procurement
  status: active          # draft|testing|active|deprecated|archived
  version: v1.2.0
  owner: LTDC
  domain: trading
  priority: 10
  description: 供应信息解析、型号识别、批量入库
  endpoint: /api/agent-reasoning/procurement/parse-offer
  default_workflow: WFL-TRD-DEV-000001
  trigger_keywords: [供应, 现货, offer, 出, ...]
  trigger_patterns: ["[A-Z]{2,}\\d+[A-Z\\d\\-]*"]
  skills:
    - SKL-TRD-DEV-000001  # parse-offer
    - SKL-TRD-DEV-000002  # normalize-part-number
  permissions:
    can_read: [supply_resources, products]
    cannot_read: [customer_name, credit_limit]
  change_log:
    - "v1.2.0: 批量MPN入库"
    - "v1.1.0: 标准化输出"
```

## 6.3 Skill Registry 结构 (GA-022编码: SKL-DOMAIN-ENV-SERIAL)

```yaml
- code: SKL-TRD-DEV-000001
  id: parse-offer
  name: Offer 信息解析
  version: v1.1.0
  status: active
  owner: LTDC
  description: 从文本/截图/邮件中提取供应信息
  input_types: [text, image, email, clipboard]
  output_fields: [brand, part_number, quantity, price, date_code, lead_time]
```

## 6.4 Workflow Registry 结构 (GA-022编码: WFL-DOMAIN-ENV-SERIAL)

```yaml
- code: WFL-TRD-DEV-000001
  id: offer-intake-workflow
  name: Offer 信息入库与匹配流程
  version: v1.1.0
  status: active
  trigger_intents: [offer_parse, supply_capture]
  steps:
    - step: 1_parse
      skill: SKL-TRD-DEV-000001
      description: 解析供应信息
    - step: 5_save
      skill: write-offer-base
      require_user_confirm: true   # ← 写入需要用户确认
```

## 6.5 职责边界原则

- **Agent 是岗位角色** — 不直接包含实现逻辑
- **Skill 是具体能力** — 可被多个 Agent 复用
- **Workflow 是执行流程** — 编排 Skill 的执行顺序和条件
- **Tool 是底层调用** — API/数据库/外部服务

---

# 第七章 新增能力标准流程

## 7.1 新增 Agent 流程

```text
1. 需求提出       → 确实需要新的岗位角色
2. Agent 设计     → 定义 identity/responsibility/permission/endpoint
3. Registry 注册  → 在 agent-registry.yaml 添加声明
4. 绑定 Skill     → 关联已有 skill 或创建新 skill
5. 绑定 Workflow  → 指定 default_workflow
6. 权限绑定       → 声明 can_read / cannot_read
7. 测试验证       → 通过 /api/agent-registry/match 验证路由
8. 灰度启用       → status: testing → active
```

## 7.2 新增 Skill 流程

```text
1. 判断是否可复用已有 Skill
2. 若有 → 直接关联到 Agent，无需新建
3. 若无 → 在 skill-registry.yaml 添加声明
4. 定义 input_types / output_fields
5. 实现对应 API 端点
6. 关联到 Agent
```

## 7.3 新增 Workflow 流程

```text
1. 定义流程步骤
2. 每个 Step 绑定一个 Skill
3. 标记 require_user_confirm 的步骤
4. 在 workflow-registry.yaml 注册
5. Agent 的 default_workflow 指向它
```

## 7.4 核心原则

**新增能力 = 配置变更，而非代码变更。**

---

# 第八章 三层智能路由机制

## 8.1 路由架构

```text
Unified AI Inbox
  ↓
Input Normalizer (标准化输入格式)
  ↓
Intent Router
  ├── Layer 1: Rule Match (关键词 + 正则模式)
  ├── Layer 2: AI Intent Classifier (LLM 判断意图 + 实体提取)
  └── Layer 3: Context Weighting (当前角色 + 所在页面)
  ↓
Agent Matcher (从 Registry 匹配最佳 Agent)
  ↓
Workflow Dispatcher (分发到对应 Workflow)
  ↓
Command Session (生成会话记录)
```

## 8.2 Layer 1: Rule Match

适用场景：明确的关键词/模式匹配。

```text
"出MT53..." → 关键词 "出" + MPN 模式 → Supply Agent (score: 30)
"查询逾期" → 关键词 "逾期" "查询" → Credit Agent (score: 20)
```

**仅作为第一层快速路由，不能作为唯一判断依据。**

## 8.3 Layer 2: AI Intent Classifier

适用场景：关键词模糊、多意图混合的输入。

由 LLM 判断真实意图并提取实体：

```text
输入: "TI TPS5430DDAR 3000pcs 现货 24+ 0.82usd"
AI判断: 供应信息 (Supply) | 实体: {mpn: TPS5430DDAR, qty: 3000, price: 0.82, dc: 24+}
```

## 8.4 Layer 3: Context Weighting

结合当前用户角色和所在页面加权：

| 角色 | 页面 | 输入型号 | 加权倾向 |
|------|------|---------|---------|
| Sales | Sales工作台 | STM32F407 | +Demand (可能是在查需求) |
| Buyer | Buyer工作台 | STM32F407 | +Supply (可能是在找供应) |
| Finance | 财务页 | C-008 | +Risk (可能是在查AR) |

## 8.5 路由结果记录

每个路由决策记录：

```text
routing_layer: 'keyword' | 'ai' | 'context'
confidence_score: 0-100
matched_agent_code: AGT-TRD-DEV-000001
```

---

# 第九章 高风险动作必须用户确认

## 9.1 需要确认的操作

| 操作类型 | require_user_confirm |
|---------|:---:|
| 创建 Inquiry / SupplyResource | false |
| **写入 Offer Base** | **true** |
| **发送正式报价** | **true** |
| **创建采购订单** | **true** |
| **冻结客户信用** | **true** |
| **删除数据** | **true** |
| **推送外部系统 (ERP/飞书)** | **true** |
| 查询/检索 | false |
| 导航跳转 | false |

## 9.2 确认机制

Workflow Step 中标记 `require_user_confirm: true` 的步骤，
执行前必须：

1. 暂停 Workflow 执行
2. 在 Command Session 中展示待确认信息
3. 等待用户显式确认（点击"确认"/"驳回"按钮）
4. 记录确认结果
5. 继续或中止后续步骤

---

# 第十章 Evaluation Loop — 系统自进化核心

## 10.1 定义

Evaluation Loop 是 ANOS 系统自进化的闭环机制。每次 Command Session 完成后，系统自动评估执行质量并反馈到 Registry 优化中。

## 10.2 评估维度

```text
1. 路由准确率     — Intent Router 是否正确匹配了 Agent
2. Agent 响应质量  — Agent 返回的结论/依据/置信度是否合理
3. Workflow 完成度 — Workflow 是否完整执行所有步骤
4. 用户确认率     — 用户对建议操作的确认/驳回比例
5. 响应时间       — 从输入到反馈的端到端延迟
6. 数据质量       — 提取的结构化字段与实际是否一致
```

## 10.3 反馈机制

```text
Command Session 完成
  ↓
Evaluation Loop 评估
  ↓
生成评估报告 (session_id + scores)
  ↓
低质量 → 标记为 Review → 人工介入优化
高质量 → 记录为 Positive Example → 训练/规则参考
  ↓
Registry 参数调整 (关键词权重 / 优先级)
```

## 10.4 进化路径

```text
L1: 硬编码路由          (当前 → L2)
L2: Registry 驱动       (当前状态)
L3: AI 辅助路由         (Phase 2)
L4: 自动权重调优        (Phase 2)
L5: 自进化闭环          (Phase 3)
```

---

# 第十一章 推荐目录结构

```text
src/
  ai-native/
    inbox/
      ai-inbox.service.ts          # Unified AI Inbox 服务
      input-normalizer.ts           # 输入标准化
      command-session.store.ts      # Session 存储

    router/
      intent-router.ts              # 三层路由引擎
      agent-matcher.ts              # Agent 匹配
      workflow-dispatcher.ts        # Workflow 分发

    registry/
      agent-registry.yaml           # Agent 注册表
      skill-registry.yaml           # Skill 注册表
      workflow-registry.yaml        # Workflow 注册表
      tool-registry.yaml            # Tool 注册表
      registry-loader.ts            # 统一加载器
      registry-validator.ts         # 格式校验器

    evaluation/
      routing-evaluator.ts          # 路由准确率评估
      workflow-evaluator.ts         # Workflow 执行评估
      feedback-log.ts               # 反馈日志

    sessions/
      command-session.types.ts      # Session 类型定义

  agents/
    registry/                       # Agent 注册中枢
    skills/                         # Skill 实现目录

  workflows/
    definitions/                    # Workflow 定义文件
```

---

# 第十二章 API 设计

| 端点 | 方法 | 用途 |
|------|------|------|
| `/api/agent-registry` | GET | 列出所有已注册 Agent |
| `/api/agent-registry/match` | POST | 根据输入内容匹配 Agent |
| `/api/workflow-engine/list` | GET | 列出所有 Workflow |
| `/api/workflow-engine/execute` | POST | 执行指定 Workflow |
| `/api/agent-reasoning/{agent}/...` | POST | 各 Agent 的业务端点 |
| `/api/inbox/submit` | POST | AI Inbox 提交入口 |
| `/api/sessions` | GET | 查询 Command Session 历史 |

---

# 第十三章 验收标准

| 验收项 | 标准 | 验证方式 |
|--------|------|---------|
| **Registry 完整性** | 4个 Registry 全部加载成功 | GET /api/agent-registry → 6 agents |
| **路由准确性** | 已知输入正确匹配 Agent | POST /api/agent-registry/match |
| **Session 完整性** | 每次输入生成 Session | localStorage anos_command_sessions |
| **跨页面一致性** | 所有页面行为统一 | 在3个不同页面输入同一指令 |
| **Agent 可扩展** | 新增 Agent 无需改代码 | 在 agent-registry.yaml 添加 draft agent |
| **Workflow 可编排** | Workflow步骤可执行 | POST /api/workflow-engine/execute |
| **写入需确认** | require_user_confirm 拦截 | Workflow 在入库步骤暂停 |

---

# 第十四章 与其他文档的关系

```text
SA-020 (本规范) — 自进化能力架构总纲
  ├── GA-022 企业智能资产编码规范 — 资产编码标准
  ├── SA-018 AI 交易智能模型 — 八层价值链
  ├── SA-019 AI Native 价值工作台规范 — Portal 设计
  ├── GA-010 交易防火墙 — 权限隔离
  ├── GA-011 角色权限矩阵 — 字段级脱敏
  └── SA-005 Agent 操作系统规范 — Agent 标准模型
```

---

# 第十五章 能力成熟度路线图

```text
Phase 1 (已完成):
  ✅ 4个 Agent (Procurement/Sales/Credit/Knowledge)
  ✅ Unified AI Inbox (InboxProvider)
  ✅ Agent Registry (agent-registry.yaml)
  ✅ Skill Registry (skill-registry.yaml)
  ✅ Workflow Registry (workflow-registry.yaml)
  ✅ Tool Registry (tool-registry.yaml)
  ✅ Command Session (types + store)
  ✅ WorkspaceLayout 统一 CommandBar

Phase 2 (规划中):
  ⬜ AI Intent Classifier (LLM 意图识别)
  ⬜ Context Weighting (角色+页面加权)
  ⬜ Evaluation Loop (路由+执行评估)
  ⬜ Agent 灰度发布
  ⬜ Workflow 可视化编辑器

Phase 3 (愿景):
  ⬜ 自动权重调优
  ⬜ 自进化闭环
  ⬜ 组织智能图谱
  ⬜ 跨域 Agent 协作
```

---

# 第十六章 禁止事项

```text
❌ 在页面中硬编码 Agent 路由逻辑
❌ 在页面中直接调用 Agent API（必须经过 Router）
❌ 不经过 InboxProvider 直接处理用户输入
❌ 无 Session 记录的处理
❌ 无 Owner 的 Agent
❌ 无版本号的 Agent
❌ 绕过 require_user_confirm 的写入操作
❌ 跨域数据直接暴露（必须脱敏）
```

---

# 第十七章 自进化能力架构金律

1. 所有输入统一进入 Unified AI Inbox
2. CommandBar 是全局智能指令入口
3. 每次输入必须生成 Command Session
4. Agent / Skill / Workflow 必须通过 Registry 注册
5. 新增能力 = 配置变更，非代码变更
6. 路由机制 = Rule Match + AI Intent + Context Weighting
7. 高风险操作必须用户确认
8. Evaluation Loop 是系统进化的核心
9. 一个资产一个编码 (GA-022)
10. ANOS 是 AI Native OS，不是页面功能型系统
