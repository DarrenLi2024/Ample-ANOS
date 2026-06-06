/**
 * Workflow Dispatcher — 执行 Workflow 步骤
 */
export interface WorkflowStep {
  step: string;
  skill: string;
  description?: string;
  require_user_confirm?: boolean;
}

export interface WorkflowState {
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  steps: WorkflowStep[];
  results: Record<string, any>;
}

export function createWorkflowState(workflow: any): WorkflowState {
  return {
    workflowId: workflow.id,
    status: 'running',
    currentStep: 0,
    totalSteps: workflow.steps.length,
    steps: workflow.steps,
    results: {},
  };
}

export async function executeWorkflowStep(
  state: WorkflowState,
  input: any,
): Promise<{ nextStep: boolean; requiresConfirm: boolean; result: any }> {
  if (state.currentStep >= state.steps.length) {
    state.status = 'completed';
    return { nextStep: false, requiresConfirm: false, result: null };
  }

  const step = state.steps[state.currentStep];
  const requiresConfirm = step.require_user_confirm || false;

  // Execute skill (delegates to Agent endpoint)
  state.currentStep++;
  state.results[step.step] = { status: 'executed', skill: step.skill };

  return {
    nextStep: state.currentStep < state.steps.length,
    requiresConfirm,
    result: { step: step.step, skill: step.skill, description: step.description },
  };
}
