/**
 * 飞书扫码登录 — OAuth2.0 认证
 * 
 * 流程:
 *   1. 前端 → GET /api/auth/feishu/login → 返回飞书授权URL
 *   2. 用户扫码授权 → 飞书回调 → GET /api/auth/feishu/callback?code=xxx
 *   3. 后端用code换token → 获取用户信息 → 映射ANOS角色 → 返回JWT
 *   4. 前端保存JWT → 跳转首页
 */
import { Hono } from 'hono';
import { signToken } from '../middleware/jwt';

const FEISHU_APP_ID = process.env.FEISHU_APP_ID || '';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || '';
const FEISHU_REDIRECT_URI = process.env.FEISHU_REDIRECT_URI || 'http://localhost:3000/api/auth/feishu/callback';
const FEISHU_ENABLED = !!(FEISHU_APP_ID && FEISHU_APP_SECRET);

// 角色映射: 飞书部门 → ANOS角色
const DEPT_ROLE_MAP: Record<string, string> = {
  '销售部': 'Sales',
  '采购部': 'Procurement',
  '财务部': 'Risk',
  '管理层': 'CEO',
  'IT部': 'SystemAdmin',
  '品质部': 'Risk',
  '数字化与流程': 'SystemAdmin',
};

function mapRole(department: string): string {
  for (const [dept, role] of Object.entries(DEPT_ROLE_MAP)) {
    if (department.includes(dept)) return role;
  }
  return 'Procurement'; // 默认采购
}

export const feishuAuthRoutes = new Hono();

// GET /api/auth/feishu/login — 获取飞书授权URL
feishuAuthRoutes.get('/login', (c) => {
  if (!FEISHU_ENABLED) {
    return c.json({
      enabled: false,
      message: '飞书登录未配置。请设置 FEISHU_APP_ID 和 FEISHU_APP_SECRET',
      fallback: '/login',
    });
  }

  const state = Math.random().toString(36).substring(2, 15);
  const url = `https://open.feishu.cn/open-apis/authen/v1/authorize?app_id=${FEISHU_APP_ID}&redirect_uri=${encodeURIComponent(FEISHU_REDIRECT_URI)}&state=${state}`;
  
  return c.json({ enabled: true, url, state });
});

// GET /api/auth/feishu/callback — 飞书回调
feishuAuthRoutes.get('/callback', async (c) => {
  const code = c.req.query('code');
  
  if (!code) {
    return c.json({ error: 'Missing authorization code' }, 400);
  }

  if (!FEISHU_ENABLED) {
    return c.json({ error: 'Feishu auth not configured' }, 500);
  }

  try {
    // Step 1: code → access_token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: FEISHU_APP_ID,
        client_secret: FEISHU_APP_SECRET,
        code,
        redirect_uri: FEISHU_REDIRECT_URI,
      }),
    });
    const tokenData: any = await tokenRes.json();
    
    if (tokenData.code !== 0) {
      return c.json({ error: 'Token exchange failed', detail: tokenData.msg }, 500);
    }

    const accessToken = tokenData.data.access_token;

    // Step 2: 获取用户信息
    const userRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/user_info', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const userData: any = await userRes.json();

    if (userData.code !== 0) {
      return c.json({ error: 'User info failed', detail: userData.msg }, 500);
    }

    const feishuUser = userData.data;
    
    // Step 3: 查询用户部门 (需要 tenant_access_token)
    const tenantTokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
    });
    const tenantData: any = await tenantTokenRes.json();
    const tenantToken = tenantData.tenant_access_token;

    // 获取部门信息
    let department = 'Unknown';
    if (tenantToken) {
      const deptRes = await fetch(
        `https://open.feishu.cn/open-apis/contact/v3/users/${feishuUser.open_id}?department_id_type=department_id&user_id_type=open_id`,
        { headers: { 'Authorization': `Bearer ${tenantToken}` } }
      );
      const deptData: any = await deptRes.json();
      if (deptData.code === 0 && deptData.data?.user?.department_ids?.length > 0) {
        const deptId = deptData.data.user.department_ids[0];
        const deptInfoRes = await fetch(
          `https://open.feishu.cn/open-apis/contact/v3/departments/${deptId}`,
          { headers: { 'Authorization': `Bearer ${tenantToken}` } }
        );
        const deptInfo: any = await deptInfoRes.json();
        if (deptInfo.code === 0) {
          department = deptInfo.data?.department?.name || 'Unknown';
        }
      }
    }

    // Step 4: 生成 ANOS JWT
    const anosRole = mapRole(department);
    const token = signToken({
      sub: feishuUser.open_id || feishuUser.user_id,
      name: feishuUser.name || 'Feishu User',
      role: anosRole as any,
      department,
    });

    // HTML 响应：设置 cookie + 跳转首页
    return c.html(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>登录成功</title></head>
<body>
  <script>
    localStorage.setItem('anos_token', '${token}');
    localStorage.setItem('anos_user_role', '${anosRole}');
    localStorage.setItem('anos_user_name', '${feishuUser.name || ''}');
    window.location.href = '/';
  </script>
  <p>登录成功，正在跳转...</p>
</body>
</html>`);

  } catch (err: any) {
    return c.json({ error: 'Feishu auth error', message: err.message }, 500);
  }
});

// GET /api/auth/feishu/status — 检查飞书配置状态
feishuAuthRoutes.get('/status', (c) => {
  return c.json({
    enabled: FEISHU_ENABLED,
    appId: FEISHU_APP_ID ? FEISHU_APP_ID.slice(0, 8) + '...' : null,
  });
});
