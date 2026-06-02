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
  { id: 'dashboard', label: '工作台', icon: <LayoutDashboard size={18} />, href: '/', section: 'workspace' },
  { id: 'tasks', label: '待办事项', icon: <ListChecks size={18} />, href: '/tasks', section: 'workspace' },
  { id: 'inquiry', label: 'Inquiry Center', icon: <FileSearch size={18} />, href: '/inquiries', section: 'trading' },
  { id: 'offer', label: 'Offer Center', icon: <FileText size={18} />, href: '/offers', section: 'trading' },
  { id: 'so', label: 'SO Center', icon: <PackageCheck size={18} />, href: '/orders', section: 'trading' },
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
      'sidebar flex flex-col h-screen transition-all duration-300',
      collapsed ? 'w-[64px]' : 'w-[280px]',
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-white/5">
        {!collapsed && <span className="sidebar-logo">ANOS</span>}
        <button onClick={onToggle} className="sidebar-toggle p-1 rounded hover:bg-white/5 transition-colors">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* User */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="text-sm text-white/80 font-medium">Darren Li</div>
          <div className="text-xs text-white/30 mt-0.5">CEO · AI Level L5</div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {Array.from(sections.entries()).map(([section, items]) => (
          <div key={section} className="mb-4">
            {!collapsed && (
              <div className="sidebar-section-label px-4 py-1">{sectionLabels[section]}</div>
            )}
            {items.map(item => {
              const active = isActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={clsx(
                    'sidebar-item w-full flex items-center gap-3 px-3 py-2 text-left',
                    active && 'sidebar-item active',
                    collapsed && 'justify-center px-2',
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

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/5 text-xs text-white/15">
          ANOS V2.0
        </div>
      )}
    </aside>
  );
}
