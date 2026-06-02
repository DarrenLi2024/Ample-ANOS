import { Hono } from 'hono';
import { jwtAuth } from '../middleware/jwt';
import { v4 as uuid } from 'uuid';
import fs from 'node:fs';
import path from 'node:path';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel', 'application/pdf', 'image/png',
  'image/jpeg', 'image/webp', 'text/csv', 'text/plain',
];

export const uploadRoutes = new Hono().use('*', jwtAuth);

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

uploadRoutes.post('/', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return c.json({ error: { code: 'NO_FILE', message: '未找到上传文件' } }, 400);
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return c.json({ error: { code: 'INVALID_TYPE', message: `不支持的类型: ${file.type}` } }, 400);
    }
    if (file.size > MAX_FILE_SIZE) {
      return c.json({ error: { code: 'TOO_LARGE', message: '文件超过20MB' } }, 413);
    }
    const ext = file.name.split('.').pop() || 'bin';
    const savedName = `${uuid()}.${ext}`;
    const savePath = path.join(UPLOAD_DIR, savedName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(savePath, buffer);
    const category = file.type.includes('spreadsheet') || file.type.includes('excel') || file.type === 'text/csv' ? 'Excel' :
      file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? '图片' : file.type.includes('text') ? '文本' : '未知';
    return c.json({ success: true, data: { fileId: savedName.replace(/\.[^.]+$/, ''), originalName: file.name, savedName, size: file.size, type: file.type, category, uploadedAt: new Date().toISOString() } }, 201);
  } catch (err: any) {
    return c.json({ error: { code: 'UPLOAD_ERROR', message: err.message } }, 500);
  }
});

uploadRoutes.get('/', async (c) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR).map((name) => {
      const stat = fs.statSync(path.join(UPLOAD_DIR, name));
      return { name, size: stat.size, uploadedAt: stat.birthtime.toISOString() };
    });
    return c.json({ data: files });
  } catch { return c.json({ data: [] }); }
});
