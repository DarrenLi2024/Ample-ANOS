import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8">
        <div className="text-6xl mb-4 text-gray-300"><Search size={48} className="mx-auto" /></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">页面未找到</h1>
        <p className="text-lg text-gray-600 mb-6">
          您访问的页面不存在或已被移除
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-lg font-medium"
        >
          返回 AI Inbox
        </Link>
      </div>
    </div>
  );
}
