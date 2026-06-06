/**
 * ANOS Registry Loader
 */
import fs from 'node:fs';
import path from 'node:path';

const REGISTRY_DIR = process.env.ANOS_REGISTRY_DIR || path.join(process.cwd(), 'agents', 'registry');
const cache: Record<string, { data: any; mtime: number }> = {};

function parseYaml(raw: string): any {
  const result: Record<string, any[]> = {};
  let section: string | null = null;
  let obj: Record<string, any> | null = null;
  let arrKey: string | null = null;

  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;

    // Section header
    if (t === 'agents:' || t === 'skills:' || t === 'workflows:' || t === 'tools:') {
      section = t.replace(':', '');
      result[section] = [];
      obj = null;
      arrKey = null;
      continue;
    }

    if (!section) continue;

    // New list entry
    if (t === '- id:' || t.startsWith('- id: ') || t === '- code:' || t.startsWith('- code: ')) {
      if (obj) result[section].push(obj);
      obj = {};
      arrKey = null;
      // Extract the id/code value from the same line
      const kv = t.split(': ');
      if (kv.length >= 2) {
        obj[kv[0].replace('- ', '')] = kv.slice(1).join(': ').trim();
      }
      continue;
    }

    if (!obj) continue;

    // Sub-array header
    if (/^\w[\w_]*:$/.test(t) && !t.includes(': ')) {
      arrKey = t.replace(':', '');
      obj[arrKey] = [];
      continue;
    }

    // Sub-array value
    if (arrKey && t.startsWith('- ')) {
      obj[arrKey].push(t.slice(2).trim());
      continue;
    }

    // Key: value
    const kvIdx = t.indexOf(': ');
    if (kvIdx > 0) {
      const k = t.slice(0, kvIdx).trim();
      let v: any = t.slice(kvIdx + 2).trim();
      if (v === 'true') v = true;
      else if (v === 'false') v = false;
      else if (/^\d+$/.test(v)) v = parseInt(v);
      else if (/^\d+\.\d+$/.test(v)) v = parseFloat(v);
      obj[k] = v;
      arrKey = null;
    }
  }

  if (obj && section) result[section].push(obj);
  return result;
}

export function loadRegistry(name: 'agent' | 'skill' | 'workflow' | 'tool'): any {
  const filename = name + '-registry.yaml';
  const filepath = path.join(REGISTRY_DIR, filename);
  if (!fs.existsSync(filepath)) return { agents: [], skills: [], workflows: [], tools: [] };
  const stat = fs.statSync(filepath);
  const cached = cache[filename];
  if (cached && cached.mtime === stat.mtimeMs) return cached.data;
  const raw = fs.readFileSync(filepath, 'utf-8');
  const data = parseYaml(raw);
  cache[filename] = { data, mtime: stat.mtimeMs };
  return data;
}

export function loadAllRegistries() {
  return {
    agents: (loadRegistry('agent') as any).agents || [],
    skills: (loadRegistry('skill') as any).skills || [],
    workflows: (loadRegistry('workflow') as any).workflows || [],
    tools: (loadRegistry('tool') as any).tools || [],
  };
}
