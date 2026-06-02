'use client';
import { useState } from 'react';
import { Send, Paperclip, Upload, Bot } from 'lucide-react';

interface BottomCommandBarProps {
  placeholder?: string;
  onSubmit?: (input: string) => void;
  processing?: boolean;
  agentThinking?: string;
}

export function BottomCommandBar({
  placeholder = '今天你想完成什么？输入指令或上传文件...',
  onSubmit, processing = false, agentThinking,
}: BottomCommandBarProps) {
  const [input, setInput] = useState('');
  const handleSubmit = () => { if (input.trim() && onSubmit) { onSubmit(input.trim()); setInput(''); } };

  return (
    <div className="border-t border-[#E8EAED] bg-white">
      {processing && agentThinking && (
        <div className="px-5 py-2 flex items-center gap-2.5 text-sm text-brand-600 bg-brand-50 border-b border-brand-100">
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite' }} />
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: '200ms' }} />
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: '400ms' }} />
          {agentThinking}
        </div>
      )}

      <div className="flex items-center gap-3 px-5 py-4">
        {/* 附件/上传图标 */}
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 shrink-0 transition-colors" title="附件">
          <Paperclip size={20} />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 shrink-0 transition-colors" title="上传文件">
          <Upload size={20} />
        </button>

        {/* 单行输入框 — 撑满 */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder={placeholder}
            className="w-full proto-input py-3 text-base"
            disabled={processing}
          />
        </div>

        {/* 发送按钮 */}
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || processing}
          className="btn-primary !p-2.5 !rounded-lg shrink-0"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
