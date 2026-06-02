'use client';
import { useState } from 'react';
import { Send, Paperclip, Image, Mic } from 'lucide-react';

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
    <div className="border-t border-gray-200 bg-white">
      {processing && agentThinking && (
        <div className="px-4 py-2 flex items-center gap-2 text-sm text-primary-600 bg-primary-50">
          <span className="w-2 h-2 bg-primary-500 rounded-full agent-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-primary-500 rounded-full agent-pulse" style={{ animationDelay: '200ms' }} />
          <span className="w-2 h-2 bg-primary-500 rounded-full agent-pulse" style={{ animationDelay: '400ms' }} />
          {agentThinking}
        </div>
      )}
      <div className="flex items-center gap-3 px-4 py-3">
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><Paperclip size={18} /></button>
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><Image size={18} /></button>
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><Mic size={18} /></button>
        <input
          type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
          disabled={processing}
        />
        <button onClick={handleSubmit} disabled={!input.trim() || processing}
          className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
