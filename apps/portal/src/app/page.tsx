'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { KpiCard } from '@/components/KpiCard';
import { BottomCommandBar } from '@/components/BottomCommandBar';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Lightbulb,
  FileSearch,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [feed, setFeed] = useState<string[]>([]);

  const handleCommand = (input: string) => {
    setProcessing(true);
    setFeed((prev) => [`你: ${input}`, ...prev]);
    setTimeout(() => {
      setFeed((prev) => [`AI: 已收到指令「${input}」，正在分析...`, ...prev]);
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main + Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-12 px-6 bg-white border-b border-gray-200 shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">AI Inbox</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 px-2 py-1 bg-green-50 text-green-700 rounded">
              Sales Agent 在线
            </span>
            <span className="text-xs text-gray-500 px-2 py-1 bg-purple-50 text-purple-700 rounded">
              Procurement Agent 在线
            </span>
            <span className="text-xs text-gray-500 px-2 py-1 bg-orange-50 text-orange-700 rounded">
              Credit Agent 等候
            </span>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center: Workspace */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* KPI Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <KpiCard
                label="今日新增需求"
                value={12}
                change="+3 vs 昨日"
                trend="up"
                icon={<FileSearch size={16} />}
              />
              <KpiCard
                label="今日新增资源"
                value={8}
                change="+1 vs 昨日"
                trend="up"
                icon={<Package size={16} />}
              />
              <KpiCard
                label="今日新增风险"
                value={2}
                change="-1 vs 昨日"
                trend="down"
                icon={<AlertTriangle size={16} />}
              />
              <KpiCard
                label="今日新增商机"
                value={5}
                change="+2 vs 昨日"
                trend="up"
                icon={<Lightbulb size={16} />}
              />
            </div>

            {/* AI Feed / Activity Stream */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">动态流</h2>
              <div className="space-y-3">
                {feed.map((item, i) => (
                  <div key={i} className="p-4 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 page-enter">
                    {item}
                  </div>
                ))}
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap size={14} className="text-yellow-500" />
                    <span className="font-medium">新 RFQ 已解析</span>
                    <span className="text-gray-400">— 2分钟前</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    STM32F407VET6 × 5000pcs，客户华为，已自动生成 Inquiry INQ-20260602-001
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap size={14} className="text-blue-500" />
                    <span className="font-medium">新供应资源已录入</span>
                    <span className="text-gray-400">— 15分钟前</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    ESP32-WROOM-32E × 10000pcs，Arrow Electronics 报价 $1.85/pcs
                  </p>
                </div>
              </div>
            </div>

            {/* Agent Suggestions */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Agent 建议</h2>
              <AgentSuggestionCard
                agentName="Sales Agent"
                agentType="Sales"
                conclusion="客户华为 STM32F407VET6 询价建议报价 $4.20-4.50/pcs，基于近期成交价和库存水平。"
                evidence={['最近5笔成交均价 $4.35', '当前市场库存充足', '客户信用等级 AAA']}
                generatedAt="2026-06-02 10:35"
                confidenceScore={88}
                suggestedActions={[
                  { label: '确认报价 $4.35/pcs', risk: 'low' },
                  { label: '报价 $4.50/pcs（含buffer）', risk: 'medium' },
                ]}
                requiresApproval={true}
              />
            </div>
          </main>

          {/* Right Panel */}
          <aside className="w-[420px] border-l border-gray-200 bg-white overflow-y-auto p-4 shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">来源追溯</h3>

            <SourceCard
              source="华为技术有限公司采购部"
              sourceType="Email"
              sourceOwner="张经理"
              eventTime="2026-06-02 09:30"
              capturedAt="2026-06-02 09:32"
              verifiedBy="Tony Li"
              confidenceScore={95}
              status="verified"
            />

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">风险概览</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded text-sm">
                  <span>AR 逾期 &gt;90天</span>
                  <span className="text-red-600 font-bold">3 笔</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded text-sm">
                  <span>AR 逾期 30-90天</span>
                  <span className="text-yellow-600 font-bold">5 笔</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded text-sm">
                  <span>高风险客户</span>
                  <span className="text-red-600 font-bold">2 个</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Command Bar */}
        <BottomCommandBar
          onSubmit={handleCommand}
          processing={processing}
          agentThinking={processing ? 'AI 正在理解你的指令...' : undefined}
        />
      </div>
    </div>
  );
}
