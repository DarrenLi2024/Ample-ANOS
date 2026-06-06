# ANOS API Dockerfile — 独立部署，不依赖 monorepo
FROM node:20-alpine

WORKDIR /app

# 只复制 API 需要的文件（不是整个 monorepo）
COPY services/api/package.json ./
COPY services/api/tsconfig.json ./

# 安装依赖
RUN npm install --no-optional

# 复制源码
COPY services/api/src ./src
COPY packages/shared/src ./packages/shared/src
COPY packages/shared/package.json ./packages/shared/package.json
COPY data ./data

# 复制根目录 tsconfig base
COPY tsconfig.base.json ./

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

# 直接用 tsx 运行 TypeScript（不需要 build）
CMD ["npx", "tsx", "src/start.ts"]
