'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getDevToken, login } from '@/lib/api';

export default function LoginPage() {
  const [mode, setMode] = useState<'feishu' | 'dev'>('feishu');
  const [feishuUrl, setFeishuUrl] = useState('');
  const [feishuEnabled, setFeishuEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dev mode state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [devLoading, setDevLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('anos_token');
    if (token) { router.push('/'); return; }

    // Check Feishu status
    fetch('/api/auth/feishu/status')
      .then(r => r.json())
      .then(d => {
        setFeishuEnabled(d.enabled);
        if (d.enabled) {
          return fetch('/api/auth/feishu/login').then(r => r.json());
        }
        return null;
      })
      .then(d => {
        if (d?.url) setFeishuUrl(d.url);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDevLogin = async () => {
    setDevLoading(true);
    setError('');
    try {
      const res = await login(username, password);
      if (res.token) {
        localStorage.setItem('anos_user_role', res.role || 'Procurement');
        localStorage.setItem('anos_user_name', res.name || username);
        router.push('/');
      }
    } catch (e: any) {
      setError(e.message || '登录失败');
    } finally {
      setDevLoading(false);
    }
  };

  // Quick dev role select
  const quickLogin = async (role: string, name: string) => {
    setDevLoading(true);
    try {
      const res = await getDevToken(role);
      if (res.token) {
        localStorage.setItem('anos_user_role', role);
        localStorage.setItem('anos_user_name', name);
        router.push('/');
      }
    } catch {
      setError('开发登录失败');
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-blue-50 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">AN</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">ANOS</h1>
        <p className="text-sm text-gray-500 mt-1">Ample AI Native OS</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {loading ? (
          <div className="text-center py-8 text-gray-400">加载中...</div>
        ) : mode === 'feishu' ? (
          <>
            {/* Feishu Mode */}
            <h2 className="text-lg font-semibold text-center mb-6">飞书扫码登录</h2>

            {feishuEnabled && feishuUrl ? (
              <div className="space-y-4">
                {/* QR Code placeholder — 实际需要飞书SDK生成 */}
                <a
                  href={feishuUrl}
                  className="block w-full py-10 bg-brand-50 rounded-xl text-center hover:bg-brand-100 transition-colors border-2 border-dashed border-brand-200"
                >
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-brand-600 font-medium">点击跳转飞书授权</p>
                  <p className="text-xs text-brand-400 mt-1">或在新标签页中打开</p>
                </a>
                <p className="text-xs text-gray-400 text-center">
                  使用飞书App扫码登录，自动识别部门和权限
                </p>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="text-4xl">🔧</div>
                <p className="text-gray-600 font-medium">飞书登录未配置</p>
                <p className="text-xs text-gray-400">
                  请设置 FEISHU_APP_ID 和 FEISHU_APP_SECRET
                </p>
                <button
                  onClick={() => setMode('dev')}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium mt-2"
                >
                  使用开发模式登录 →
                </button>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setMode('dev')}
                className="w-full text-xs text-gray-400 hover:text-gray-600"
              >
                开发/演示模式
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Dev Mode */}
            <h2 className="text-lg font-semibold text-center mb-2">开发/演示登录</h2>
            <p className="text-xs text-gray-400 text-center mb-6">选择角色快速进入系统</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
            )}

            <div className="space-y-2 mb-6">
              {[
                { role: 'Procurement', label: '采购试点-1', dept: '采购部', color: 'bg-purple-500' },
                { role: 'Sales', label: 'Sales Pilot', dept: '销售部', color: 'bg-blue-500' },
                { role: 'CEO', label: 'Darren', dept: '管理层', color: 'bg-amber-500' },
                { role: 'Risk', label: '风控专员', dept: '财务部', color: 'bg-red-500' },
              ].map(user => (
                <button
                  key={user.role}
                  onClick={() => quickLogin(user.role, user.label)}
                  disabled={devLoading}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all disabled:opacity-50"
                >
                  <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {user.label[0]}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-800">{user.label}</div>
                    <div className="text-xs text-gray-400">{user.dept}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => setMode('feishu')}
                className="w-full text-xs text-gray-400 hover:text-gray-600"
              >
                ← 返回飞书登录
              </button>
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-gray-300 mt-6">安芯易集团 © 2026</p>
    </div>
  );
}
