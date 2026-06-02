'use client';

import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard, FileSearch, FileText, PackageCheck,
  ShieldAlert, CalendarClock, Library, Bot, Settings,
  ChevronLeft, ChevronRight, ListChecks,
} from 'lucide-react';

type NavItem = {
  id: string; label: string; icon: React.ReactNode;
  href: string; section: 'workspace' | 'trading' | 'risk' | 'knowledge';
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: '工作台', icon: <LayoutDashboard size={20} />, href: '/', section: 'workspace' },
  { id: 'tasks', label: '待办事项', icon: <ListChecks size={20} />, href: '/tasks', section: 'workspace' },
  { id: 'inquiry', label: 'Inquiry Center', icon: <FileSearch size={20} />, href: '/inquiries', section: 'trading' },
  { id: 'offer', label: 'Offer Center', icon: <FileText size={20} />, href: '/offers', section: 'trading' },
  { id: 'so', label: 'SO Center', icon: <PackageCheck size={20} />, href: '/orders', section: 'trading' },
  { id: 'risk', label: '风控中心', icon: <ShieldAlert size={20} />, href: '/risk', section: 'risk' },
  { id: 'ar', label: 'AR 中心', icon: <CalendarClock size={20} />, href: '/ar', section: 'risk' },
  { id: 'knowledge', label: '知识库', icon: <Library size={20} />, href: '/knowledge', section: 'knowledge' },
  { id: 'agents', label: 'Agent 中心', icon: <Bot size={20} />, href: '/agents', section: 'knowledge' },
  { id: 'settings', label: '设置', icon: <Settings size={20} />, href: '/settings', section: 'workspace' },
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
      'flex flex-col h-screen bg-gray-50 border-r border-gray-200 transition-all duration-200',
      collapsed ? 'w-16' : 'w-[280px]',
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-gray-200">
        {!collapsed && <span className="font-semibold text-lg text-gray-900">ANOS</span>}
        <button onClick={onToggle} className="p-1 rounded hover:bg-gray-200 text-gray-500">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-900">Darren Li</div>
          <div className="text-xs text-gray-500">CEO · AI Level L5</div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {Array.from(sections.entries()).map(([section, items]) => (
          <div key={section} className="mb-2">
            {!collapsed && (
              <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
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
                    'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors',
                    active
                      ? 'bg-primary-50 text-primary-700 font-medium border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    collapsed && 'justify-center px-0',
                  )}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-400">ANOS V2.0</div>
      )}
    </aside>
  );
}
