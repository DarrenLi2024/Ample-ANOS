import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ANOS — Ample AI Native OS',
  description: '安芯易集团企业级 AI 原生操作系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
