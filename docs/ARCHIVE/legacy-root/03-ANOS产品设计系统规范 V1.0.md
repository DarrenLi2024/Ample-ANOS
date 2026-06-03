# 03-ANOS 产品设计系统规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）
**文档定位：** 全局Design System / 视觉统一标准
**上游文档：** [00-ANOS总体架构设计白皮书V1.0.md](00-ANOS总体架构设计白皮书V1.0.md)、[11-ANOS Portal 三纵列工作台设计规范 V1.0.md](11-ANOS%20Portal%20三纵列工作台设计规范%20V1.0.md)
**适用对象：** Codex、Claude、前端开发、产品设计
**版本：** V1.0
**状态：** 设计基线

---

## 目录

- 第1章 Typography（字体系统）
- 第2章 Spacing（间距系统）
- 第3章 Radius（圆角系统）
- 第4章 Shadow（阴影系统）
- 第5章 Color Token（色彩系统）
- 第6章 Icon（图标规范）
- 第7章 Grid（网格系统）
- 第8章 Button（按钮规范）
- 第9章 Card（卡片规范）
- 第10章 禁止事项

---

# 第1章 Typography（字体系统）

## 1.1 六级字号体系

**全局基准：16px**

| 层级 | Token | Size | Line Height | Weight | 用途 |
|------|-------|------|-------------|--------|------|
| H1 | `text-2xl` | 24px | 1.2 | 600 | 页面主标题 |
| H2 | `text-xl` | 20px | 1.25 | 600 | 区块标题 |
| H3 | `text-base` | 16px | 1.3 | 500 | 卡片标题 / TopBar |
| Body | `text-sm` | 14px | 1.5 | 400 | 正文 / 表格内容 |
| Secondary | `text-xs` | 12px | 1.4 | 400 | 辅助信息 / 标签 |
| Caption | `text-xs` | 12px | 1.3 | 500 | Badge / 标注 |

## 1.2 字体族

```css
--font-sans: 'PingFang SC', 'Microsoft YaHei', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

## 1.3 严格禁止

- ❌ 禁止使用 `text-[13px]`、`text-[15px]`、`text-[17px]` 等硬编码任意值
- ❌ 禁止同一页面出现超过 4 种字号
- ❌ 禁止表格/卡片/正文混用不同字号

---

# 第2章 Spacing（间距系统）

## 2.1 八级间距（4px 基准）

| Token | Value | 用途 |
|-------|-------|------|
| `space-1` | 4px | 图标与文字间距 |
| `space-2` | 8px | 标签内间距 |
| `space-3` | 12px | 列表项间距 |
| `space-4` | 16px | 卡片内边距 |
| `space-6` | 24px | 区块间距 |
| `space-8` | 32px | 章节间距 |
| `space-12` | 48px | 页面垂直间距 |
| `space-16` | 64px | 大区块间距 |

## 2.2 Tailwind 映射

```css
p-1 → 4px
p-2 → 8px
p-3 → 12px
p-4 → 16px
p-6 → 24px
p-8 → 32px
```

## 2.3 严格禁止

- ❌ 禁止 `p-[13px]`、`m-[7px]` 等硬编码间距
- ❌ 禁止同一组件内使用非标准间距值

---

# 第3章 Radius（圆角系统）

## 3.1 三级圆角

| Token | Value | Tailwind | 用途 |
|-------|-------|----------|------|
| `radius-sm` | 4px | `rounded-sm` | Badge、Tag、小按钮 |
| `radius-md` | 8px | `rounded-lg` | 卡片、输入框、大按钮 |
| `radius-lg` | 12px | `rounded-xl` | 面板、弹窗 |

## 3.2 严格禁止

- ❌ 禁止 `rounded-[6px]`、`rounded-[10px]` 任意值

---

# 第4章 Shadow（阴影系统）

## 4.1 三级阴影

| Token | Value | 用途 |
|-------|-------|------|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` | 卡片 |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | 悬浮面板、下拉菜单 |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.10)` | 弹窗 |

## 4.2 严格禁止

- ❌ 禁止自定义 box-shadow 值

---

# 第5章 Color Token（色彩系统）

## 5.1 品牌色

```css
--color-brand-50:  #EBF1FF;
--color-brand-100: #D6E4FF;
--color-brand-500: #2B6FF2;  /* 主色 */
--color-brand-600: #1A5AD9;  /* Hover */
--color-brand-700: #1447B0;  /* Active */
```

## 5.2 语义色

| Token | Value | 用途 |
|-------|-------|------|
| `--color-success` | `#10B981` | 成功/健康/已确认 |
| `--color-warning` | `#F59E0B` | 警告/待处理 |
| `--color-danger` | `#EF4444` | 危险/错误/逾期 |
| `--color-info` | `#3B82F6` | 信息/提示 |

