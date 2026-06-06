'use client';

import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import Image from 'next/image';
import {
  LayoutDashboard, Inbox, Zap, FileSearch, FileText, PackageCheck,
  Users, ShieldAlert, TrendingUp, Bot, ChevronLeft, User, Factory,
  Search, DollarSign, BarChart3,
} from 'lucide-react';

// SA-019 第27章 Sales核心板块 + 第9章 禁止暴露 Prompt/Knowledge/Memory/Skill
const salesNav = [
  { id: 'workspace',  label: 'AI 工作台',   icon: <LayoutDashboard size={18} />, href: '/' },
  { id: 'opportunity',label: '机会中心',     icon: <Zap size={18} />,            href: '/opportunity' },
  { id: 'inquiry',    label: 'Inquiry 中心', icon: <FileSearch size={18} />,     href: '/inquiries' },
  { id: 'quote',      label: '报价中心',     icon: <FileText size={18} />,       href: '/offers' },
  { id: 'deal',       label: '成交中心',     icon: <PackageCheck size={18} />,   href: '/orders' },
  { id: 'customer',   label: '客户中心',     icon: <Users size={18} />,          href: '/customer-360' },
  { id: 'risk',       label: '风险中心',     icon: <ShieldAlert size={18} />,    href: '/risk' },
  { id: 'performance',label: '业绩中心',     icon: <TrendingUp size={18} />,     href: '/performance' },
];

// SA-019 第30章 Buyer核心板块
const buyerNav = [
  { id: 'workspace',  label: 'AI 工作台',   icon: <LayoutDashboard size={18} />, href: '/' },
  { id: 'opportunity',label: '商机中心',     icon: <Zap size={18} />,            href: '/opportunity' },
  { id: 'offer',      label: 'Offer 中心',   icon: <PackageCheck size={18} />,  href: '/offers' },
  { id: 'supplier',   label: '供应商中心',   icon: <Factory size={18} />,        href: '/suppliers' },
  { id: 'source',     label: '信源中心',     icon: <Search size={18} />,         href: '/supply-create' },
  { id: 'risk',       label: '风险中心',     icon: <ShieldAlert size={18} />,    href: '/risk' },
  { id: 'payment',    label: '付款中心',     icon: <DollarSign size={18} />,     href: '/orders' },
];

// CEO 导航
const ceoNav = [
  { id: 'workspace',  label: 'AI 工作台',   icon: <LayoutDashboard size={18} />, href: '/' },
  { id: 'dashboard',  label: '经营驾驶舱',   icon: <BarChart3 size={18} />,       href: '/ceo-dashboard' },
  { id: 'opportunity',label: '机会总览',     icon: <Zap size={18} />,            href: '/opportunity' },
  { id: 'risk',       label: '风险总览',     icon: <ShieldAlert size={18} />,    href: '/risk' },
  { id: 'agents',     label: 'Agent 治理',   icon: <Bot size={18} />,            href: '/agents' },
  { id: 'performance',label: '业绩总览',     icon: <TrendingUp size={18} />,     href: '/performance' },
];

// "我的Agent" — 放在底部 (SA-019 第22章: Agent在右侧)
const agentNav = [
  { id: 'agents',     label: 'Agent 中心',   icon: <Bot size={18} />,            href: '/agents' },
];

type NavItem = { id: string; label: string; icon: React.ReactNode; href: string };

function getNavForRole(role: string): { mainNav: NavItem[]; agentNav: NavItem[] } {
  switch (role) {
    case 'Sales': case 'SalesManager':
      return { mainNav: salesNav, agentNav };
    case 'Procurement': case 'ProcurementManager':
      return { mainNav: buyerNav, agentNav };
    case 'CEO':
      return { mainNav: ceoNav, agentNav };
    default:
      return { mainNav: salesNav, agentNav };
  }
}

export function Sidebar({ collapsed = false, onToggle, role = 'Procurement' }: { collapsed?: boolean; onToggle?: () => void; role?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { mainNav, agentNav: agentItems } = getNavForRole(role);

  function isActive(item: NavItem) {
    if (item.href === '/') return pathname === '/';
    return pathname.startsWith(item.href) && item.href !== '/';
  }

  const userDisplay = {
    Procurement: { name: '采购试点-1', dept: '采购部', level: 'L2' },
    Sales: { name: 'Sales Pilot', dept: '销售部', level: 'L3' },
    CEO: { name: 'Darren', dept: '管理层', level: 'CEO' },
  }[role] || { name: 'User', dept: 'Unknown', level: 'L1' };

  return (
    <aside className={clsx(
      'flex flex-col h-screen bg-[#F7F8FA] border-r border-[#E8EAED] transition-all duration-200',
      collapsed ? 'w-[64px]' : 'w-[240px]'
    )}>
      {/* Logo */}
      <div className={clsx('border-b border-[#E8EAED]', collapsed ? 'py-3' : 'py-4')}>
        <div className={clsx('flex justify-center', collapsed ? 'px-1' : 'px-4')}>
          <div className={clsx('relative', collapsed ? 'w-7 h-7' : 'w-28 h-8')}>
            <Image src="/ample-logo.webp" alt="ANOS" fill className="object-contain" priority />
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex justify-end px-2 py-1">
        <button onClick={onToggle} className="p-1 rounded hover:bg-black/5 text-gray-400">
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* User */}
      {!collapsed && (
        <div className="px-4 py-2.5 border-b border-[#E8EAED]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
              <User size={16} className="text-brand-600" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{userDisplay.name}</div>
              <div className="text-xs text-gray-500">{userDisplay.dept} · {userDisplay.level}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation — 角色价值流导航 */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="mb-1">
          {!collapsed && (
            <div className="px-4 py-1 text-xs font-semibold text-gray-300 uppercase tracking-wider">
              工作台
            </div>
          )}
          {mainNav.map(item => {
            const active = isActive(item);
            return (
              <button key={item.id} onClick={() => router.push(item.href)}
                className={clsx(
                  'w-full flex items-center gap-3 mx-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-150',
                  active
                    ? 'bg-brand-50 text-brand-700 font-semibold border-r-[3px] border-brand-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  collapsed && 'justify-center mx-1 px-0'
                )}>
                {item.icon}
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        {!collapsed && <div className="mx-4 my-2 border-t border-gray-100" />}

        {/* Agent 中心 (底部) */}
        {agentItems.map(item => {
          const active = isActive(item);
          return (
            <button key={item.id} onClick={() => router.push(item.href)}
              className={clsx(
                'w-full flex items-center gap-3 mx-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-150',
                active
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
                collapsed && 'justify-center mx-1 px-0'
              )}>
              {item.icon}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
