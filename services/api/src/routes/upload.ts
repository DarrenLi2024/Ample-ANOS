/**
 * 文件上传 API
 * 支持 Excel/PDF/图片/文本 — Phase 1: 接收+校验+文件类型识别
 * Phase 2: OCR/解析引擎对接
 */
import { Hono } from 'hono';
import { jwtAuth } from '../middleware/jwt';
import { v4 as uuid } from 'uuid';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel',    // .xls
  'application/pdf',             // .pdf
  'image/png',                   // .png
  'image/jpeg',                  // .jpg
  'image/webp',                  // .webp
  'text/csv',                    // .csv
  'text/plain',                  // .txt
];

export const uploadRoutes = new Hono().use('*', jwtAuth);

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// POST /api/upload — 接收文件上传
uploadRoutes.post('/', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return c.json({ error: { code: 'NO_FILE', message: '未找到上传文件' } }, 400);
    }

    // 校验文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return c.json({
        error: { code: 'INVALID_TYPE', message: `不支持的文件类型: ${file.type}` },
        allowedTypes: ALLOWED_TYPES,
      }, 400);
    }

    // 校验文件大小
    if (file.size > MAX_FILE_SIZE) {
      return c.json({
        error: { code: 'TOO_LARGE', message: '文件超过 20MB 限制' },
      }, 413);
    }

    // 保存文件
    const ext = file.name.split('.').pop() || 'bin';
    const savedName = `${uuid()}.${ext}`;
    const savePath = path.join(UPLOAD_DIR, savedName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(savePath, buffer);

    // 文件类型识别
    const fileType = detectFileType(file.type);

    return c.json({
      success: true,
      data: {
        fileId: savedName.replace(/\.[^.]+$/, ''),
        originalName: file.name,
        savedName,
        size: file.size,
        type: file.type,
        category: fileType,
        uploadedAt: new Date().toISOString(),
        phase2: 'OCR 解析引擎将在 Phase 2 对接',
      },
    }, 201);
  } catch (err: any) {
    return c.json({ error: { code: 'UPLOAD_ERROR', message: err.message } }, 500);
  }
});

// GET /api/upload — 已上传文件列表
uploadRoutes.get('/', async (c) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR).map((name) => {
      const stat = fs.statSync(path.join(UPLOAD_DIR, name));
      return {
        name,
        size: stat.size,
        uploadedAt: stat.birthtime.toISOString(),
      };
    });
    return c.json({ data: files });
  } catch {
    return c.json({ data: [] });
  }
});

function detectFileType(mime: string): string {
  if (mime.includes('spreadsheet') || mime.includes('excel') || mime === 'text/csv') return 'Excel';
  if (mime.includes('pdf')) return 'PDF';
  if (mime.includes('image')) return '图片';
  if (mime.includes('text')) return '文本';
  return '未知';
}
ENDOFFILE

# 注册到 app.ts
sed -i '' '/import { knowledgeRoutes }/a\
import { uploadRoutes } from '"'"'./routes/upload'"'"';
' "/Users/lirundong/Documents/Ample ANOS/services/api/src/app.ts"
sed -i '' '/app.route.*knowledge/a\
app.route('"'"'/api/upload'"'"', uploadRoutes);
' "/Users/lirundong/Documents/Ample ANOS/services/api/src/app.ts"

echo "Upload API created"