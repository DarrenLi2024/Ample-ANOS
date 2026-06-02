'use client';
import { useState } from 'react';
import { Send, Paperclip, Upload, Bot, FileSpreadsheet, FileText, Mail, Image, MessageCircle } from 'lucide-react';

interface BottomCommandBarProps {
  placeholder?: string;
  onSubmit?: (input: string) => void;
  processing?: boolean;
  agentThinking?: string;
}

const fileTypes = [
  { icon: <FileSpreadsheet size={16} />, label: 'Excel' },
  { icon: <FileText size={16} />, label: 'PDF' },
  { icon: <Mail size={16} />, label: '邮件' },
  { icon: <Image size={16} />, label: '截图' },
  { icon: <MessageCircle size={16} />, label: '微信' },
];

export function BottomCommandBar({
  placeholder = '今天你想完成什么？输入指令或上传文件...',
  onSubmit, processing = false, agentThinking,
}: BottomCommandBarProps) {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const isActive = focused || input.length > 0;

  const handleSubmit = () => {
    if (input.trim() && onSubmit) { onSubmit(input.trim()); setInput(''); }
  };

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

      <div className="px-5 pt-4 pb-4">
        {/* 会话卡片 — Bot图标 + 输入区 + 文件类型 + 操作图标 */}
        <div className={`
          px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
          transition-all duration-200
          ${isActive ? 'border-brand-300 shadow-[0_0_0_3px_rgba(43,111,242,0.1)] bg-white py-4' : ''}
        `}>
          {/* 主输入行 — Bot + 输入框 + 发送 */}
          <div className="flex items-center gap-3">
            {/* Bot 图标 */}
            <div className="shrink-0 self-start mt-0.5">
              <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                <Bot size={18} className="text-brand-600" />
              </div>
            </div>

            {/* 输入区 */}
            <div className="flex-1 min-w-0">
              {isActive ? (
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault(); handleSubmit();
                    }
                  }}
                  placeholder={placeholder}
                  rows={2}
                  className="w-full bg-transparent border-none outline-none resize-none text-base text-gray-900 placeholder:text-gray-400 leading-relaxed"
                  disabled={processing}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder={placeholder}
                  className="w-full bg-transparent border-none outline-none text-base text-gray-900 placeholder:text-gray-400"
                  disabled={processing}
                />
              )}

              {/* 文件类型图标行 — 只在默认态显示，会话区域内，Icon左+Text右横向排列 */}
              {!isActive && (
                <div className="flex items-center gap-1 mt-2.5 pt-2.5 border-t border-gray-100">
                  {fileTypes.map((ft, i) => (
                    <button
                      key={i}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white transition-colors"
                      title={ft.label}
                    >
                      {ft.icon}
                      <span className="text-xs font-medium">{ft.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 右侧操作图标 */}
            <div className="flex items-center gap-0.5 shrink-0 self-start mt-0.5">
              <button className="p-1.5 rounded-lg hover:bg-gray-200/50 text-gray-400 transition-colors" title="附件">
                <Paperclip size={18} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-gray-200/50 text-gray-400 transition-colors" title="上传">
                <Upload size={18} />
              </button>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || processing}
                className="p-1.5 rounded-lg text-brand-500 hover:bg-brand-50 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
