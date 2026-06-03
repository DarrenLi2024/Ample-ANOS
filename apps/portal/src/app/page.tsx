'use client';
import { useState } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { KpiCard } from '@/components/KpiCard';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { TaskCard } from '@/components/TaskCard';
import { AIChatPanel } from '@/components/AIChatPanel';
import { FileSearch, Package, AlertTriangle, Lightbulb, TrendingUp, Zap } from 'lucide-react';

export default function HomePage() {
  const [feed] = useState([
    { icon: <Zap size={14} className="text-amber-500" />, title: '新 RFQ 已解析', desc: 'STM32F407VET6 × 5,000pcs · 华为', time: '2分钟前' },
    { icon: <TrendingUp size={14} className="text-green-500" />, title: '新供应资源已录入', desc: 'ESP32-WROOM-32E × 10,000pcs · Arrow $1.85/pcs', time: '15分钟前' },
    { icon: <AlertTriangle size={14} className="text-red-500" />, title: 'AR 风险预警', desc: '汇顶科技逾期 95 天 · $380,000', time: '1小时前' },
    { icon: <Lightbulb size={14} className="text-brand-500" />, title: '新商机匹配', desc: '比亚迪 TMS320F28335 × Arrow 匹配度 85%', time: '2小时前' },
  ]);

  return (
    <WorkspaceLayout title="AI 智能工作台"
      agentStatuses={[
        { label: 'Sales Agent', color: 'tag tag-green' },
        { label: 'Procurement Agent', color: 'tag tag-purple' },
        { label: 'Credit Agent', color: 'tag tag-yellow' },
      ]}
      rightPanel={
        <div className="p-4 space-y-5">
          {/* Agent Dock (11号文档第7章) */}
          <div className="proto-card p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Agent Dock</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" />Sales Agent <span className="text-gray-400 ml-auto">12任务</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full" />Procurement <span className="text-gray-400 ml-auto">8任务</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full" />Credit Agent <span className="text-gray-400 ml-auto">3预警</span></div>
            </div>
          </div>
          {/* 右侧场景: 销售分析+风控 */}
          <SourceCard source="华为技术采购部" sourceType="Email" sourceOwner="张经理" eventTime="2026-06-02 09:30" capturedAt="2026-06-02 09:32" verifiedBy="Tony Li" confidenceScore={95} status="verified" />
          <div className="proto-card p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">风险概览</h3>
            <div className="space-y-2">
              <div className="flex justify-between p-3 border border-gray-100 rounded text-sm"><span>AR 逾期 &gt;90天</span><span className="font-bold text-red-600">3笔</span></div>
              <div className="flex justify-between p-3 border border-gray-100 rounded text-sm"><span>高风险客户</span><span className="font-bold text-red-600">2个</span></div>
            </div>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* 4卡KPI */}
        <div className="grid grid-cols-4 gap-4 auto-rows-fr">
          <KpiCard label="今日新增需求" value={12} change="+3 vs 昨日" trend="up" icon={<FileSearch size={15} />} />
          <KpiCard label="今日新增资源" value={8} change="+1 vs 昨日" trend="up" icon={<Package size={15} />} />
          <KpiCard label="今日新增风险" value={2} change="-1 vs 昨日" trend="down" icon={<AlertTriangle size={15} />} />
          <KpiCard label="今日新增商机" value={5} change="+2 vs 昨日" trend="up" icon={<Lightbulb size={15} />} />
        </div>

        {/* AI对话面板 + 任务卡片 并行 */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <div className="proto-card overflow-hidden" style={{ height: '340px' }}>
            <div className="px-4 py-2 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase">AI 会话</div>
            <AIChatPanel />
          </div>
          <div className="space-y-3" style={{ height: "340px", overflowY: "auto" }}>
            <div className="text-xs font-semibold text-gray-400 uppercase px-1">待处理任务</div>
            <TaskCard title="审核报价 OFF-003" object="华为 · STM32F407VET6" assignee="Darren Li" dueDate="今天" aiSuggestion="建议报价 $4.35/pcs，基于近期成交均价" priority="high" />
            <TaskCard title="催收 AR-001" object="汇顶科技 · $380K" assignee="风控团队" dueDate="今天" aiSuggestion="已逾期95天，建议停单+法务催收" priority="urgent" />
          </div>
        </div>

        {/* 动态流 */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">动态流</h2>
          <div className="space-y-2">
            {feed.map((item, i) => (
              <div key={i} className="proto-card p-4 flex items-start gap-3">
                <div className="mt-0.5">{item.icon}</div>
                <div className="flex-1"><div className="flex justify-between"><span className="text-sm font-semibold">{item.title}</span><span className="text-xs text-gray-400">{item.time}</span></div><p className="text-sm text-gray-500 mt-0.5">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>

        <AgentSuggestionCard agentName="Sales Agent" agentType="Sales"
          conclusion="华为 STM32F407VET6 询价建议报价 $4.20-4.50/pcs，基于近期成交价和库存水平。"
          evidence={['近5笔成交均价 $4.35', '市场库存充足', '客户信用 AAA']}
          sourceId="SRC-001" generatedAt="2026-06-02 10:35" confidenceScore={88}
          suggestedActions={[{ label: '确认报价 $4.35/pcs', risk: 'low' }, { label: '报价 $4.50/pcs（含buffer）', risk: 'medium' }]}
          requiresApproval={true} />
      </div>
    </WorkspaceLayout>
  );
}
