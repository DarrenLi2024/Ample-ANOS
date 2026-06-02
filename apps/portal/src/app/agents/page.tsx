'use client';
import React from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { Bot, CheckCircle, Clock, AlertTriangle, XCircle, Activity, Search, BookOpen, Shield, Cpu, Zap, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

// ============================================================================
// Agent 列表
// ============================================================================
const agents = [
  { id: 'AG-SALES', name: 'Sales Agent', type: 'Sales', level: 'L3_Reasoning', status: 'Online', tasks: 12, completed: 347, desc: 'RFQ解析、客户摘要、报价建议、邮件草案' },
  { id: 'AG-PROC', name: 'Procurement Agent', type: 'Procurement', level: 'L2_Knowledge', status: 'Online', tasks: 8, completed: 215, desc: '资源解析、供应商比较、替代料建议' },
  { id: 'AG-CREDIT', name: 'Credit Agent', type: 'Credit', level: 'L3_Reasoning', status: 'WaitingApproval', tasks: 3, completed: 128, desc: 'AR风险识别、催收建议、停单建议' },
  { id: 'AG-KNOWLEDGE', name: 'Knowledge Agent', type: 'Knowledge', level: 'L2_Knowledge', status: 'Online', tasks: 5, completed: 89, desc: '知识检索、SOP问答、产品知识查询' },
  { id: 'AG-CEO', name: 'CEO Agent', type: 'CEO', level: 'L2_Knowledge', status: 'Offline', tasks: 0, completed: 42, desc: '经营摘要、风险地图、预测分析' },
];

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  Online: { icon: <CheckCircle size={14} />, label: '在线', color: 'text-green-600 bg-green-50' },
  Busy: { icon: <Activity size={14} />, label: '忙碌', color: 'text-blue-600 bg-blue-50' },
  WaitingApproval: { icon: <Clock size={14} />, label: '等待确认', color: 'text-yellow-600 bg-yellow-50' },
  Error: { icon: <AlertTriangle size={14} />, label: '异常', color: 'text-red-600 bg-red-50' },
  Offline: { icon: <XCircle size={14} />, label: '离线', color: 'text-gray-500 bg-gray-100' },
};

// ============================================================================
// Knowledge Agent Skills (4个知识源Skill)
// ============================================================================
const knowledgeSkills = [
  {
    id: 'SKILL-001',
    name: '销售流程查询',
    icon: <Search size={16} />,
    color: 'bg-blue-100 text-blue-700',
    source: '销售 SOP',
    desc: '客户开发、RFQ处理、报价审批、订单跟进流程',
    agent: 'Sales Agent · CEO Agent',
    triggerWords: ['报价流程', '客户开发', 'RFQ处理', '如何报价'],
    examples: ['客户要求降价怎么处理？', '报价审批流程是什么？'],
  },
  {
    id: 'SKILL-002',
    name: '采购流程查询',
    icon: <BookOpen size={16} />,
    color: 'bg-purple-100 text-purple-700',
    source: '采购 SOP',
    desc: '供应商开发、询价比价、采购执行、供应商管理',
    agent: 'Procurement Agent · CEO Agent',
    triggerWords: ['采购流程', '供应商开发', '询价', '比价'],
    examples: ['新供应商怎么入库？', '紧急采购流程是什么？'],
  },
  {
    id: 'SKILL-003',
    name: '风控规则查询',
    icon: <Shield size={16} />,
    color: 'bg-red-100 text-red-700',
    source: '风控/回款规则',
    desc: '信用评估、AR逾期处理、催收流程、法务升级',
    agent: 'Credit Agent · CEO Agent',
    triggerWords: ['风控', '信用评估', 'AR逾期', '催收', '停单'],
    examples: ['客户逾期60天怎么处理？', '什么情况下可以冻结客户信用？'],
  },
  {
    id: 'SKILL-004',
    name: '产品知识检索',
    icon: <Cpu size={16} />,
    color: 'bg-green-100 text-green-700',
    source: '产品知识库',
    desc: '品牌型号、封装、生命周期、国产替代、Datasheet',
    agent: 'Sales Agent · Procurement Agent · Knowledge Agent',
    triggerWords: ['产品', '型号', '品牌', 'EOL', '国产替代', 'Datasheet'],
    examples: ['STM32F407VET6 有国产替代吗？', 'MT41K256M16 的生命周期状态？'],
  },
];

