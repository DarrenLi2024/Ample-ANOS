#!/bin/bash
# ANOS Fly.io 一键部署脚本
set -e

cd "$(dirname "$0")/.."

echo "=== ANOS Fly.io 部署 ==="

# 1. Login
~/.fly/bin/fly auth whoami 2>/dev/null || ~/.fly/bin/fly auth signup

# 2. Launch
~/.fly/bin/fly launch --name anos-api --no-deploy --copy-config

# 3. Set secrets
~/.fly/bin/fly secrets set \
  ANOS_DB_PATH=/app/data/anos.db \
  DEEPSEEK_API_KEY=sk-765cf571e4db484784a98f3eff614892 \
  DEEPSEEK_BASE_URL=https://api.deepseek.com \
  DEEPSEEK_MODEL=deepseek-chat \
  FEISHU_APP_ID=cli_aa9e8f7fb67c5bdb \
  FEISHU_APP_SECRET=TLyXKZHMY6FCymFfMSlGFbzKhQrIj36O \
  FEISHU_REDIRECT_URI=https://ample-anos.vercel.app/api/auth/feishu/callback \
  JWT_SECRET=anos-prod-jwt-2026 \
  CORS_ORIGIN=*

# 4. Deploy
~/.fly/bin/fly deploy

echo "=== 部署完成 ==="
echo "API: https://anos-api.fly.dev/health"
