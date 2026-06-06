/**
 * Command Session Store — 会话存储
 * 内存存储 + 浏览器 localStorage 持久化
 */
import type { CommandSession } from './command-session.types';

const STORAGE_KEY = 'anos_command_sessions';
const MAX_SESSIONS = 100;

export function createSession(data: Partial<CommandSession>): CommandSession {
  return {
    session_id: 'SESS-' + Date.now().toString(36).toUpperCase(),
    user_id: data.user_id || 'anonymous',
    user_role: data.user_role || 'Procurement',
    source_page: data.source_page || '/',
    input_type: data.input_type || 'text',
    raw_input: data.raw_input || '',
    detected_intent: data.detected_intent || 'Unknown',
    matched_agent: data.matched_agent || 'Unknown',
    matched_agent_type: data.matched_agent_type || 'Unknown',
    matched_workflow: data.matched_workflow || null,
    extracted_fields: data.extracted_fields || {},
    confidence_score: data.confidence_score || 50,
    action_suggestions: data.action_suggestions || [],
    execution_status: 'running',
    user_confirmation: null,
    error_message: null,
    source_timestamp: data.source_timestamp || new Date().toISOString(),
    captured_timestamp: new Date().toISOString(),
    completed_timestamp: null,
  };
}

export function saveSession(session: CommandSession): void {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    stored.unshift(session);
    if (stored.length > MAX_SESSIONS) stored.length = MAX_SESSIONS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {}
}

export function updateSession(sessionId: string, updates: Partial<CommandSession>): void {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = stored.findIndex((s: CommandSession) => s.session_id === sessionId);
    if (idx >= 0) {
      stored[idx] = { ...stored[idx], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }
  } catch {}
}

export function getRecentSessions(limit = 20): CommandSession[] {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return stored.slice(0, limit);
  } catch {
    return [];
  }
}
