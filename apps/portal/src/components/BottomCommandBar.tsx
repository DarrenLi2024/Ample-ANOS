'use client';
import { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface BottomCommandBarProps {
  placeholder?: string;
  onSubmit?: (input: string) => void;
  processing?: boolean;
  agentThinking?: string;
}

export function BottomCommandBar({
  placeholder = '输入指令或上传文件...',
  onSubmit,
  processing = false,
  agentThinking,
}: BottomCommandBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && onSubmit) { onSubmit(input.trim()); setInput(''); }
  };

  return (
    <div>
      {processing && agentThinking && (
        <div className="px-4 py-2 flex items-center gap-2 text-xs text-brand-light bg-brand-ghost">
          <span className="w-1.5 h-1.5 bg-brand rounded-full pulse-soft" />
          <span className="w-1.5 h-1.5 bg-brand-alt rounded-full pulse-soft" style={{ animationDelay: '200ms' }} />
          <span className="w-1.5 h-1.5 bg-brand rounded-full pulse-soft" style={{ animationDelay: '400ms' }} />
          {agentThinking}
        </div>
      )}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-border-light bg-surface">
        <button className="p-1.5 rounded hover:bg-black/5 text-text-tertiary transition-colors" title="上传文件">
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          className="flex-1 input-field py-2.5 text-sm"
          disabled={processing}
        />
        <button className="p-1.5 rounded hover:bg-black/5 text-text-tertiary transition-colors" title="语音">
          <Mic size={18} />
        </button>
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || processing}
          className="btn-primary !px-3 !py-2"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
