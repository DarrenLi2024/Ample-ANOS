'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ANOS Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8">
        <div className="text-6xl mb-4 text-gray-300"><AlertTriangle size={48} className="mx-auto" /></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">页面加载异常</h1>
        <p className="text-base text-gray-600 mb-6">
          {error.message || '发生未知错误，请重试'}
        </p>
        {error.digest && (
          <p className="text-base text-gray-400 mb-4 font-mono">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-base font-medium"
        >
          重试
        </button>
      </div>
    </div>
  );
}
