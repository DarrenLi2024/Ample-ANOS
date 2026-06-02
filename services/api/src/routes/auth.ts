/**
 * 认证路由 — Token 签发 + 刷新
 */
import { Hono } from 'hono';
import { signToken, jwtAuth } from '../middleware/jwt';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';

const devTokenSchema = z.object({
  userId: z.string().default('dev-user'),
  name: z.string().default('Dev User'),
  role: z.enum(['Sales', 'Procurement', 'Risk', 'Operations', 'SystemAdmin', 'CEO']),
  department: z.string().default('Development'),
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const authRoutes = new Hono();

// POST /api/auth/dev-token — 开发环境签发测试 Token
authRoutes.post('/dev-token', validateBody(devTokenSchema), async (c) => {
  if (process.env.NODE_ENV === 'production') {
    return c.json({ error: { code: 'FORBIDDEN', message: '生产环境不允许 dev-token' } }, 403);
  }

  const body = c.get('validatedBody') as z.infer<typeof devTokenSchema>;
  const token = signToken({
    sub: body.userId,
    name: body.name,
    role: body.role,
    department: body.department,
  });

  return c.json({
    token,
    expiresIn: 86400,
    user: {
      userId: body.userId,
      name: body.name,
      role: body.role,
      department: body.department,
    },
  });
});

// POST /api/auth/login — 简化登录 (Phase 2 替换为飞书 SSO)
authRoutes.post('/login', validateBody(loginSchema), async (c) => {
  const { username, password } = c.get('validatedBody') as z.infer<typeof loginSchema>;

  // Phase 1 演示用户表（硬编码，Phase 2 替换为数据库查询）
  const DEMO_USERS: Record<string, { password: string; name: string; role: string; department: string }> = {
    sales1: { password: 'anos2026', name: '销售试点', role: 'Sales', department: '销售部' },
    proc1: { password: 'anos2026', name: '采购试点', role: 'Procurement', department: '采购部' },
    risk1: { password: 'anos2026', name: '风控试点', role: 'Risk', department: '财务部' },
    ceo: { password: 'anos2026', name: '管理层', role: 'CEO', department: '管理层' },
    admin: { password: 'anos2026', name: '系统管理员', role: 'SystemAdmin', department: 'IT部' },
  };

  const user = DEMO_USERS[username];
  if (!user || user.password !== password) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: '用户名或密码错误' } }, 401);
  }

  const token = signToken({
    sub: username,
    name: user.name,
    role: user.role as any,
    department: user.department,
  });

  return c.json({
    token,
    expiresIn: 86400,
    user: { userId: username, name: user.name, role: user.role, department: user.department },
  });
});

// GET /api/auth/me — 当前用户信息
authRoutes.get('/me', jwtAuth, async (c) => {
  const user = c.get('user');
  return c.json(user);
});

// POST /api/auth/refresh — Token 刷新 (Phase 2)
authRoutes.post('/refresh', jwtAuth, async (c) => {
  const user = c.get('user');
  const token = signToken({
    sub: user.userId,
    name: user.name,
    role: user.role,
    department: user.department,
  });
  return c.json({ token, expiresIn: 86400 });
});