export default function AgentCenterPage() {
  const [selectedSkill, setSelectedSkill] = React.useState<string | null>(null);

  return (
    <WorkspaceLayout
      title="Agent Center — 智能体中心"
      commandBarPlaceholder="例如: STM32F407VET6有国产替代吗？"
      rightPanel={
        selectedSkill ? (
          <SkillDetailPanel
            skill={knowledgeSkills.find((s) => s.id === selectedSkill)!}
            onClose={() => setSelectedSkill(null)}
          />
        ) : (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              <Zap size={14} className="inline mr-1" />
              快速触发示例
            </h3>
            <div className="space-y-2">
              {knowledgeSkills.flatMap((s) =>
                s.examples.slice(0, 1).map((ex, i) => (
                  <button
                    key={`${s.id}-${i}`}
                    onClick={() => setSelectedSkill(s.id)}
                    className="w-full text-left p-3 border border-gray-100 rounded text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{ex}</span>
                    <div className="flex items-center gap-1 mt-1">
                      {s.icon}
                      <span className="text-gray-400">{s.source}</span>
                    </div>
                  </button>
                )),
              )}
            </div>
          </div>
        )
      }
    >
      {/* Agent Cards */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">在线 Agent</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {agents.map((agent) => {
          const s = statusConfig[agent.status];
          if (!s) return null;
          return (
            <div key={agent.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Bot size={28} className="text-primary-500" />
                  <div>
                    <div className="font-semibold text-sm">{agent.name}</div>
                    <div className="text-xs text-gray-400">{agent.type} · {agent.level}</div>
                  </div>
                </div>
                <span className={clsx('text-xs px-2 py-1 rounded flex items-center gap-1', s.color)}>
                  {s.icon} {s.label}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{agent.desc}</p>
              <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div><span className="block text-gray-400">当前任务</span><span className="font-semibold text-gray-900">{agent.tasks}</span></div>
                <div><span className="block text-gray-400">累计完成</span><span className="font-semibold text-gray-900">{agent.completed}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Knowledge Agent Skills */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Knowledge Agent · Skills
        <span className="ml-2 text-xs font-normal text-gray-400">(Agent 可智能调用的知识技能)</span>
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {knowledgeSkills.map((skill) => (
          <button
            key={skill.id}
            onClick={() => setSelectedSkill(skill.id)}
            className={clsx(
              'bg-white rounded-lg border p-4 text-left hover:shadow-sm transition-all cursor-pointer',
              selectedSkill === skill.id ? 'border-primary-300 ring-2 ring-primary-100' : 'border-gray-200 hover:border-gray-300',
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={clsx('p-1.5 rounded', skill.color)}>{skill.icon}</span>
                <span className="font-semibold text-sm">{skill.name}</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
            <p className="text-xs text-gray-500 mb-2">{skill.desc}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {skill.triggerWords.slice(0, 3).map((word) => (
                <span key={word} className="text-xs px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded">{word}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{skill.source}</span>
              <span>·</span>
              <span>{skill.agent}</span>
            </div>
          </button>
        ))}
      </div>
    </WorkspaceLayout>
  );
}

// ============================================================================
// Skill 详情面板
// ============================================================================
function SkillDetailPanel({ skill, onClose }: { skill: (typeof knowledgeSkills)[0]; onClose: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Skill 详情</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XCircle size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className={clsx('p-2 rounded-lg', skill.color)}>{skill.icon}</span>
        <div>
          <div className="font-semibold text-sm">{skill.name}</div>
          <div className="text-xs text-gray-400">{skill.source}</div>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">{skill.desc}</p>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">触发关键词</h4>
        <div className="flex flex-wrap gap-1">
          {skill.triggerWords.map((w) => (
            <span key={w} className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded">{w}</span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">调用示例</h4>
        <div className="space-y-2">
          {skill.examples.map((ex, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded text-xs text-gray-700">
              {ex}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">绑定 Agent</h4>
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
          {skill.agent}
        </div>
      </div>

      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-700">
        ⚠️ Phase 2: 对接飞书知识库 API 后，知识检索将返回真实文档内容。
        当前为 Skill 注册展示，演示 Agent 调用链路。
      </div>
    </div>
  );
}
