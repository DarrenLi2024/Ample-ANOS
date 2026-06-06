#!/bin/bash
# ANOS 本地开发环境一键启动
# 用法: bash scripts/dev-setup.sh

set -e

echo "========================================="
echo "  ANOS 本地开发环境初始化"
echo "========================================="

# 1. 安装依赖
echo ""
echo "📦 Step 1/3: 安装依赖..."
pnpm install

# 2. 初始化数据库
echo ""
echo "🗄️  Step 2/3: 初始化数据库 + 种子数据..."
cd services/api
npx tsx src/db/migrate.ts
npx tsx src/db/seed-closure.ts
cd ../..

# 3. 启动
echo ""
echo "🚀 Step 3/3: 启动开发服务..."
echo ""
echo "  Portal:  http://localhost:3000"
echo "  API:     http://localhost:3001"
echo "  Health:  http://localhost:3001/health"
echo ""
echo "========================================="
pnpm dev
