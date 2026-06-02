# ANOS Design System V2.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** 完整设计系统规范 — Apple 风格 AI Native 工作台  
**上游文档：** [design.md](design.md)、[Portal界面渲染图/README.md](Portal界面渲染图/README.md)  
**版本：** V2.0  
**状态：** 设计基线（替代 design.md V1.0）

---

## 目录

- 第1章 设计理念
- 第2章 色彩系统
- 第3章 字体系统
- 第4章 间距与排版
- 第5章 阴影与发光
- 第6章 圆角与边框
- 第7章 动画系统
- 第8章 组件规范
- 第9章 布局系统
- 第10章 氛围与环境
- 第11章 侧边栏
- 第12章 登录页
- 附录A CSS变量速查

---

# 第1章 设计理念

## 1.1 核心美学

ANOS V2.0 采用 **Apple Human Interface** 风格设计语言：

```
克制 · 通透 · 轻盈 · 精确
```

| 原则 | 说明 |
|------|------|
| **Clarity** | 信息层次清晰，留白充足，不堆砌元素 |
| **Depth** | 通过阴影、毛玻璃、渐变营造纵深而非平面 |
| **Fluidity** | 动画流畅自然，过渡不超过 300ms |
| **Breathing** | 卡片之间有充分呼吸空间，不拥挤 |
| **Precision** | 间距、字重、颜色精确到 px |

## 1.2 与 V1.0 的差异

| V1.0 (旧) | V2.0 (新) |
|-----------|-----------|
| 深色侧边栏 #0b1020 | 浅色 Apple 灰白 #f5f5f7 |
| 蓝色主色 #3B82F6 | 蓝紫渐变 #6366f1 → #7c3aed |
| 普通卡片 white bg | 玻璃质感 + 渐变顶线 + 悬停动画 |
| 基础按钮 | 渐变呼吸动画 + 精致边框 |
| 3级阴影 | 6级阴影 + 发光效果 |
| 系统字体 | SF Pro Display + PingFang SC |
| 无环境光 | 全局环境光（暖紫+冷蓝+网格纹理） |

---

# 第2章 色彩系统

## 2.1 深色体系

```css
--color-deep:      #0b1020;   /* 最深色（侧边栏底色、极强调） */
--color-deep-alt:  #141929;   /* 深色变体（卡片深色背景） */
--color-deep-hover: #1a2036;  /* 深色悬停 */
```

## 2.2 浅色体系（Apple 风格灰白）

```css
--color-light:     #f5f5f7;   /* 主背景（Apple 系统灰白） */
--color-surface:   #ffffff;   /* 卡片/面板纯白表面 */
--color-surface-alt: #fafafa; /* 次级表面 */
--color-border:    #e5e5ea;   /* 浅色边框 */
--color-border-light: #f0f0f2; /* 极浅边框 */
```

## 2.3 品牌色 — 蓝紫渐变

```css
--color-brand:       #6366f1;  /* Indigo-500 蓝色端 */
--color-brand-alt:   #7c3aed;  /* Violet-600 紫色端 */
--color-brand-light: #818cf8;  /* Indigo-400 浅蓝紫 */
--color-brand-dark:  #4f46e5;  /* Indigo-600 深蓝紫 */
--color-brand-ghost: rgba(99, 102, 241, 0.08); /* 品牌色透明背景 */

/* 渐变 */
--gradient-brand:       linear-gradient(135deg, #6366f1, #7c3aed);
--gradient-brand-hover: linear-gradient(135deg, #4f46e5, #6d28d9);
--gradient-brand-subtle: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(124,58,237,0.06));
```

## 2.4 语义色

```css
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-danger:  #ef4444;
--color-info:    #3b82f6;
```

## 2.5 文字色

```css
--text-primary:    #1d1d1f;   /* 主文字 */
--text-secondary:  #6e6e73;   /* 次级文字 */
--text-tertiary:   #aeaeb2;   /* 三级文字 */
--text-placeholder: #c7c7cc;  /* 占位符 */
--text-inverse:    #ffffff;   /* 反色 */
```

## 2.6 环境光色

```css
--ambient-warm:  rgba(139, 92, 246, 0.04);  /* 左上暖紫 */
--ambient-cool:  rgba(59, 130, 246, 0.04);  /* 右下冷蓝 */
```

---

# 第3章 字体系统

## 3.1 字体栈

