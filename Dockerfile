FROM node:18-alpine

WORKDIR /app
COPY services/api/package.json ./
RUN npm install
COPY services/api/src ./src
COPY data ./data
EXPOSE 3001
ENV PORT=3001
CMD ["npx", "tsx", "src/start.ts"]
