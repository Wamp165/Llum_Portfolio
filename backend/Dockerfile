# =========================
# Stage 1: DEPS
# =========================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# =========================
# Stage 2: BUILD
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# =========================
# Stage 3: PROD
# =========================
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init

RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN chown -R nodejs:nodejs /app

USER nodejs

CMD ["dumb-init", "node", "dist/index.js"]
