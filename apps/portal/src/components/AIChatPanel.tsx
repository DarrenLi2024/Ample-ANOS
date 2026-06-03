'use client';
import { useState } from 'react';
import { Bot, Send, User as UserIcon } from 'lucide-react';

interface Message { role: 'user' | 'ai'; content: string; time?: string }

export function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: '你好 Darren！今日已处理 12 条 RFQ，匹配 5 个商机，发现 2 条 AR 风险预警。需要我帮你做什么？', time: '刚刚' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: `已收到指令「${input}」，正在分析中...` }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-brand-50' : 'bg-gray-100'}`}>
              {msg.role === 'ai' ? <Bot size={16} className="text-brand-600" /> : <UserIcon size={16} className="text-gray-500" />}
            </div>
            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${msg.role === 'ai' ? 'bg-gray-50 text-gray-800' : 'bg-brand-500 text-white'}`}>
              {msg.content}
              {msg.time && <div className={`text-xs mt-1 ${msg.role === 'ai' ? 'text-gray-400' : 'text-white/60'}`}>{msg.time}</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 p-3 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="输入指令..." className="flex-1 proto-input py-2 text-sm" />
        <button onClick={handleSend} className="btn-primary !p-2"><Send size={16} /></button>
      </div>
    </div>
  );
}
