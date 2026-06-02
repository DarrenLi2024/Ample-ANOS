'use client';
import { useState } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { KpiCard } from '@/components/KpiCard';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { FileSearch, Package, AlertTriangle, Lightbulb, TrendingUp, Zap } from 'lucide-react';

export default function HomePage() {
  const [feed] = useState([
    { icon: <Zap size={14} className="text-amber-500" />, title: '新 RFQ 已解析', desc: 'STM32F407VET6 × 5,000pcs · 华为', time: '2分钟前' },
    { icon: <TrendingUp size={14} className="text-green-500" />, title: '新供应资源已录入', desc: 'ESP32-WROOM-32E × 10,000pcs · Arrow $1.85/pcs', time: '15分钟前' },
    { icon: <AlertTriangle size={14} className="text-red-500" />, title: 'AR 风险预警', desc: '汇顶科技逾期 95 天 · $380,000', time: '1小时前' },
    { icon: <Lightbulb size={14} className="text-brand-500" />, title: '新商机匹配', desc: '比亚迪 TMS320F28335 × Arrow 匹配度 85%', time: '2小时前' },
  ]);

  return (
    <WorkspaceLayout
      title="AI 智能工作台"
      agentStatuses={[
        { label: 'Sales Agent', color: 'tag tag-blue' },
        { label: 'Procurement Agent', color: 'tag tag-purple' },
        { label: 'Credit Agent', color: 'tag tag-yellow' },
      ]}
      topBarChildren={
        <div className="flex items-center gap-2 ml-6">
          <button className="px-3 py-1.5 text-xs rounded-md bg-brand-500 text-white font-medium">Today</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">本周</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">本月</button>
        </div>
      }
      rightPanel={
        <div className="p-4 space-y-5">
          <SourceCard source="华为技术有限公司采购部" sourceType="Email" sourceOwner="张经理"
            eventTime="2026-06-02 09:30" capturedAt="2026-06-02 09:32" verifiedBy="Tony Li" confidenceScore={95} status="verified" />

          <div className="proto-card p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">供需匹配</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">STM32F407VET6</span>
                <span className="text-brand-600 font-medium">匹配度 92%</span>
              </div>
              <div className="progress-bar"><div className="progress-bar-fill bg-brand-500" style={{width:'92%'}} /></div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">TMS320F28335PGFA</span>
                <span className="text-brand-600 font-medium">匹配度 85%</span>
              </div>
              <div className="progress-bar"><div className="progress-bar-fill bg-brand-500" style={{width:'85%'}} /></div>
            </div>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="今日新增需求" value={12} change="+3 vs 昨日" trend="up" icon={<FileSearch size={15} />} />
          <KpiCard label="今日新增资源" value={8} change="+1 vs 昨日" trend="up" icon={<Package size={15} />} />
          <KpiCard label="今日新增风险" value={2} change="-1 vs 昨日" trend="down" icon={<AlertTriangle size={15} />} />
          <KpiCard label="今日新增商机" value={5} change="+2 vs 昨日" trend="up" icon={<Lightbulb size={15} />} />
        </div>

        {/* 动态流 */}
        <div>
          <h2 className="text-2xs font-semibold text-gray-400 uppercase tracking-wide mb-3">动态流</h2>
          <div className="space-y-3">
            {feed.map((item, i) => (
              <div key={i} className="proto-card p-4 flex items-start gap-3">
                <div className="mt-0.5">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800">{item.title}</span>
                    <span className="text-3xs text-gray-400">{item.time}</span>
                  </div>
                  <p className="text-2xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent 建议 */}
        <div>
          <h2 className="text-2xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Agent 建议</h2>
          <AgentSuggestionCard agentName="Sales Agent" agentType="Sales"
            conclusion="华为 STM32F407VET6 询价建议报价 $4.20-4.50/pcs，基于近期成交均价 $4.35 和当前市场库存水平。客户信用等级 AAA，建议优先响应。"
            evidence={['近5笔成交均价 $4.35', '当前市场库存充足(8000+)', '客户信用等级 AAA', '历史成交率 92%']}
            sourceId="SRC-001" generatedAt="2026-06-02 10:35" confidenceScore={88}
            suggestedActions={[
              { label: '确认报价 $4.35/pcs (推荐)', risk: 'low' },
              { label: '报价 $4.50/pcs (含 buffer)', risk: 'medium' },
            ]}
            requiresApproval={true} />
        </div>
      </div>
    </WorkspaceLayout>
  );
}
