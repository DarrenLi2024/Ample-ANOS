'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { Bot, CheckCircle, Clock, AlertTriangle, XCircle, Activity, Search, BookOpen, Shield, Cpu, Zap, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import React from 'react';

const agents = [
  { id: 'AG-SALES', name: 'Sales Agent', type: 'Sales', level: 'L3', status: 'Online', tasks: 12, completed: 347, desc: 'RFQ解析 · 客户摘要 · 报价建议 · 邮件草案' },
  { id: 'AG-PROC', name: 'Procurement Agent', type: 'Procurement', level: 'L2', status: 'Online', tasks: 8, completed: 215, desc: '资源解析 · 供应商比较 · 替代料建议' },
  { id: 'AG-CREDIT', name: 'Credit Agent', type: 'Credit', level: 'L3', status: 'WaitingApproval', tasks: 3, completed: 128, desc: 'AR风险识别 · 催收建议 · 信用评估' },
  { id: 'AG-KNOWLEDGE', name: 'Knowledge Agent', type: 'Knowledge', level: 'L2', status: 'Online', tasks: 5, completed: 89, desc: '知识检索 · SOP问答 · 产品知识查询' },
  { id: 'AG-CEO', name: 'CEO Agent', type: 'CEO', level: 'L2', status: 'Offline', tasks: 0, completed: 42, desc: '经营摘要 · 风险地图 · 预测分析' },
];

const statusConfig: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
  Online: { icon: <CheckCircle size={12} />, label: '在线', cls: 'tag-green' },
  Busy: { icon: <Activity size={12} />, label: '忙碌', cls: 'tag-blue' },
  WaitingApproval: { icon: <Clock size={12} />, label: '等待确认', cls: 'tag-yellow' },
  Error: { icon: <AlertTriangle size={12} />, label: '异常', cls: 'tag-red' },
  Offline: { icon: <XCircle size={12} />, label: '离线', cls: 'tag-gray' },
};

const knowledgeSkills = [
  { id: 'SK-001', name: '销售流程查询', icon: <Search size={15} />, color: 'tag-blue', source: '销售 SOP', desc: '客户开发、RFQ处理、报价审批、订单跟进', agent: 'Sales · CEO', examples: ['客户要求降价怎么处理？', '报价审批流程是什么？'] },
  { id: 'SK-002', name: '采购流程查询', icon: <BookOpen size={15} />, color: 'tag-purple', source: '采购 SOP', desc: '供应商开发、询价比价、采购执行、供应商管理', agent: 'Procurement · CEO', examples: ['新供应商怎么入库？', '紧急采购流程是什么？'] },
  { id: 'SK-003', name: '风控规则查询', icon: <Shield size={15} />, color: 'tag-red', source: '风控/回款规则', desc: '信用评估、AR逾期处理、催收流程、法务升级', agent: 'Credit · CEO', examples: ['客户逾期60天怎么处理？', '什么情况可以冻结信用？'] },
  { id: 'SK-004', name: '产品知识检索', icon: <Cpu size={15} />, color: 'tag-green', source: '产品知识库', desc: '品牌型号、封装、生命周期、国产替代、Datasheet', agent: 'Sales · Procurement · Knowledge', examples: ['STM32F407有国产替代吗？', 'MT41K256M16 生命周期？'] },
];

export default function AgentCenterPage() {
  const [selectedSkill, setSelectedSkill] = React.useState<string | null>(null);

  return (
    <WorkspaceLayout title="智能体中心"
      rightPanel={selectedSkill ? (() => { const s = knowledgeSkills.find(k => k.id === selectedSkill)!; return (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-sm">Skill 详情</h3><button onClick={()=>setSelectedSkill(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={16}/></button></div>
          <div className="flex items-center gap-3 mb-4"><span className={clsx('tag', s.color)}>{s.icon}</span><div><div className="font-semibold text-sm">{s.name}</div><div className="text-xs text-gray-400">{s.source}</div></div></div>
          <p className="text-xs text-gray-600 mb-4">{s.desc}</p>
          <div className="mb-4"><h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">调用示例</h4>
            {s.examples.map((ex,i)=><div key={i} className="p-3 bg-gray-50 rounded text-xs text-gray-700 mb-1.5">{ex}</div>)}
          </div>
          <div className="mb-4"><h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">绑定 Agent</h4><div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">{s.agent}</div></div>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded text-xs text-amber-700">⚠ Phase 2: 对接飞书知识库 API 后，知识检索将返回真实文档内容。</div>
        </div>
      )})() : (
        <div className="p-4"><h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3"><Zap size={14} className="inline mr-1"/>快速触发</h3>
          <div className="space-y-2">{knowledgeSkills.flatMap(s=>s.examples.slice(0,1).map((ex,i)=>
            <button key={`${s.id}-${i}`} onClick={()=>setSelectedSkill(s.id)} className="w-full text-left p-3 border border-gray-100 rounded-md text-xs text-gray-600 hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-800">{ex}</span><div className="flex items-center gap-1 mt-1">{s.icon}<span className="text-gray-400">{s.source}</span></div>
            </button>))}
          </div>
        </div>
      )}
    >
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xs font-semibold text-gray-400 uppercase tracking-wide mb-3">在线 Agent</h2>
          <div className="grid grid-cols-3 gap-4">
            {agents.map(agent => { const s = statusConfig[agent.status]; if (!s) return null; return (
              <div key={agent.id} className="proto-card p-4 animate-in">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3"><Bot size={24} className="text-brand-500"/><div><div className="font-semibold text-sm">{agent.name}</div><div className="text-xs text-gray-400">{agent.type} · Level {agent.level}</div></div></div>
                  <span className={clsx('tag flex items-center gap-1', s.cls)}>{s.icon}{s.label}</span>
                </div>
                <p className="text-2xs text-gray-500 mb-3">{agent.desc}</p>
                <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div><span className="block text-gray-400">当前任务</span><span className="font-semibold text-gray-900">{agent.tasks}</span></div>
                  <div><span className="block text-gray-400">累计完成</span><span className="font-semibold text-gray-900">{agent.completed}</span></div>
                </div>
              </div>
            )})}
          </div>
        </div>

        <div>
          <h2 className="text-2xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Knowledge Agent · Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            {knowledgeSkills.map(sk => (
              <button key={sk.id} onClick={()=>setSelectedSkill(sk.id)} className={clsx('proto-card p-4 text-left hover:border-brand-300 transition-all cursor-pointer', selectedSkill===sk.id && 'ring-2 ring-brand-100 border-brand-300')}>
                <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><span className={clsx('tag', sk.color)}>{sk.icon}</span><span className="font-semibold text-xs">{sk.name}</span></div><ChevronRight size={14} className="text-gray-300"/></div>
                <p className="text-2xs text-gray-500 mb-2">{sk.desc}</p>
                <div className="flex items-center gap-2 text-3xs text-gray-400"><span>{sk.source}</span><span>·</span><span>{sk.agent}</span></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
