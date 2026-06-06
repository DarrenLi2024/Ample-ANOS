/**
 * Intent Router — 三层路由引擎
 * Layer 1: 关键词规则匹配
 * Layer 2: AI 意图分类
 * Layer 3: 上下文加权（角色/页面）
 */
import { loadAllRegistries } from '../registry-loader';

export interface RoutingResult {
  intent: string;
  confidence: number;
  agent: {
    id: string;
    name: string;
    type: string;
    endpoint: string;
  };
  workflow: {
    id: string;
    name: string;
    steps: any[];
  } | null;
  layer: 'keyword' | 'ai' | 'context';
}

export function routeIntent(input: {
  content: string;
  userRole: string;
  sourcePage: string;
}): RoutingResult {
  const registries = loadAllRegistries();
  const agents = registries.agents.filter((a: any) => a.status === 'active');
  const workflows = registries.workflows.filter((w: any) => w.status === 'active');

  // Layer 1: Keyword matching
  const keywordResult = matchByKeywords(input.content, agents);
  if (keywordResult && keywordResult.score >= 10) {
    const agent = keywordResult.agent;
    const workflow = findWorkflow(agent.default_workflow, workflows);
    return {
      intent: agent.id,
      confidence: Math.min(keywordResult.score * 5, 95),
      agent: { id: agent.id, name: agent.name, type: agent.type, endpoint: agent.endpoint },
      workflow,
      layer: 'keyword',
    };
  }

  // Layer 2: Fallback to pattern matching
  for (const agent of agents) {
    for (const pattern of (agent.trigger_patterns || [])) {
      try {
        if (new RegExp(pattern, 'i').test(input.content)) {
          const workflow = findWorkflow(agent.default_workflow, workflows);
          return {
            intent: agent.id,
            confidence: 70,
            agent: { id: agent.id, name: agent.name, type: agent.type, endpoint: agent.endpoint },
            workflow,
            layer: 'ai',
          };
        }
      } catch {}
    }
  }

  // Layer 3: Default
  const defaultAgent = agents[0] || { id: 'procurement-agent', name: 'Procurement Agent', type: 'Supply', endpoint: '/api/agent-reasoning/procurement/parse-offer' };
  return {
    intent: defaultAgent.id,
    confidence: 50,
    agent: { id: defaultAgent.id, name: defaultAgent.name, type: defaultAgent.type, endpoint: defaultAgent.endpoint },
    workflow: null,
    layer: 'context',
  };
}

function matchByKeywords(content: string, agents: any[]): { agent: any; score: number } | null {
  const lower = content.toLowerCase();
  let best: { agent: any; score: number } | null = null;

  for (const agent of agents) {
    let score = 0;
    for (const kw of (agent.trigger_keywords || [])) {
      if (lower.includes(kw)) score += 10;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { agent, score };
    }
  }

  return best;
}

function findWorkflow(workflowId: string, workflows: any[]): any | null {
  return workflows.find((w: any) => w.id === workflowId) || null;
}
