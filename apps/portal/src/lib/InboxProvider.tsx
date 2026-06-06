'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createSession, saveSession } from './ai-native/command-session.store';

// ============================================================================
// Types
// ============================================================================
type Intent = 'Demand' | 'Supply' | 'Knowledge' | 'Risk' | 'Query' | 'Unknown';

interface ParsedFields {
  mpn?: string;
  brand?: string;
  qty?: number;
  price?: number;
  dateCode?: string;
}

interface ClassifyResult {
  intent: Intent;
  summary: string;
  fields: ParsedFields;
  allMpns: string[];
}

interface SessionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  intent?: string;
  action?: string;
  targetId?: string;
  parsed?: ParsedFields;
  suggestions?: string[];
}

interface InboxContextType {
  messages: SessionMessage[];
  processing: boolean;
  agentThinking: string;
  refreshTrigger: number;
  handleInput: (rawInput: string) => Promise<void>;
  clearMessages: () => void;
}

const InboxContext = createContext<InboxContextType>({
  messages: [], processing: false, agentThinking: '', refreshTrigger: 0,
  handleInput: async () => {}, clearMessages: () => {},
});

export function useInbox() { return useContext(InboxContext); }

// ============================================================================
// Intent Classifier (Global — all pages share this)
// ============================================================================
function classifyIntent(text: string): ClassifyResult {
  const lower = text.toLowerCase();
  const mpnMatch = text.match(/[A-Z]{2,}\d{2,}[A-Z\d\-]*/g);
  const mpn = mpnMatch?.[0] || undefined;
  const allMpns = mpnMatch || [];

  // Quantity: 200K, 1319pcs, 5000片
  const qtyMatch = text.match(/(\d{2,})\s*(个|pcs|片|颗|[Kk])/);
  let qty: number | undefined;
  if (qtyMatch) {
    qty = parseInt(qtyMatch[1]);
    if (qtyMatch[2]?.toLowerCase() === 'k') qty *= 1000;
  }

  // Price
  const priceMatch = text.match(/\$?(\d+\.?\d*)/);
  const price = priceMatch ? parseFloat(priceMatch[1]) : undefined;

  // DateCode
  const dcMatch = text.match(/(\d{2})\+/);
  const dateCode = dcMatch ? dcMatch[1] + '+' : undefined;

  // Brand
  const brandMatch = text.match(/\b(ST|TI|ADI|Intel|AMD|Micron|Microchip|Winbond|Espressif|NXP|Infineon|MT|GRM|GD|AT|MAX|LM|OPA|TLV|SN|LAN|DP|ISO|AD)\b/i);
  const brand = brandMatch?.[1] || undefined;

  const fields: ParsedFields = { mpn, brand, qty, price, dateCode };

  const queryKw = ['查看','查询','最新','列表','显示','有哪些','帮我查','看看','show','list'];
  const demandKw = ['询价','rfq','需要','买','find','looking','需求','求购','帮我找','要买','采购'];
  const supplyKw = ['供应','现货','库存','offer','supply','可出','有货','渠道','报价单','代理','有人接','联系','批次','原装','正品','全新','出','尾数','原厂'];
  const riskKw = ['逾期','风险','催收','ar','信用','回款','欠款'];

  const hasQuery = queryKw.some(k => lower.includes(k));
  const hasDemand = demandKw.some(k => lower.includes(k));
  const hasSupply = supplyKw.some(k => lower.includes(k));
  const hasRisk = riskKw.some(k => lower.includes(k));

  if (hasQuery) {
    if (/offer|supply|供应|资源/i.test(lower)) return { intent: 'Query', summary: '查询供应资源', fields, allMpns };
    if (/inquiry|询价|需求|rfq/i.test(lower)) return { intent: 'Query', summary: '查询询价需求', fields, allMpns };
    if (/ar|风险|逾期/i.test(lower)) return { intent: 'Query', summary: '查询风险信息', fields, allMpns };
    return { intent: 'Query', summary: '通用查询', fields, allMpns };
  }
  if (hasDemand) return { intent: 'Demand', summary: `客户需求${mpn ? ': ' + mpn : ''}`, fields, allMpns };
  if (hasSupply) return { intent: 'Supply', summary: `供应资源${mpn ? ': ' + mpn : ''}`, fields, allMpns };
  if (hasRisk) return { intent: 'Risk', summary: '风险事件', fields, allMpns };
  if (mpn && qty) return { intent: 'Demand', summary: `需求: ${mpn} x ${qty}`, fields, allMpns };
  if (mpn) return { intent: 'Supply', summary: `供应: ${mpn}`, fields, allMpns };
  return { intent: 'Unknown', summary: '通用资产', fields, allMpns };
}

