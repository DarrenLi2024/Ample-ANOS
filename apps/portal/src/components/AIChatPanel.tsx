'use client';
import { useState } from 'react';
import { Bot, Send, User as UserIcon } from 'lucide-react';

interface Message { role: 'user' | 'ai'; content: string; time?: string }

export function AIChatPanel({ greeting }: { greeting?: string }) {
  const defaultGreeting = greeting || '你好！需要我帮你做什么？';
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: defaultGreeting, time: '刚刚' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => setMessages(prev => [...prev, { role: 'ai', content: '已收到指令，正在分析中...' }]), 800);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-brand-50' : 'bg-gray-100'}`}>
              {msg.role === 'ai' ? <Bot size={14} className="text-brand-600" /> : <UserIcon size={14} className="text-gray-500" />}
            </div>
            <div className={`max-w-[75%] rounded-xl px-3 py-2 text-xs ${msg.role === 'ai' ? 'bg-gray-50 text-gray-800' : 'bg-brand-500 text-white'}`}>
              {msg.content}
              {msg.time && <div className="text-[11px] mt-0.5 opacity-50">{msg.time}</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 px-3 py-2 flex gap-2 items-center shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="输入指令..." className="flex-1 min-w-0 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-200" />
        <button onClick={handleSend} className="shrink-0 w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600"><Send size={14} /></button>
      </div>
    </div>
  );
}
