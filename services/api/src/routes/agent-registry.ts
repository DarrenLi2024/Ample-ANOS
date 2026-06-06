import { Hono } from 'hono';
import { jwtAuth } from '../middleware/jwt';
import fs from 'node:fs';
import path from 'node:path';


const REGISTRY_PATH = path.join(process.cwd(), 'agents', 'registry', 'agent-registry.yaml');

let cachedRegistry: any = null;
let cacheTime = 0;


function parseSimpleYaml(raw: string): any {
  const lines = raw.split('\n');
  const result: any = { agents: [] };
  let currentAgent: any = null;
  let currentArray: string | null = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Top-level key
    if (trimmed === 'agents:') continue;
    
    // Agent entry
    if (trimmed.startsWith('- id:')) {
      if (currentAgent) result.agents.push(currentAgent);
      currentAgent = {};
      currentArray = null;
      currentAgent.id = trimmed.replace('- id:', '').trim();
      continue;
    }
    
    if (!currentAgent) continue;
    
    // Array start
    if (trimmed.endsWith(':') && !trimmed.includes(': ')) {
      currentArray = trimmed.replace(':', '').trim();
      currentAgent[currentArray] = [];
      continue;
    }
    
    // Array item
    if (currentArray && trimmed.startsWith('- ')) {
      currentAgent[currentArray].push(trimmed.replace('- ', '').trim());
      continue;
    }
    
    // Key: value
    const kv = trimmed.split(': ');
    if (kv.length >= 2) {
      const key = kv[0].trim();
      const val = kv.slice(1).join(': ').trim();
      currentAgent[key] = isNaN(Number(val)) ? val : Number(val);
      currentArray = null;
    }
  }
  
  if (currentAgent) result.agents.push(currentAgent);
  return result;
}

function loadRegistry(): any {
  const now = Date.now();
  if (cachedRegistry && (now - cacheTime) < 30000) return cachedRegistry; // 30s cache
  
  const raw = fs.readFileSync(REGISTRY_PATH, 'utf-8');
  cachedRegistry = parseSimpleYaml(raw);
  cacheTime = now;
  return cachedRegistry;
}

export const agentRegistryRoutes = new Hono().use('*', jwtAuth);

// GET /api/agent-registry — 列出所有已注册的 Agent
agentRegistryRoutes.get('/', async (c) => {
  const registry = loadRegistry();
  const agents = (registry as any).agents.map((a: any) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    description: a.description,
    priority: a.priority,
  }));
  return c.json({ agents, total: agents.length });
});

// POST /api/agent-registry/match — 根据输入内容匹配最合适的 Agent
agentRegistryRoutes.post('/match', async (c) => {
  const { content } = await c.req.json() as any;
  const registry = loadRegistry();
  const lower = (content || '').toLowerCase();
  
  let bestMatch: any = null;
  let bestScore = 0;
  
  for (const agent of (registry as any).agents) {
    let score = 0;
    
    // Keyword matching
    for (const kw of (agent.trigger_keywords || [])) {
      if (lower.includes(kw)) score += 10;
    }
    
    // Pattern matching
    for (const pattern of (agent.trigger_patterns || [])) {
      try {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(content)) score += 15;
      } catch {}
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = agent;
    }
  }
  
  if (bestMatch) {
    return c.json({
      matched: true,
      agent: {
        id: bestMatch.id,
        name: bestMatch.name,
        type: bestMatch.type,
        endpoint: bestMatch.endpoint,
        description: bestMatch.description,
      },
      score: bestScore,
    });
  }
  
  // Default: first agent
  const defaultAgent = (registry as any).agents[0];
  return c.json({
    matched: false,
    agent: {
      id: defaultAgent.id,
      name: defaultAgent.name,
      type: defaultAgent.type,
      endpoint: defaultAgent.endpoint,
    },
    score: 0,
    reason: 'no_match_found',
  });
});