// ============================================================================
// Provider
// ============================================================================
export function InboxProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [agentThinking, setAgentThinking] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const addMessage = useCallback((msg: SessionMessage) => {
    setMessages(prev => [msg, ...prev].slice(0, 50));
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  const handleInput = useCallback(async (rawInput: string) => {
    if (!rawInput.trim()) return;
    const role = typeof window !== 'undefined' ? localStorage.getItem('anos_user_role') || 'Procurement' : 'Procurement';

    setProcessing(true);

    // ================================================================
    // Command → Agent Router
    // ================================================================
    const agentEndpoint = await getAgentEndpoint(rawInput, role);
    setAgentThinking(agentEndpoint.thinking);

    // User message
    addMessage({
      id: Date.now().toString(36), role: 'user',
      content: rawInput.slice(0, 200),
      time: new Date().toLocaleTimeString('zh-CN'),
      intent: agentEndpoint.intent,
    });

    // Call Agent API
    try {
      const res = await fetch('/api' + agentEndpoint.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Role': role },
        body: JSON.stringify({
          content: rawInput,
          source: 'AI Inbox',
          sourceType: 'Text',
          sourceTime: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setAgentThinking(data.conclusion || data.summary || 'Complete');
        
        // Record Command Session
        try {
          const session = createSession({
            user_role: role,
            source_page: typeof window !== 'undefined' ? window.location.pathname : '/',
            input_type: rawInput.startsWith('IMAGE_RECEIVED:') ? 'image' : 'text',
            raw_input: rawInput.slice(0, 500),
            detected_intent: agentEndpoint.intent,
            matched_agent: data.agent || agentEndpoint.intent,
            confidence_score: data.confidenceScore || 80,
            execution_status: 'completed',
            user_confirmation: null,
          });
          saveSession(session);
        } catch {}
        
        // Handle navigation (Knowledge Agent)
        if (data.navigateTo) {
          setTimeout(() => { window.location.href = data.navigateTo; }, 800);
        }
        addMessage({
          id: Date.now().toString(36), role: 'assistant',
          content: formatAgentResponse(data, agentEndpoint.intent),
          time: new Date().toLocaleTimeString('zh-CN'),
          intent: agentEndpoint.intent,
          action: data.action || 'processed',
          targetId: data.targetId,
          suggestions: data.suggestions,
        });
      } else {
        throw new Error(data.error?.message || 'Agent error');
      }
    } catch (err: any) {
      setAgentThinking('Error');
      addMessage({
        id: Date.now().toString(36), role: 'assistant',
        content: 'Agent processing failed: ' + (err.message || 'Unknown error'),
        time: new Date().toLocaleTimeString('zh-CN'),
        intent: 'info', action: 'error',
      });
    }

    setProcessing(false);
    setTimeout(() => setAgentThinking(''), 3000);
  }, []);


  return (
    <InboxContext.Provider value={{ messages, processing, agentThinking, refreshTrigger, handleInput, clearMessages }}>
      {children}
    </InboxContext.Provider>
  );
}

// ============================================================================
// Agent Router
// ============================================================================
async function getAgentEndpoint(text: string, role: string): Promise<{ path: string; thinking: string; intent: string; routingLayer: string }> {
  // Registry-first routing per SA-020
  try {
    const res = await fetch('/api/agent-registry/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Role': role },
      body: JSON.stringify({ content: text }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.agent?.endpoint) {
        return {
          path: data.agent.endpoint,
          thinking: data.agent.name + ' processing...',
          intent: data.agent.type,
          routingLayer: data.layer || 'keyword',
        };
      }
    }
  } catch (e) { console.warn('Registry match failed, using fallback:', e); }
  
  // Fallback: keyword-based routing
  const lower = text.toLowerCase();
  if (text.startsWith('IMAGE_RECEIVED:'))
    return { path: '/agent-reasoning/procurement/parse-offer', thinking: 'Procurement Agent processing image...', intent: 'Supply', routingLayer: 'keyword' };
  if (/查看|查询|最新|列表|显示|有哪些|帮我查|看看|show|list/.test(lower))
    return { path: '/agent-reasoning/knowledge/search', thinking: 'Knowledge Agent querying...', intent: 'Query', routingLayer: 'keyword' };
  if (/供应|现货|库存|offer|supply|可出|有货|渠道|出|尾数|原厂|有人接|联系|批次|原装|正品|全新/.test(lower))
    return { path: '/agent-reasoning/procurement/parse-offer', thinking: 'Procurement Agent parsing supply...', intent: 'Supply', routingLayer: 'keyword' };
  if (/询价|rfq|需要|买|find|looking|需求|求购|帮我找/.test(lower))
    return { path: '/agent-reasoning/sales/quote-suggestion', thinking: 'Sales Agent processing demand...', intent: 'Demand', routingLayer: 'keyword' };
  if (/逾期|风险|催收|ar|信用|回款|欠款/.test(lower))
    return { path: '/agent-reasoning/credit/risk-analysis', thinking: 'Credit Agent analyzing risk...', intent: 'Risk', routingLayer: 'keyword' };
  
  return { path: '/agent-reasoning/procurement/parse-offer', thinking: 'Agent processing...', intent: 'Supply', routingLayer: 'context' };
}


function formatAgentResponse(data: any, intent: string): string {
  const parts: string[] = [];
  
  // Agent identity
  if (data.agent) parts.push('[' + data.agent + ']');
  
  // Conclusion (SA-007 standard)
  if (data.conclusion) parts.push(data.conclusion);
  
  // Evidence
  if (data.evidence && data.evidence.length > 0) {
    parts.push('\nEvidence:');
    data.evidence.forEach((e: string) => parts.push('  - ' + e));
  }
  
  // Items (for Procurement Agent)
  if (data.items && data.items.length > 0) {
    parts.push('\nItems (' + data.items.length + '):');
    data.items.slice(0, 10).forEach((item: any) => {
      const line = [item.mpn, item.brand, item.category, item.dateCode ? 'D/C:' + item.dateCode : '']
        .filter(Boolean).join(' | ');
      parts.push('  ' + line);
    });
  }
  
  // Confidence
  if (data.confidenceScore) {
    parts.push('\nConfidence: ' + data.confidenceScore + '%' + (data.requiresApproval ? ' [Requires Approval]' : ''));
  }
  
  // Suggested Actions
  if (data.suggestedActions && data.suggestedActions.length > 0) {
    parts.push('\nSuggested Actions:');
    data.suggestedActions.forEach((a: any, i: number) => {
      const riskLabel = a.risk === 'high' ? '\u26A0' : a.risk === 'medium' ? '\u26A0' : '';
      parts.push('  ' + (i+1) + '. ' + a.label + ' ' + riskLabel);
    });
  }
  
  // Navigation
  if (data.navigateTo) {
    parts.push('\n\u2192 Navigating to: ' + data.navigateTo);
  }
  
  return parts.join('\n');
}
