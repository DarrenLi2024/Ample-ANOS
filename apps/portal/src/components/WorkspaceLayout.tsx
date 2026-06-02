'use client';

import { useState, createContext, useContext, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomCommandBar } from './BottomCommandBar';

const LayoutContext = createContext({ sidebarCollapsed: false, toggleSidebar: () => {} });
export function useLayout() { return useContext(LayoutContext); }

interface WorkspaceLayoutProps {
  title?: string;
  showGlobalSearch?: boolean;
  showTodayFilter?: boolean;
  rightPanel?: ReactNode;
  children: ReactNode;
  commandBarPlaceholder?: string;
  onCommand?: (input: string) => void;
  agentStatuses?: { label: string; color: string }[];
  topBarRight?: ReactNode;
}

export function WorkspaceLayout({
  title = 'AI Inbox',
  showGlobalSearch = true,
  showTodayFilter = true,
  rightPanel,
  children,
  commandBarPlaceholder,
  onCommand,
  agentStatuses = [],
  topBarRight,
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
          {/* Top Bar — 全局AI搜索 + Today过滤按钮 (对齐原型) */}
          <header className="flex items-center justify-between h-12 px-6 bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-lg font-semibold text-gray-900 shrink-0">{title}</h1>

              {/* 全局 AI 搜索栏 (原型核心功能) */}
              {showGlobalSearch && (
                <div className="flex-1 max-w-2xl">
                  <input
                    type="text"
                    placeholder="你想完成什么工作？找客户、分析库存、整理询价..."
                    className="w-full px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300
                               placeholder:text-gray-400"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Today / 本周 / 本月 时间筛选按钮 (原型功能) */}
              {showTodayFilter && (
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                  <button className="px-3 py-1 text-xs rounded-md bg-primary-500 text-white font-medium">Today</button>
                  <button className="px-3 py-1 text-xs rounded-md text-gray-500 hover:text-gray-700">本周</button>
                  <button className="px-3 py-1 text-xs rounded-md text-gray-500 hover:text-gray-700">本月</button>
                </div>
              )}

              {/* Agent 状态指示器 */}
              {agentStatuses.map((a, i) => (
                <span key={i} className={a.color}>{a.label}</span>
              ))}

              {topBarRight}
            </div>
          </header>

          {/* Main + Right Panel */}
          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
            {rightPanel && (
              <aside className="w-[420px] border-l border-gray-200 bg-white overflow-y-auto p-4 shrink-0">
                {rightPanel}
              </aside>
            )}
          </div>

          {/* Bottom Command Bar */}
          <BottomCommandBar
            placeholder={commandBarPlaceholder}
            onSubmit={handleCommand}
            processing={processing}
            agentThinking={processing ? 'AI 正在处理...' : undefined}
          />
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