## 5.3 背景色

```css
--bg-app:     #F0F2F5;  /* 整体页面背景 */
--bg-sidebar: #F7F8FA;  /* 侧边栏 */
--bg-card:    #FFFFFF;  /* 卡片 */
--bg-hover:   #F3F4F6;  /* 悬停态 */
```

## 5.4 文字色

```css
--text-primary:   #1A1D26;  /* 主要文字 */
--text-secondary: #6B7280;  /* 次要文字 */
--text-tertiary:  #9CA3AF;  /* 占位/禁用 */
--text-link:      #2B6FF2;  /* 链接 */
```

## 5.5 严格禁止

- ❌ 禁止使用 `#3a86ff`、`#2f7fff` 等与 Token 值相近的自定义色
- ❌ 禁止同一颜色在多个 Token 间混用

---

# 第6章 Icon（图标规范）

## 6.1 图标库

统一使用 **Lucide Icons** (`lucide-react`)

## 6.2 尺寸

| Token | Size | 用途 |
|-------|------|------|
| `icon-sm` | 14px | 行内图标 |
| `icon-md` | 18px | 导航/按钮图标 |
| `icon-lg` | 24px | 卡片/面板图标 |
| `icon-xl` | 48px | 空状态图标 |

## 6.3 颜色

图标颜色继承父元素 `text-*` class。

---

# 第7章 Grid（网格系统）

## 7.1 全局网格

```css
/* 12列栅格 */
grid-cols-1  → 全宽
grid-cols-2  → 双列
grid-cols-3  → 三列
grid-cols-4  → 四列 (KPI卡片)
```

## 7.2 全局布局

```css
/* 三纵列 */
sidebar: 280px
main:    flex-1 (弹性)
panel:   400px
```

---

# 第8章 Button（按钮规范）

## 8.1 四级按钮

| 变体 | Class | 用途 |
|------|-------|------|
| Primary | `btn-primary` | 主要操作 (品牌蓝) |
| Outline | `btn-outline` | 次要操作 (灰色边框) |
| Ghost | `btn-ghost` | 弱操作 (无边框) |
| Danger | `btn-primary bg-red-500` | 危险操作 |

## 8.2 统一高度

所有按钮 `py-2` (8px 上下内边距) `text-sm` (14px)。

---

# 第9章 Card（卡片规范）

## 9.1 统一卡片 Class

```css
.proto-card          /* 基础卡片 */
.proto-card-accent   /* 渐变蓝顶线卡片 */
```

## 9.2 用途

- `.proto-card`: 普通数据区域
- `.proto-card-accent`: 重要信息/Agent建议/SourceCard

---

# 第10章 禁止事项

## 10.1 全局禁止

| # | 禁止行为 | 替代方案 |
|---|---------|---------|
| 1 | `text-[Npx]` 任意字号 | 使用 Tailwind 原生 `text-xs/sm/base/xl/2xl` |
| 2 | `p-[Npx]` 任意间距 | 使用标准 `p-1~p-8` |
| 3 | `rounded-[Npx]` 任意圆角 | 使用 `rounded-sm/lg/xl` |
| 4 | 自定义 `#XXXXXX` 颜色 | 使用 `text-brand-*/text-gray-*` |
| 5 | 内联 `style={{}}` | 使用 className |
| 6 | 同一页面超过 4 种字号 | 最多 H1/H2/H3/Body |
| 7 | 自定义 box-shadow | 使用 Tailwind shadow-* |
