'use client';

import { useState } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { KpiCard } from '@/components/KpiCard';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { FileSearch, Package, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

export default function HomePage() {
  const [feed, setFeed] = useState<string[]>([]);

  const handleCommand = (input: string) => {
    setFeed((prev) => [`你: ${input}`, ...prev]);
    setTimeout(() => {
      setFeed((prev) => [`AI: 已收到指令「${input}」，正在分析...`, ...prev]);
    }, 1200);
  };

  return (
    <WorkspaceLayout
      title="AI Inbox"
      commandBarPlaceholder="今天你想完成什么？输入指令或上传文件..."
      onCommand={handleCommand}
      agentStatuses={[
        { label: 'Sales Agent 在线', color: 'text-xs text-green-700 bg-green-50 px-2 py-1 rounded' },
        { label: 'Procurement Agent 在线', color: 'text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded' },
        { label: 'Credit Agent 等待', color: 'text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded' },
      ]}
      rightPanel={
        <>
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
                <span>高风险客户</span>
                <span className="text-red-600 font-bold">2 个</span>
              </div>
            </div>
          </div>
        </>
      }
    >
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="今日新增需求" value={12} change="+3 vs 昨日" trend="up" icon={<FileSearch size={16} />} />
        <KpiCard label="今日新增资源" value={8} change="+1 vs 昨日" trend="up" icon={<Package size={16} />} />
        <KpiCard label="今日新增风险" value={2} change="-1 vs 昨日" trend="down" icon={<AlertTriangle size={16} />} />
        <KpiCard label="今日新增商机" value={5} change="+2 vs 昨日" trend="up" icon={<Lightbulb size={16} />} />
      </div>

      {/* Activity Feed */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">动态流</h2>
        <div className="space-y-3">
          {feed.map((item, i) => (
            <div key={i} className="p-4 bg-white rounded-lg border border-gray-200 text-sm page-enter">{item}</div>
          ))}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <Zap size={14} className="text-yellow-500" />
              <span className="font-medium">新 RFQ 已解析</span>
              <span className="text-gray-400">— 2分钟前</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">STM32F407VET6 × 5000pcs，客户华为，已自动生成 Inquiry</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <Zap size={14} className="text-blue-500" />
              <span className="font-medium">新供应资源已录入</span>
              <span className="text-gray-400">— 15分钟前</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">ESP32-WROOM-32E × 10000pcs，Arrow 报价 $1.85/pcs</p>
          </div>
        </div>
      </div>

      {/* Agent Suggestions */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Agent 建议</h2>
        <AgentSuggestionCard
          agentName="Sales Agent"
          agentType="Sales"
          conclusion="华为 STM32F407VET6 询价建议报价 $4.20-4.50/pcs，基于近期成交价和库存水平。"
          evidence={['最近5笔成交均价 $4.35', '市场库存充足', '客户信用等级 AAA']}
          sourceId="SRC-001"
          generatedAt="2026-06-02 10:35"
          confidenceScore={88}
          suggestedActions={[
            { label: '确认报价 $4.35/pcs', risk: 'low' },
            { label: '报价 $4.50/pcs（含buffer）', risk: 'medium' },
          ]}
          requiresApproval={true}
        />
      </div>
    </WorkspaceLayout>
  );
}
