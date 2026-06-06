/**
 * Workflow Engine — 执行 Workflow 定义的步骤
 */
import { Hono } from 'hono';
import { jwtAuth } from '../middleware/jwt';
import { loadRegistry } from '../ai-native/registry-loader';
import { createWorkflowState, executeWorkflowStep } from '../ai-native/router/workflow-dispatcher';

export const workflowEngineRoutes = new Hono().use('*', jwtAuth);

// POST /api/workflow-engine/execute — 执行指定 Workflow
workflowEngineRoutes.post('/execute', async (c) => {
  const { workflowId, input, userId, userRole } = await c.req.json() as any;
  
  const registry = loadRegistry('workflow');
  const workflows = (registry as any).workflows || [];
  const workflow = workflows.find((w: any) => w.id === workflowId);
  
  if (!workflow) {
    return c.json({ error: 'Workflow not found: ' + workflowId }, 404);
  }

  const state = createWorkflowState(workflow);
  
  // Execute first step
  const stepResult = await executeWorkflowStep(state, input);
  
  return c.json({
    workflow: workflow.name,
    state: {
      status: state.status,
      currentStep: state.currentStep,
      totalSteps: state.totalSteps,
      results: state.results,
    },
    requiresConfirm: stepResult.requiresConfirm,
    nextStep: stepResult.nextStep,
  });
});

// GET /api/workflow-engine/list — 列出所有 Workflow
workflowEngineRoutes.get('/list', async (c) => {
  const registry = loadRegistry('workflow');
  const workflows = (registry as any).workflows || [];
  const active = workflows.filter((w: any) => w.status === 'active');
  return c.json({ workflows: active, total: active.length });
});
