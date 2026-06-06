#!/bin/bash
# ANOS Production Start Script
# 用法: bash scripts/start-prod.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo "========================================="
echo "  ANOS Production Start"
echo "========================================="

# 1. 备份数据库
echo ""
echo "💾 Step 1/3: 备份数据库..."
BACKUP_DIR="$PROJECT_DIR/data/backups"
mkdir -p "$BACKUP_DIR"
if [ -f "$PROJECT_DIR/data/anos.db" ]; then
  cp "$PROJECT_DIR/data/anos.db" "$BACKUP_DIR/anos-$(date +%Y%m%d-%H%M%S).db"
  echo "  备份完成 ($BACKUP_DIR)"
  # 保留最近7天
  ls -t "$BACKUP_DIR"/anos-*.db 2>/dev/null | tail -n +8 | xargs rm -f 2>/dev/null
fi

# 2. 加载环境变量
echo ""
echo "⚙️  Step 2/3: 加载配置..."
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
  echo "  环境变量已加载"
fi

# 3. 启动 API
echo ""
echo "🚀 Step 3/3: 启动服务..."
echo "  API: http://localhost:3001"
echo "  Portal: 请手动启动: cd apps/portal && npx next dev -p 3000"
echo ""
echo "========================================="

node --import tsx services/api/src/start.ts
