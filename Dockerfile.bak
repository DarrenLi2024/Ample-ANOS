# ANOS API Dockerfile — 独立部署
FROM node:20-alpine

# 安装编译依赖 (better-sqlite3 需要)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 复制 API 需要的文件
COPY services/api/package.json ./
COPY services/api/tsconfig.json ./

# 安装依赖
RUN npm install --no-optional

# 复制源码
COPY services/api/src ./src
COPY packages/shared/src ./packages/shared/src  
COPY packages/shared/package.json ./packages/shared/package.json
COPY data ./data
COPY tsconfig.base.json ./

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

CMD ["npx", "tsx", "src/start.ts"]
