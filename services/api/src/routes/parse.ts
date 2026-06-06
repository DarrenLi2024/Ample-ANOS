import { Hono } from 'hono';
import { jwtAuth } from '../middleware/jwt';
import { v4 as uuid } from 'uuid';
import fs from 'node:fs';
import path from 'node:path';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const parseRoutes = new Hono().use('*', jwtAuth);

// POST /api/parse — 上传并解析文件
parseRoutes.post('/', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return c.json({ error: { code: 'NO_FILE', message: '未找到文件' } }, 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return c.json({ error: { code: 'TOO_LARGE', message: '文件超过20MB' } }, 413);
    }

    // 保存文件
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const savedName = `${uuid()}.${ext}`;
    const savePath = path.join(UPLOAD_DIR, savedName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(savePath, buffer);

    // 解析文件内容
    const result = await parseFile(savePath, ext, file.name, file.type);

    return c.json({
      success: true,
      data: {
        fileId: savedName.replace(/\.[^.]+$/, ''),
        originalName: file.name,
        size: file.size,
        type: file.type,
        extension: ext,
        ...result,
      },
    }, 201);
  } catch (err: any) {
    return c.json({ error: { code: 'PARSE_ERROR', message: err.message } }, 500);
  }
});

// POST /api/parse/clipboard — 粘贴板截图解析 (base64)
parseRoutes.post('/clipboard', async (c) => {
  try {
    const body = await c.req.json();
    const { image, filename } = body as { image: string; filename?: string };

    if (!image) {
      return c.json({ error: { code: 'NO_IMAGE', message: '未提供图片数据' } }, 400);
    }

    // base64 → 文件
    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    let ext = 'png';
    let base64Data = '';
    
    if (matches) {
      ext = matches[1] || 'png';
      base64Data = matches[2] || '';
    } else {
      // Try as raw base64
      base64Data = image;
    }
    
    const buffer = Buffer.from(base64Data, 'base64');

    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const savedName = `${uuid()}.${ext}`;
    const savePath = path.join(UPLOAD_DIR, savedName);
    fs.writeFileSync(savePath, buffer);

    // Try OCR via OpenAI Vision
    const ocrResult = await tryOcr(buffer, ext);

    return c.json({
      success: true,
      data: {
        fileId: savedName.replace(/\.[^.]+$/, ''),
        originalName: filename || `clipboard.${ext}`,
        size: buffer.length,
        type: `image/${ext}`,
        content: ocrResult,
        category: '图片',
        parsed: true,
      },
    }, 201);
  } catch (err: any) {
    return c.json({ error: { code: 'PARSE_ERROR', message: err.message } }, 500);
  }
});

// ============================================================================
// OCR: OpenAI Vision API
// ============================================================================
async function tryOcr(imageBuffer: Buffer, ext: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.openai.com';
  const model = process.env.DEEPSEEK_MODEL || 'gpt-4o-mini';
  if (!apiKey) {
    return `[图片已保存] 📷 ${ext.toUpperCase()} 图片, ${(imageBuffer.length/1024).toFixed(1)}KB
设置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY 环境变量启用 OCR 文字识别`;
  }

  try {
    const base64 = imageBuffer.toString('base64');
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: '请识别并提取这张图片中的所有文字内容，包括表格数据。如果是电子元器件相关的报价单、型号表、聊天截图，请提取所有型号(MPN)、品牌、数量、价格、交期等信息。直接输出文字内容，不需要解释。',
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/${mime};base64,${base64}` },
            },
          ],
        }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      return `[图片已保存] OCR 识别失败 (HTTP ${response.status})`;
    }

    const data = await response.json() as any;
    const content = data?.choices?.[0]?.message?.content;
    return content || '[图片已保存] OCR 未返回文字内容';
  } catch (err: any) {
    return `[图片已保存] OCR 调用失败: ${err.message}`;
  }
}

// ============================================================================
// 文件解析引擎
// ============================================================================
async function parseFile(filePath: string, ext: string, name: string, mime: string) {
  switch (ext) {
    case 'txt':
    case 'md':
    case 'csv':
      return parseTextFile(filePath, ext);
    case 'json':
      return parseTextFile(filePath, 'json');
    case 'xlsx':
    case 'xls':
      return parseExcelFile(filePath, ext);
    case 'pdf':
      return parsePdfFile(filePath);
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'webp':
    case 'gif':
      return parseImageFile(filePath, ext);
    default:
      return {
        content: `[不支持的文件类型: .${ext}]`,
        category: '未知',
        parsed: false,
      };
  }
}

/** TXT / MD / CSV / JSON 文本提取 */
function parseTextFile(filePath: string, ext: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(Boolean);

  let category = '文本';
  if (ext === 'md') category = 'Markdown';
  else if (ext === 'csv') category = 'CSV表格';
  else if (ext === 'json') category = 'JSON数据';

  const preview = content.slice(0, 2000);
  const hasMore = content.length > 2000;

  return {
    content: preview + (hasMore ? `\n\n... (共 ${content.length} 字符，已截取前 2000 字符)` : ''),
    category,
    stats: { lines: lines.length, characters: content.length },
    parsed: true,
  };
}

/** Excel 解析 — 提取所有 sheet 的文本内容 */
function parseExcelFile(filePath: string, ext: string) {
  try {
    const XLSX = requireXLSX();
    if (!XLSX) {
      return {
        content: `[Excel 文件: .${ext}] 📊\n安装 xlsx 库后支持完整解析。`,
        category: 'Excel',
        parsed: false,
        phase2: 'npm install xlsx → 启用表格数据提取',
      };
    }

    const workbook = XLSX.readFile(filePath);
    const sheets = workbook.SheetNames;
    const results: string[] = [];

    for (const sheetName of sheets.slice(0, 5)) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      results.push(`--- ${sheetName} ---\n${csv.slice(0, 3000)}`);
    }

    return {
      content: results.join('\n\n'),
      category: 'Excel表格',
      stats: { sheets: sheets.length },
      parsed: true,
    };
  } catch (err: any) {
    return {
      content: `[Excel 解析失败: ${err.message}]`,
      category: 'Excel',
      parsed: false,
    };
  }
}

function requireXLSX() {
  try { return require('xlsx'); } catch { return null; }
}

/** PDF 解析 */
function parsePdfFile(filePath: string) {
  try {
    const { execSync } = require('child_process');
    const text = execSync(`pdftotext "${filePath}" - 2>/dev/null`, { encoding: 'utf-8', timeout: 10000, maxBuffer: 5 * 1024 * 1024 });
    if (text.trim()) {
      return {
        content: text.slice(0, 5000),
        category: 'PDF文档',
        stats: { characters: text.length },
        parsed: true,
      };
    }
  } catch {}

  return {
    content: `[PDF 文件] 📄\n安装 pdf-parse 库后支持完整解析。`,
    category: 'PDF文档',
    parsed: false,
    phase2: 'npm install pdf-parse → 启用 PDF 文本提取',
  };
}

/** 图片解析 — 上传时用OCR，这里作为fallback */
function parseImageFile(filePath: string, ext: string) {
  const stat = fs.statSync(filePath);
  return {
    content: `[${ext.toUpperCase()} 图片] 📷 ${(stat.size/1024).toFixed(1)}KB\n已保存至服务器。粘贴到聊天框时自动触发 OCR。`,
    category: '图片',
    stats: { size: stat.size, format: ext },
    parsed: true,
  };
}
