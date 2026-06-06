/**
 * Input Normalizer — 统一输入标准化
 * 将不同来源的输入统一为结构化格式
 */
export interface NormalizedInput {
  rawContent: string;
  type: 'text' | 'image' | 'file' | 'clipboard';
  source: string;
  sourcePage: string;
  userId: string;
  userRole: string;
  timestamp: string;
}

export function normalizeInput(raw: {
  content: string;
  source?: string;
  sourceType?: string;
  page?: string;
  userId?: string;
  userRole?: string;
}): NormalizedInput {
  const type = detectInputType(raw.content);
  return {
    rawContent: raw.content,
    type,
    source: raw.source || 'AI Inbox',
    sourcePage: raw.page || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    userId: raw.userId || 'anonymous',
    userRole: raw.userRole || 'Procurement',
    timestamp: new Date().toISOString(),
  };
}

function detectInputType(content: string): NormalizedInput['type'] {
  if (content.startsWith('data:image/') || content.startsWith('IMAGE_RECEIVED:')) return 'image';
  if (content.startsWith('[') && content.includes(']:')) return 'file';
  if (content.includes('clipboard-')) return 'clipboard';
  return 'text';
}
