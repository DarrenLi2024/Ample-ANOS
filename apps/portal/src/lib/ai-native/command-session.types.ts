/**
 * Command Session — 完整类型定义
 * 每次用户输入生成一条 Session 记录
 * SA-019 规范要求: 每次指令都要生成 Command Session
 */
export interface CommandSession {
  session_id: string;
  user_id: string;
  user_role: string;
  source_page: string;
  input_type: 'text' | 'image' | 'file' | 'clipboard' | 'voice';
  raw_input: string;
  detected_intent: string;
  matched_agent: string;
  matched_agent_type: string;
  matched_workflow: string | null;
  extracted_fields: Record<string, any>;
  confidence_score: number;
  action_suggestions: string[];
  execution_status: 'pending' | 'running' | 'completed' | 'failed' | 'requires_confirmation';
  user_confirmation: boolean | null;
  error_message: string | null;
  source_timestamp: string;
  captured_timestamp: string;
  completed_timestamp: string | null;
}

export interface SessionStore {
  sessions: CommandSession[];
  addSession: (session: CommandSession) => void;
  updateSession: (id: string, updates: Partial<CommandSession>) => void;
  getRecentSessions: (userId: string, limit?: number) => CommandSession[];
}
