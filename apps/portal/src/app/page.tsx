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
    setFeed(prev => [`你: ${input}`, ...prev]);
    setTimeout(() => setFeed(prev => [`AI: 已收到指令「${input}」，正在分析...`, ...prev]), 1200);
  };

  const agentStatuses = [
    { label: 'Sales Agent 在线', color: 'badge badge-green' },
    { label: 'Procurement Agent 在线', color: 'badge badge-purple' },
    { label: 'Credit Agent 等待', color: 'badge badge-yellow' },
  ];

  return (
    <WorkspaceLayout
      title="AI Inbox"
      commandBarPlaceholder="今天你想完成什么？输入指令或上传文件..."
      onCommand={handleCommand}
      agentStatuses={agentStatuses}
      rightPanel={
        <>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-3">来源追溯</h3>
          <SourceCard source="华为技术有限公司采购部" sourceType="Email" sourceOwner="张经理"
            eventTime="2026-06-02 09:30" capturedAt="2026-06-02 09:32" verifiedBy="Tony Li"
            confidenceScore={95} status="verified" />
          <div className="mt-5">
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-3">风险概览</h3>
            <div className="space-y-2">
              <div className="flex justify-between p-3 border border-border-light rounded-sm text-sm"><span>AR 逾期 &gt;90天</span><span className="font-bold text-danger">3 笔</span></div>
              <div className="flex justify-between p-3 border border-border-light rounded-sm text-sm"><span>高风险客户</span><span className="font-bold text-danger">2 个</span></div>
            </div>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-5 mb-8">
        <KpiCard label="今日新增需求" value={12} change="+3 vs 昨日" trend="up" icon={<FileSearch size={15} />} />
        <KpiCard label="今日新增资源" value={8} change="+1 vs 昨日" trend="up" icon={<Package size={15} />} />
        <KpiCard label="今日新增风险" value={2} change="-1 vs 昨日" trend="down" icon={<AlertTriangle size={15} />} />
        <KpiCard label="今日新增商机" value={5} change="+2 vs 昨日" trend="up" icon={<Lightbulb size={15} />} />
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-4">动态流</h2>
        <div className="space-y-3">
          {feed.map((item, i) => (
            <div key={i} className="card-gradient p-4 text-sm text-text-secondary animate-in-up">{item}</div>
          ))}
          <div className="card-gradient p-4">
            <div className="flex items-center gap-2 text-sm mb-1"><Zap size={13} className="text-warning" /><span className="font-medium text-text-primary">新 RFQ 已解析</span><span className="text-text-tertiary text-xs ml-auto">2分钟前</span></div>
            <p className="text-sm text-text-secondary">STM32F407VET6 × 5000pcs，客户华为，已生成 Inquiry</p>
          </div>
          <div className="card-gradient p-4">
            <div className="flex items-center gap-2 text-sm mb-1"><Zap size={13} className="text-brand" /><span className="font-medium text-text-primary">新供应资源已录入</span><span className="text-text-tertiary text-xs ml-auto">15分钟前</span></div>
            <p className="text-sm text-text-secondary">ESP32-WROOM-32E × 10000pcs，Arrow 报价 $1.85/pcs</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-4">Agent 建议</h2>
        <AgentSuggestionCard agentName="Sales Agent" agentType="Sales"
          conclusion="华为 STM32F407VET6 询价建议报价 $4.20-4.50/pcs，基于近期成交价和库存水平。"
          evidence={['最近5笔成交均价 $4.35', '市场库存充足', '客户信用等级 AAA']}
          sourceId="SRC-001" generatedAt="2026-06-02 10:35" confidenceScore={88}
          suggestedActions={[{ label: '确认报价 $4.35/pcs', risk: 'low' }, { label: '报价 $4.50/pcs（含buffer）', risk: 'medium' }]}
          requiresApproval={true} />
      </div>
    </WorkspaceLayout>
  );
}
