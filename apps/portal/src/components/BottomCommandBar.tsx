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
      {/* Agent 思考指示器 */}
      {processing && agentThinking && (
        <div className="px-5 py-2.5 flex items-center gap-2.5 text-[13px] text-brand-600 bg-brand-50 border-b border-brand-100">
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite' }} />
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: '200ms' }} />
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: '400ms' }} />
          {agentThinking}
        </div>
      )}

      {/* 指令输入区 — 原型图比例拉高 */}
      <div className="flex items-end gap-3 px-6 py-5">
        {/* 机器人图标 (原型图) */}
        <div className="shrink-0 pb-1">
          <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
            <Bot size={22} className="text-brand-600" />
          </div>
        </div>

        {/* 输入区域 */}
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={placeholder}
            rows={2}
            className="w-full proto-input resize-none"
            disabled={processing}
          />

          {/* 底部操作栏 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="附件">
                <Paperclip size={17} />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="上传文件">
                <Upload size={17} />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!input.trim() || processing}
              className="btn-primary flex items-center gap-2 !px-5 !py-2"
            >
              <Send size={16} />
              <span>发送</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
