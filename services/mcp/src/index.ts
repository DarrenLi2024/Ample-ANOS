/**
 * ANOS MCP 服务 — Agent 工具集
 * 基于 docs/85-MCP服务规范 V1.0.md
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';

const server = new McpServer({
  name: 'anos-mcp',
  version: '0.1.0',
});

// ============================================================================
// P0 MCP Tools (7个)
// ============================================================================

// 1. customer-search
server.tool(
  'customer-search',
  '查询客户基本信息、历史RFQ、风险摘要',
  {
    query: z.string().describe('搜索关键词：客户名称或ID'),
    actor: z.string().describe('调用者：Agent名称或用户ID'),
    requestId: z.string().describe('请求追踪ID'),
  },
  async ({ query, actor, requestId }) => {
    const auditId = uuid();
    return {
      content: [{ type: 'text', text: JSON.stringify({
        success: true,
        data: { message: `Mock customer search for "${query}"` },
        evidence: `Customer search executed by ${actor}`,
        source: 'ANOS API',
        confidence: 85,
        auditId,
      })}],
    };
  },
);

// 2. inquiry-create
server.tool(
  'inquiry-create',
  '根据结构化RFQ创建Inquiry草案',
  {
    customerId: z.string().describe('客户ID'),
    mpn: z.string().describe('型号'),
    quantity: z.number().describe('数量'),
    targetPrice: z.number().optional().describe('目标价格'),
    actor: z.string(),
    requestId: z.string(),
  },
  async ({ customerId, mpn, quantity, targetPrice, actor, requestId }) => {
    const auditId = uuid();
    return {
      content: [{ type: 'text', text: JSON.stringify({
        success: true,
        data: { inquiryId: `INQ-${Date.now()}`, customerId, mpn, quantity, targetPrice },
        evidence: `Inquiry created by ${actor}`,
        source: 'ANOS MCP',
        confidence: 90,
        auditId,
        requiresApproval: false,
      })}],
    };
  },
);

// 3. supply-resource-search
server.tool(
  'supply-resource-search',
  '查询供应资源池',
  {
    mpn: z.string().describe('型号'),
    actor: z.string(),
    requestId: z.string(),
  },
  async ({ mpn, actor, requestId }) => {
    const auditId = uuid();
    return {
      content: [{ type: 'text', text: JSON.stringify({
        success: true,
        data: { message: `Mock supply resource search for "${mpn}"`, count: 3 },
        evidence: `Supply search by ${actor}`,
        source: 'ANOS API',
        confidence: 80,
        auditId,
      })}],
    };
  },
);

// 4. opportunity-match
server.tool(
  'opportunity-match',
  '基于Inquiry与Supply Resource生成Opportunity候选',
  {
    inquiryId: z.string().describe('询价ID'),
    actor: z.string(),
    requestId: z.string(),
  },
  async ({ inquiryId, actor, requestId }) => {
    const auditId = uuid();
    return {
      content: [{ type: 'text', text: JSON.stringify({
        success: true,
        data: {
          opportunityId: `OPP-${Date.now()}`,
          matchScore: 78,
          matchBreakdown: { modelMatch: 40, stockScore: 16, priceScore: 8, deliveryScore: 10, riskScore: 4 },
        },
        evidence: `Opportunity match for ${inquiryId} by ${actor}`,
        source: 'ANOS Matching Engine',
        confidence: 78,
        auditId,
        requiresApproval: true,
      })}],
    };
  },
);

// 5. ar-risk-query
server.tool(
  'ar-risk-query',
  '查询客户AR风险',
  {
    customerId: z.string().describe('客户ID'),
    actor: z.string(),
    requestId: z.string(),
  },
  async ({ customerId, actor, requestId }) => {
    const auditId = uuid();
    return {
      content: [{ type: 'text', text: JSON.stringify({
        success: true,
        data: { customerId, overdueCount: 2, totalOutstanding: 150000, riskLevel: 'L3_Warning' },
        evidence: `AR risk query for ${customerId}`,
        source: 'ANOS API',
        confidence: 92,
        auditId,
      })}],
    };
  },
);

// 6. knowledge-search
server.tool(
  'knowledge-search',
  '检索飞书知识库和知识索引',
  {
    query: z.string().describe('知识搜索关键词'),
    actor: z.string(),
    requestId: z.string(),
  },
  async ({ query, actor, requestId }) => {
    const auditId = uuid();
    return {
      content: [{ type: 'text', text: JSON.stringify({
        success: true,
        data: { message: `Mock knowledge search for "${query}"`, results: [] },
        evidence: `Knowledge search by ${actor}`,
        source: 'ANOS Knowledge Hub',
        confidence: 75,
        auditId,
      })}],
    };
  },
);

// 7. audit-log-write
server.tool(
  'audit-log-write',
  '写入审计日志',
  {
    objectType: z.string(),
    objectId: z.string(),
    action: z.string(),
    actor: z.string(),
    actorRole: z.string(),
    requestId: z.string(),
  },
  async ({ objectType, objectId, action, actor, actorRole, requestId }) => {
    const auditId = uuid();
    return {
      content: [{ type: 'text', text: JSON.stringify({
        success: true,
        data: { auditId },
        evidence: `Audit log written`,
        source: 'ANOS MCP',
        confidence: 100,
        auditId,
      })}],
    };
  },
);

// Start
const transport = new StdioServerTransport();
await server.connect(transport);
console.log('ANOS MCP Server running on stdio');