```css
--font-display: 'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif;
--font-body:    'SF Pro Text', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
--font-mono:    'SF Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

## 3.2 字号

```css
--fs-caption: 0.6875rem;  /* 11px Badge/标签 */
--fs-xs:      0.75rem;    /* 12px 辅助文字 */
--fs-sm:      0.8125rem;  /* 13px 次级信息 */
--fs-base:    0.875rem;   /* 14px 正文基准 */
--fs-lg:      1rem;       /* 16px 卡片标题 */
--fs-xl:      1.125rem;   /* 18px 区块标题 */
--fs-2xl:     1.25rem;    /* 20px 页面标题 */
--fs-3xl:     1.5rem;     /* 24px 大标题 */
--fs-4xl:     2rem;       /* 32px KPI 数字 */
```

## 3.3 字重

```css
--fw-normal:   400;
--fw-medium:   500;   /* 常用：卡片标题、按钮 */
--fw-semibold: 590;   /* SF Pro Display 特有的 590 weight */
--fw-bold:     600;
```

## 3.4 字距

```css
--tracking-tight:  -0.02em;  /* 紧凑字距（标题、KPI） */
--tracking-normal: 0;
--tracking-wide:   0.04em;   /* 宽字距（导航标签） */
```

## 3.5 排版层级

| 层级 | 字号 | 字重 | 字距 | 行高 | 用途 |
|------|------|------|------|------|------|
| H1 | 20px | 590 | -0.02em | 1.2 | 页面标题 |
| H2 | 18px | 590 | -0.02em | 1.2 | 区块标题 |
| H3 | 16px | 500 | -0.01em | 1.3 | 卡片标题 |
| Body | 14px | 400 | 0 | 1.5 | 正文 |
| Caption | 12px | 400 | 0 | 1.4 | 辅助信息 |
| KPI | 32px | 590 | -0.02em | 1.1 | 核心数字 |

---

# 第4章 间距与排版

## 4.1 间距 Scale（4px 基准）

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

## 4.2 常用间距

| 场景 | 值 |
|------|-----|
| 卡片内边距 | 20px |
| 区块间距 | 24px |
| 页面水平边距 | 32px |
| 列表项间距 | 12px |
| 按钮内边距 | 10px 20px |
| 输入框内边距 | 12px 16px |

---

# 第5章 阴影与发光

## 5.1 6 级阴影

```css
/* 基础阴影 */
--shadow-xs:  0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.12);
```

## 5.2 发光效果

```css
--glow:    0 0 20px rgba(124, 58, 237, 0.15);    /* 品牌紫发光 */
--glow-sm: 0 0 10px rgba(99, 102, 241, 0.12);    /* 浅发光 */
```

---

# 第6章 圆角与边框

```css
--radius-xs:  4px;     /* 小标签 */
--radius-sm:  6px;     /* 按钮 */
--radius-md:  10px;    /* 卡片 */
--radius-lg:  14px;    /* 面板 */
--radius-xl:  20px;    /* 大容器 */
--radius-full: 9999px;
```

---

# 第7章 动画系统

## 7.1 缓动函数

```css
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1);    /* 苹果风格弹性缓出 */
--ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* 弹性 */
```

## 7.2 时长

```css
--duration-fast:   150ms;
--duration-normal: 250ms;
--duration-slow:   400ms;
--duration-breath: 3s;       /* 呼吸动画周期 */
```

## 7.3 动画定义

```css
/* 页面入场 — 从下方淡入 */
@keyframes animate-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 按钮呼吸 — 渐变光晕 */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

/* 骨架屏微光 */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 柔和脉冲 */
@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.7; }
}
```

---

# 第8章 组件规范

## 8.1 卡片系统

### card-gradient（玻璃质感 + 渐变顶线）

```css
.card-gradient {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}
.card-gradient::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--gradient-brand);
}
```

### card-glass（毛玻璃背景）

```css
.card-glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

### card-hover（悬停动画）

```css
.card-hover {
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

## 8.2 按钮系统

### btn-primary（渐变蓝紫 + 呼吸动画）

```css
.btn-primary {
  background: var(--gradient-brand);
  background-size: 200% 200%;
  color: white;
  font-weight: var(--fw-medium);
  font-size: var(--fs-sm);
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  animation: gradientShift var(--duration-breath) ease infinite;
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}
.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: var(--glow-sm);
}
.btn-primary:active {
  transform: scale(0.98);
}
```

### btn-secondary（精致边框 + 悬浮阴影）

```css
.btn-secondary {
  background: var(--color-surface);
  color: var(--text-primary);
  font-weight: var(--fw-medium);
  font-size: var(--fs-sm);
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}
.btn-secondary:hover {
  border-color: var(--color-brand-light);
  box-shadow: var(--shadow-md);
}
```

## 8.3 输入框

```css
.input {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  font-size: var(--fs-base);
  color: var(--text-primary);
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}
.input:focus {
  outline: none;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-ghost);
}
```

---

# 第9章 布局系统

## 9.1 全局布局

```text
┌─────────────────────────────────────────────────────────────┐
│                         Top Bar (48px)                      │
├────────────┬──────────────────────┬─────────────────────────┤
│ Left Nav   │   Main Workspace     │    Context Panel        │
│ (280px)    │   (flex: 1)          │    (420px)              │
├────────────┴──────────────────────┴─────────────────────────┤
│                    Bottom Command Bar (56px)                  │
└─────────────────────────────────────────────────────────────┘

