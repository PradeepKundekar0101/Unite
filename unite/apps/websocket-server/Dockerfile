FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat python3 make g++
RUN npm install -g turbo
WORKDIR /app
COPY package*.json ./
COPY turbo.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma
COPY packages/db/src ./packages/db/src
COPY apps/websocket-server/package.json ./apps/websocket-server/
COPY apps/websocket-server/src ./apps/websocket-server/src
COPY apps/websocket-server/tsconfig.json ./apps/websocket-server/
RUN npm install
RUN cd packages/db && npx prisma generate
RUN turbo run build --filter=websocket-server...
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/websocket-server/package.json ./apps/websocket-server/
COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/apps/websocket-server/dist ./apps/websocket-server/dist
COPY --from=builder /app/packages/db/src ./packages/db/src
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
ENV PORT=8001
EXPOSE 8001
WORKDIR /app/apps/websocket-server
CMD ["node", "dist/index.js"]