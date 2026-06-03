# 77-Portal Design Token 规范 V1.0

**适用对象：** Codex、前端开发  
**版本：** V1.0  

---

```json
{
  "fontSize": {
    "caption": 12,
    "secondary": 12,
    "body": 14,
    "cardTitle": 16,
    "sectionTitle": 20,
    "pageTitle": 24
  },
  "spacing": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 24,
    "xxl": 32,
    "xxxl": 48
  },
  "radius": {
    "sm": 4,
    "md": 8,
    "lg": 12
  },
  "shadow": {
    "card": "0 1px 3px rgba(0,0,0,0.06)",
    "dropdown": "0 4px 12px rgba(0,0,0,0.08)",
    "modal": "0 8px 24px rgba(0,0,0,0.10)"
  },
  "color": {
    "brand": "#2B6FF2",
    "brandHover": "#1A5AD9",
    "success": "#10B981",
    "warning": "#F59E0B",
    "danger": "#EF4444",
    "bg": "#F0F2F5",
    "sidebar": "#F7F8FA",
    "card": "#FFFFFF",
    "textPrimary": "#1A1D26",
    "textSecondary": "#6B7280",
    "textTertiary": "#9CA3AF"
  },
  "icon": {
    "sm": 14,
    "md": 18,
    "lg": 24,
    "xl": 48
  },
  "grid": {
    "sidebar": 280,
    "panel": 400,
    "topbar": 48,
    "columns": 12
  }
}
```

### Tailwind 映射

| Token | Tailwind Class |
|-------|---------------|
| fontSize.body | `text-sm` |
| fontSize.cardTitle | `text-base` |
| fontSize.pageTitle | `text-xl` |
| spacing.lg | `p-4` |
| spacing.xl | `p-6` |
| radius.md | `rounded-lg` |
| shadow.card | `shadow-sm` |
