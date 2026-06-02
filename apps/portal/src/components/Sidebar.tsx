'use client';

import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import Image from 'next/image';
import {
  LayoutDashboard, FileSearch, FileText, PackageCheck, ShieldAlert,
  CalendarClock, Library, Bot, Settings, ChevronLeft, ChevronRight,
  ListChecks, User,
} from 'lucide-react';

type NavItem = {
  id: string; label: string; icon: React.ReactNode;
  href: string; section: 'workspace' | 'trading' | 'risk' | 'knowledge';
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: '工作台', icon: <LayoutDashboard size={18} />, href: '/', section: 'workspace' },
  { id: 'tasks', label: '待办事项', icon: <ListChecks size={18} />, href: '/tasks', section: 'workspace' },
  { id: 'inquiry', label: '询价中心', icon: <FileSearch size={18} />, href: '/inquiries', section: 'trading' },
  { id: 'offer', label: '报价中心', icon: <FileText size={18} />, href: '/offers', section: 'trading' },
  { id: 'so', label: '订单中心', icon: <PackageCheck size={18} />, href: '/orders', section: 'trading' },
  { id: 'risk', label: '风控中心', icon: <ShieldAlert size={18} />, href: '/risk', section: 'risk' },
  { id: 'ar', label: 'AR 中心', icon: <CalendarClock size={18} />, href: '/ar', section: 'risk' },
  { id: 'knowledge', label: '知识库', icon: <Library size={18} />, href: '/knowledge', section: 'knowledge' },
  { id: 'agents', label: 'Agent 中心', icon: <Bot size={18} />, href: '/agents', section: 'knowledge' },
  { id: 'settings', label: '设置', icon: <Settings size={18} />, href: '/settings', section: 'workspace' },
];

const sectionLabels: Record<string, string> = {
  workspace: '我的工作', trading: 'Trading OS', risk: 'Risk OS', knowledge: 'Knowledge OS',
};

interface SidebarProps { collapsed?: boolean; onToggle?: () => void }

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const sections = new Map<string, NavItem[]>();
  navItems.forEach(item => {
    const list = sections.get(item.section) || [];
    list.push(item);
    sections.set(item.section, list);
  });

  function isActive(item: NavItem) {
    if (item.href === '/') return pathname === '/';
    return pathname.startsWith(item.href);
  }

  return (
    <aside className={clsx(
      'flex flex-col h-screen bg-[#F7F8FA] border-r border-[#E8EAED] transition-all duration-200',
      collapsed ? 'w-[64px]' : 'w-[260px]',
    )}>
      {/* Logo 区域 — 居中放大 */}
      <div className={clsx('border-b border-[#E8EAED]', collapsed ? 'py-4' : 'py-6')}>
        <div className={clsx('flex justify-center', collapsed ? 'px-2' : 'px-6')}>
          <div className={clsx('relative', collapsed ? 'w-8 h-8' : 'w-36 h-10')}>
            <Image src="/ample-logo.webp" alt="AMPLE" fill className="object-contain" priority />
          </div>
        </div>
      </div>

      {/* 折叠按钮 */}
      <div className="flex justify-end px-3 py-1">
        <button onClick={onToggle} className="p-1 rounded hover:bg-black/5 text-gray-400 shrink-0 transition-colors">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div className="px-5 py-3 border-b border-[#E8EAED]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
              <User size={18} className="text-brand-600" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">Darren Li</div>
              <div className="text-[13px] text-gray-500 mt-0.5">CEO · AI Level L5</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {Array.from(sections.entries()).map(([section, items]) => (
          <div key={section} className="mb-3">
            {!collapsed && (
              <div className="px-5 py-1.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">
                {sectionLabels[section]}
              </div>
            )}
            {items.map(item => {
              const active = isActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={clsx(
                    'w-full flex items-center gap-3 mx-2 px-3 py-2 rounded-md text-[13px] transition-all duration-150',
                    active
                      ? 'bg-brand-50 text-brand-700 font-semibold border-r-[3px] border-brand-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    collapsed && 'justify-center mx-1 px-0',
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-5 py-3 border-t border-[#E8EAED]">
          <button onClick={() => router.push('/settings')} className="flex items-center gap-2 w-full text-[13px] text-gray-400 hover:text-gray-600 transition-colors">
            <Settings size={14} />
            <span>设置与集成</span>
          </button>
        </div>
      )}
    </aside>
  );
}