全局背景: var(--color-light) (#f5f5f7)
环境光: 径向渐变左上暖紫 + 右下冷蓝 + 网纹纹理
```

## 9.2 环境光实现

```css
body::before {
  content: '';
  position: fixed;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background:
    radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.04) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 50%),
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px);
  pointer-events: none;
  z-index: 0;
}
```

## 9.3 尺寸常量

```css
--sidebar-width:       280px;
--sidebar-collapsed:   64px;
--panel-width:         420px;
--topbar-height:       48px;
--commandbar-height:   56px;
--content-max-width:   1400px;
```

## 9.4 响应式

P0 优先桌面 1280px+。断点：

```css
--breakpoint-sm:  640px;
--breakpoint-md:  768px;
--breakpoint-lg:  1024px;
--breakpoint-xl:  1280px;
```

---

# 第10章 氛围与环境

## 10.1 全局背景

```css
body {
  background: var(--color-light);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--fs-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

## 10.2 网格纹理

```css
.grid-texture {
  background-image:
    linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

---

# 第11章 侧边栏

## 11.1 视觉规范

```css
.sidebar {
  background: var(--color-deep); /* #0b1020 */
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

/* Logo 区 — 渐变文字 */
.sidebar-logo {
  font-family: var(--font-display);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-xl);
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: var(--tracking-tight);
}

/* 导航项 */
.sidebar-item {
  color: rgba(255, 255, 255, 0.55);
  transition: all var(--duration-fast) var(--ease-out);
  border-radius: var(--radius-sm);
  margin: 0 var(--space-2);
}
.sidebar-item:hover {
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.06);
}

/* 活跃指示器 — 蓝紫竖线 */
.sidebar-item.active {
  color: white;
  background: rgba(99, 102, 241, 0.15);
  border-left: 2px solid #818cf8;
}
```

## 11.2 折叠箭头

```css
.sidebar-toggle {
  color: rgba(255, 255, 255, 0.4);
  transition: all var(--duration-fast) var(--ease-out);
}
.sidebar-toggle:hover {
  color: rgba(255, 255, 255, 0.8);
}
.sidebar-toggle svg {
  transition: transform var(--duration-normal) var(--ease-out);
}
```

---

# 第12章 登录页

## 12.1 布局

```
┌────────────────────────────────────────┐
│                                        │
│         ┌────────────────────┐         │
│         │   🔷 渐变图标       │         │
│         │   ANOS             │         │
│         │   测试登录          │         │
│         │   ┌──────────────┐ │         │
│         │   │ 用户名        │ │         │
│         │   └──────────────┘ │         │
│         │   ┌──────────────┐ │         │
│         │   │ 密码         │ │         │
│         │   └──────────────┘ │         │
│         │   [登录按钮]       │         │
│         │   红色错误提示      │         │
│         └────────────────────┘         │
│         居中玻璃卡片                    │
└────────────────────────────────────────┘
```

## 12.2 玻璃卡片

```css
.login-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  padding: var(--space-12);
  max-width: 400px;
  width: 100%;
}
```

## 12.3 渐变图标

```css
.login-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
}
```

## 12.4 错误提示

```css
.login-error {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-sm);
  color: #dc2626;
  font-size: var(--fs-xs);
  padding: var(--space-2) var(--space-4);
  text-align: center;
}
```

---

## 附录A CSS变量速查

```css
:root {
  /* 色彩 */
  --color-deep: #0b1020;
  --color-light: #f5f5f7;
  --color-surface: #ffffff;
  --color-border: #e5e5ea;
  --color-brand: #6366f1;
  --color-brand-alt: #7c3aed;

  /* 字体 */
  --font-display: 'SF Pro Display', -apple-system, sans-serif;
  --font-body: 'SF Pro Text', -apple-system, 'PingFang SC', sans-serif;
  --font-mono: 'SF Mono', 'JetBrains Mono', monospace;
  --tracking-tight: -0.02em;

  /* 动画 */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-breath: 3s;

  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.06);
  --glow: 0 0 20px rgba(124,58,237,0.15);
}
```
