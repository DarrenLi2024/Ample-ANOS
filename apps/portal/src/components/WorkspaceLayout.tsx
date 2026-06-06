'use client';

import { useState, createContext, useContext, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomCommandBar } from './BottomCommandBar';
import { useInbox } from '@/lib/InboxProvider';
import { Bot, User, Inbox } from 'lucide-react';
import { Bell, Search, ListChecks } from 'lucide-react';

const LayoutContext = createContext({ sidebarCollapsed: false, toggleSidebar: () => {} });
export function useLayout() { return useContext(LayoutContext); }

interface WorkspaceLayoutProps {
  title?: string;
  role?: string;
  children: ReactNode;
  agentThinking?: string;
  rightPanel?: ReactNode;
  agentStatuses?: { label: string; color: string }[];
  topBarChildren?: ReactNode;
}

export function WorkspaceLayout({
  title = 'AI 智能工作台',
  role,
  children,
  rightPanel,
  agentStatuses = [],
  topBarChildren,
}: WorkspaceLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { handleInput, processing, agentThinking, messages, clearMessages } = useInbox();



  return (
    <LayoutContext.Provider value={{ sidebarCollapsed, toggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed) }}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} role={role} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="flex items-center h-12 px-5 bg-white border-b border-[#E8EAED] shrink-0 gap-4">
            <h1 className="text-base font-semibold text-gray-900 shrink-0">{title}</h1>

            {/* 全局搜索 */}
            <div className="relative flex-1 max-w-[480px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="你想完成什么工作？找客户、分析库存、整理询价..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300
                           placeholder:text-gray-400"
              />
            </div>

            {/* TopBar children (Today按钮等) */}
            {topBarChildren}

            <div className="flex items-center gap-3 ml-auto shrink-0">
              {/* 任务中心 */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="任务中心">
                <ListChecks size={19} />
              </button>

              {/* 通知 */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="通知">
                <Bell size={19} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Agent 状态 */}
              {agentStatuses.map((a, i) => (
                <span key={i} className={a.color}>{a.label}</span>
              ))}

              {/* 用户头像 */}
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm ring-2 ring-white">
                DL
              </div>
            </div>
          </header>

          {/* Main + Right Panel */}
          <div className="flex-1 flex overflow-hidden">
            {/* 中间工作区 + 底部指令栏 */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 overflow-y-auto">{children}</div>
              <BottomCommandBar
                onSubmit={handleInput}
                processing={processing}
                agentThinking={agentThinking}
              />
            </div>

            {/* 右侧面板: 会话记录 + 原有内容 */}
            <aside className="w-[380px] border-l border-[#E8EAED] bg-white shrink-0 flex flex-col">
              {/* 会话历史 */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                    <Inbox size={12} /> AI 会话
                  </span>
                  {messages.length > 0 && (
                    <button onClick={clearMessages} className="text-xs text-gray-300 hover:text-gray-500">清空</button>
                  )}
                </div>
                <div className="p-2 space-y-2">
                  {messages.length === 0 && !processing && (
                    <div className="text-center text-gray-300 py-8 text-xs">
                      <Inbox size={20} className="mx-auto mb-1 opacity-50" />
                      在底部输入指令开始对话
                    </div>
                  )}
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-brand-50' : 'bg-gray-100'}`}>
                        {msg.role === 'assistant' ? <Bot size={12} className="text-brand-600" /> : <User size={12} className="text-gray-500" />}
                      </div>
                      <div className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs ${
                        msg.role === 'assistant' 
                          ? 'bg-gray-50 text-gray-700 border border-gray-100' 
                          : 'bg-brand-500 text-white'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="opacity-50 text-[10px]">{msg.time}</span>
                          {msg.intent && msg.role === 'assistant' && (
                            <span className={`text-[10px] px-1 py-0.5 rounded ${
                              msg.intent === 'Query' ? 'bg-blue-50 text-blue-600' :
                              msg.intent === 'Supply' ? 'bg-purple-50 text-purple-600' :
                              msg.intent === 'Demand' ? 'bg-amber-50 text-amber-700' :
                              'bg-gray-100 text-gray-500'
                            }`}>{msg.intent}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {processing && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                        <Bot size={12} className="text-brand-600 animate-pulse" />
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-xs text-gray-400">
                        {agentThinking || '处理中...'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* 原有右侧内容 */}
              {rightPanel && (
                <div className="border-t border-gray-100 overflow-y-auto max-h-[40%]">
                  {rightPanel}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
