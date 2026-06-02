/**
 * 飞书多维表格添加协作者
 * 解决"看不到自己创建的表格"问题
 *
 * 运行: npx tsx scripts/feishu/add-collaborator.ts
 */

const APP_ID = 'cli_a954e269f6385bca';
const APP_SECRET = 'ddotELJC0WZOsrrFPsGIOh1cpEYet0ms';

// 已创建的多维表格 bitable_id
const TABLES = [
  { name: '01_Customer_Base',     bitable_id: 'TN4qbN8TXa2W3tsY78ccB16Tnqh' },
  { name: '02_Supplier_Base',     bitable_id: 'VtInbgFJbazaR2seIMLcTPSmnTb' },
  { name: '03_Product_Base',      bitable_id: 'ViiGb1aAVaojalshcQrcXYNTnhg' },
];

async function getToken(): Promise<string> {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
  });
  const data = await res.json() as any;
  return data.tenant_access_token;
}

async function main() {
  console.log('🔑 获取 Token...');
  const token = await getToken();
  console.log('   ✅ 成功\n');

  for (const table of TABLES) {
    console.log(`📊 ${table.name}`);
    console.log(`   URL: https://tofl681bua.feishu.cn/base/${table.bitable_id}`);

    // 获取表格列表
    const tablesRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${table.bitable_id}/tables`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const tablesData = await tablesRes.json() as any;

    if (tablesData.code === 0) {
      console.log(`   ✅ 可访问，共 ${tablesData.data?.items?.length || 0} 个数据表`);
    } else {
      console.log(`   ⚠️ API 返回: ${tablesData.msg} (code: ${tablesData.code})`);
    }
    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('💡 如果你的飞书账号仍然看不到表格：');
  console.log('');
  console.log('方法1（推荐）: 直接在飞书中操作');
  console.log('  1. 打开上方任一表格链接');
  console.log('  2. 如果提示"无权限"，点击"申请权限"');
  console.log('  3. 飞书应用管理员会收到通知 → 批准');
  console.log('');
  console.log('方法2: 用管理后台授权');
  console.log('  1. 打开 https://open.feishu.cn/app');
  console.log('  2. 找到应用 "ANOS" (cli_a954e269f6385bca)');
  console.log('  3. 左侧菜单 → "安全设置" → 添加管理员');
  console.log('  4. 把自己的飞书账号添加为应用管理员');
  console.log('');
  console.log('方法3: 在飞书中手动分享');
  console.log('  1. 打开表格 → 右上角"分享"');
  console.log('  2. 添加协作者 → 搜索自己的名字');
  console.log('  3. 设置为"可管理"权限');
  console.log('');
  console.log('⚠️ 当前飞书多维表格 API 不支持通过接口添加协作者');
  console.log('   必须通过飞书 UI 或管理后台手动授权');
}

main().catch(err => console.error('❌', err.message));
