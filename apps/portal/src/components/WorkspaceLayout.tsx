'use client';

import { useState, createContext, useContext, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomCommandBar } from './BottomCommandBar';
import { Bell, Search, ListChecks } from 'lucide-react';

const LayoutContext = createContext({ sidebarCollapsed: false, toggleSidebar: () => {} });
export function useLayout() { return useContext(LayoutContext); }

interface WorkspaceLayoutProps {
  title?: string;
  children: ReactNode;
  rightPanel?: ReactNode;
  commandBarPlaceholder?: string;
  onCommand?: (input: string) => void;
  agentStatuses?: { label: string; color: string }[];
  topBarChildren?: ReactNode;
}

export function WorkspaceLayout({
  title = 'AI 智能工作台',
  children,
  rightPanel,
  commandBarPlaceholder,
  onCommand,
  agentStatuses = [],
  topBarChildren,
}: WorkspaceLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleCommand = (input: string) => {
    if (onCommand) { setProcessing(true); onCommand(input); setTimeout(() => setProcessing(false), 1500); }
  };

  return (
    <LayoutContext.Provider value={{ sidebarCollapsed, toggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed) }}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="flex items-center h-[52px] px-5 bg-white border-b border-[#E8EAED] shrink-0 gap-4">
            <h1 className="text-[17px] font-semibold text-gray-900 shrink-0">{title}</h1>

            {/* 全局搜索 */}
            <div className="relative flex-1 max-w-[480px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="你想完成什么工作？找客户、分析库存、整理询价..."
                className="w-full pl-9 pr-4 py-1.5 text-[14px] bg-gray-50 border border-gray-200 rounded-lg
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
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-[13px] ring-2 ring-white">
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
                placeholder={commandBarPlaceholder}
                onSubmit={handleCommand}
                processing={processing}
                agentThinking={processing ? 'AI 正在理解你的指令...' : undefined}
              />
            </div>

            {/* 右侧面板 */}
            {rightPanel && (
              <aside className="w-[400px] border-l border-[#E8EAED] bg-white overflow-y-auto shrink-0">
                {rightPanel}
              </aside>
            )}
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
