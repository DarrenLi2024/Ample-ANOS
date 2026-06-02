'use client';
import { useState, createContext, useContext, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomCommandBar } from './BottomCommandBar';

const LayoutContext = createContext({ sidebarCollapsed: false, toggleSidebar: () => {} });
export function useLayout() { return useContext(LayoutContext); }

interface WorkspaceLayoutProps {
  title: string; rightPanel?: ReactNode; children: ReactNode;
  commandBarPlaceholder?: string; onCommand?: (input: string) => void;
  agentStatuses?: { label: string; color: string }[];
}

export function WorkspaceLayout({
  title, rightPanel, children, commandBarPlaceholder, onCommand, agentStatuses = [],
}: WorkspaceLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleCommand = (input: string) => {
    if (onCommand) { setProcessing(true); onCommand(input); setTimeout(() => setProcessing(false), 1500); }
  };

  return (
    <LayoutContext.Provider value={{ sidebarCollapsed, toggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed) }}>
      <div className="flex h-screen overflow-hidden relative z-10">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between h-12 px-6 glass-panel border-b border-border-light shrink-0">
            <h1 className="text-xl font-semibold text-text-primary tracking-tight">{title}</h1>
            {agentStatuses.length > 0 && (
              <div className="flex items-center gap-2">
                {agentStatuses.map((a, i) => (
                  <span key={i} className={a.color}>{a.label}</span>
                ))}
              </div>
            )}
          </header>
          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
            {rightPanel && (
              <aside className="w-[420px] border-l border-border-light bg-surface/80 backdrop-blur-sm overflow-y-auto p-5 shrink-0">
                {rightPanel}
              </aside>
            )}
          </div>
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
