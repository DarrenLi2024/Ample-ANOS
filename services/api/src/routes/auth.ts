/**
 * 认证路由 — Token 签发 + 刷新
 * 试点用户: 销售2人 + 采购2人 + 风控1人 = 5人 + 管理员
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

// POST /api/auth/login — P0试点用户
authRoutes.post('/login', validateBody(loginSchema), async (c) => {
  const { username, password } = c.get('validatedBody') as z.infer<typeof loginSchema>;

  // P0 试点用户表: 销售2人 + 采购2人 + 风控1人 + 管理层1人 + 管理员1人 = 6人
  // (CEO用于管理层验收视角)
  const PILOT_USERS: Record<string, { password: string; name: string; role: string; department: string }> = {
    admin:    { password: 'anos2026', name: '系统管理员', role: 'SystemAdmin', department: 'IT部' },
    sales1:   { password: 'anos2026', name: '销售试点-1', role: 'Sales', department: '销售部' },
    sales2:   { password: 'anos2026', name: '销售试点-2', role: 'Sales', department: '销售部' },
    proc1:    { password: 'anos2026', name: '采购试点-1', role: 'Procurement', department: '采购部' },
    proc2:    { password: 'anos2026', name: '采购试点-2', role: 'Procurement', department: '采购部' },
    risk1:    { password: 'anos2026', name: '风控试点', role: 'Risk', department: '财务部' },
    ceo:      { password: 'anos2026', name: '管理层', role: 'CEO', department: '管理层' },
  };

  const user = PILOT_USERS[username];
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

// GET /api/auth/me
authRoutes.get('/me', jwtAuth, async (c) => {
  const user = c.get('user');
  return c.json(user);
});

// POST /api/auth/refresh
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
