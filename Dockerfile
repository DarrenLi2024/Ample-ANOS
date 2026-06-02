# ANOS Production Dockerfile — 多阶段构建
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY services/api/package.json ./services/api/
COPY apps/portal/package.json ./apps/portal/

RUN corepack enable && pnpm install --frozen-lockfile --prod

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm build

# Stage 3: Runner (API Service)
FROM node:20-alpine AS api-runner
WORKDIR /app

COPY --from=builder /app/services/api/dist ./dist
COPY --from=builder /app/services/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "dist/index.js"]

# Stage 4: Runner (Portal)
FROM node:20-alpine AS portal-runner
WORKDIR /app

COPY --from=builder /app/apps/portal/.next ./.next
COPY --from=builder /app/apps/portal/package.json ./
COPY --from=builder /app/apps/portal/next.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node_modules/.bin/next", "start"]
