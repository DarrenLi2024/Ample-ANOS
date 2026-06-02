import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">页面未找到</h1>
        <p className="text-sm text-gray-600 mb-6">
          您访问的页面不存在或已被移除
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          返回 AI Inbox
        </Link>
      </div>
    </div>
  );
}
