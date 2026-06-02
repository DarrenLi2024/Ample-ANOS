import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ANOS — Ample AI Native OS',
    template: '%s | ANOS',
  },
  description: '安芯易集团企业级 AI 原生操作系统 — Trading Intelligence OS',
  applicationName: 'ANOS',
  keywords: ['ANOS', 'AI Native OS', 'Trading Intelligence', '电子元器件', '供应链管理'],
  authors: [{ name: '安芯易集团' }],
  robots: { index: false, follow: false },
  openGraph: {
    title: 'ANOS — Ample AI Native OS',
    description: '安芯易集团企业级 AI 原生操作系统',
    type: 'website',
  },
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
