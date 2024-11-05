FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat python3 make g++
RUN npm install -g turbo
WORKDIR /app
COPY package*.json ./
COPY turbo.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma
COPY packages/db/src ./packages/db/src
COPY apps/api-server/package.json ./apps/api-server/
COPY apps/api-server/src ./apps/api-server/src
COPY apps/api-server/tsconfig.json ./apps/api-server/
RUN npm install
RUN cd packages/db && npx prisma generate
RUN turbo run build --filter=api-server...
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/api-server/package.json ./apps/api-server/
COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/apps/api-server/dist ./apps/api-server/dist
COPY --from=builder /app/packages/db/src ./packages/db/src
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000
WORKDIR /app/apps/api-server
CMD ["node", "dist/index.js"]