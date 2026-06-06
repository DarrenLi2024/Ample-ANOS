/**
 * Evaluation Logger — 自进化核心
 * SA-020 Ch10: Evaluation Loop
 * 
 * 每次 Command Session 完成后，自动评估并记录质量分数。
 * 低质量路由 → 标记 Review → 供后续优化参考。
 */
import fs from 'node:fs';
import path from 'node:path';

const LOG_DIR = path.join(process.cwd(), 'data', 'evaluations');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

export interface EvalRecord {
  session_id: string;
  timestamp: string;
  routing_accuracy: number;      // 0-100: 路由是否正确
  agent_quality: number;          // 0-100: Agent响应质量
  workflow_completion: number;    // 0-100: Workflow完成度
  user_confirmed: boolean | null; // 用户是否确认
  response_time_ms: number;       // 响应时间
  routing_layer: string;          // keyword/ai/context
  overall_score: number;          // 综合评分
}

export function evaluateSession(session: {
  session_id: string;
  routing_layer: string;
  confidence_score: number;
  execution_status: string;
  user_confirmation: boolean | null;
  startTime: number;
}): EvalRecord {
  const responseTime = Date.now() - session.startTime;
  
  const routingAccuracy = session.confidence_score;
  const agentQuality = session.execution_status === 'completed' ? 90 : 50;
  const workflowCompletion = session.execution_status === 'completed' ? 100 : 50;
  
  const overallScore = Math.round(
    (routingAccuracy * 0.3) +
    (agentQuality * 0.3) +
    (workflowCompletion * 0.2) +
    (responseTime < 3000 ? 100 : responseTime < 5000 ? 70 : 40) * 0.2
  );

  const record: EvalRecord = {
    session_id: session.session_id,
    timestamp: new Date().toISOString(),
    routing_accuracy: routingAccuracy,
    agent_quality: agentQuality,
    workflow_completion: workflowCompletion,
    user_confirmed: session.user_confirmation,
    response_time_ms: responseTime,
    routing_layer: session.routing_layer,
    overall_score: overallScore,
  };

  // Persist
  try {
    const logFile = path.join(LOG_DIR, `eval-${new Date().toISOString().slice(0, 10)}.json`);
    const existing = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf-8')) : [];
    existing.push(record);
    fs.writeFileSync(logFile, JSON.stringify(existing, null, 2));
  } catch {}

  // Alert on low quality
  if (overallScore < 50) {
    console.warn(`[EVAL] LOW QUALITY session ${session.session_id}: score=${overallScore}`);
  }

  return record;
}

export function getEvaluationStats(days = 7): {
  total: number;
  avgScore: number;
  lowQualityCount: number;
  routingAccuracy: number;
} {
  const stats = { total: 0, avgScore: 0, lowQualityCount: 0, routingAccuracy: 0 };
  
  try {
    const files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith('.json'));
    const allRecords: EvalRecord[] = [];
    
    for (const file of files.slice(-days)) {
      const data = JSON.parse(fs.readFileSync(path.join(LOG_DIR, file), 'utf-8'));
      allRecords.push(...data);
    }

    if (allRecords.length === 0) return stats;

    stats.total = allRecords.length;
    stats.avgScore = Math.round(allRecords.reduce((s, r) => s + r.overall_score, 0) / allRecords.length);
    stats.lowQualityCount = allRecords.filter(r => r.overall_score < 50).length;
    stats.routingAccuracy = Math.round(allRecords.reduce((s, r) => s + r.routing_accuracy, 0) / allRecords.length);
  } catch {}

  return stats;
}
