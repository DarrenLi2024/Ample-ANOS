'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || '登录失败');
      localStorage.setItem('anos_token', data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.06),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(124,58,237,0.06),transparent_60%)]" />
      <div className="login-card relative z-10 animate-in-up">
        <div className="login-icon mx-auto mb-6">
          <Bot size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-text-primary text-center tracking-tight mb-1">ANOS</h1>
        <p className="text-sm text-text-tertiary text-center mb-8">Ample AI Native OS</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="用户名" className="input-field" required autoFocus />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" className="input-field" required />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3">{loading ? '登录中...' : '登 录'}</button>
        </form>
        <p className="text-xs text-text-tertiary text-center mt-6">演示账号: admin / sales1 / proc1 / risk1</p>
      </div>
    </div>
  );
}
