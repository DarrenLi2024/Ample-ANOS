export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex gap-2 justify-center mb-4">
          <span className="w-3 h-3 bg-primary-500 rounded-full agent-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-3 h-3 bg-primary-500 rounded-full agent-pulse" style={{ animationDelay: '200ms' }} />
          <span className="w-3 h-3 bg-primary-500 rounded-full agent-pulse" style={{ animationDelay: '400ms' }} />
        </div>
        <p className="text-[16px] text-gray-500">ANOS 加载中...</p>
      </div>
    </div>
  );
}
