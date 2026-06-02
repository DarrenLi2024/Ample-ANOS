'use client';
import { useState } from 'react';
import { Send, Paperclip, Upload } from 'lucide-react';

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
    <div>
      {/* Agent 思考指示器 */}
      {processing && agentThinking && (
        <div className="px-5 py-2 flex items-center gap-2 text-xs text-brand-600 bg-brand-50 border-t border-brand-100">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite' }} />
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: '200ms' }} />
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: '400ms' }} />
          {agentThinking}
        </div>
      )}

      {/* 输入栏 */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-t border-[#E8EAED]">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="附件">
          <Paperclip size={18} />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="上传">
          <Upload size={18} />
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          className="flex-1 proto-input py-2.5"
          disabled={processing}
        />

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || processing}
          className="btn-primary flex items-center justify-center !p-2.5 !rounded-lg"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
