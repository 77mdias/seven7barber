# ============================================
# Stage 1: Dependencies
# ============================================
FROM oven/bun:1 AS deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# ============================================
# Stage 2: Build
# ============================================
FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN bunx prisma generate

# Copy source code
COPY . .

# Build the application
RUN bun run build

# ============================================
# Stage 3: Production
# ============================================
FROM oven/bun:1-slim AS production

WORKDIR /app

# Create non-root user (Debian-based image uses groupadd/useradd)
RUN groupadd --system --gid 1001 nestjs && \
    useradd --system --uid 1001 --gid nestjs --no-create-home nestjs

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

# Copy Prisma schema and generated client
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Set ownership
RUN chown -R nestjs:nestjs /app

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["bun", "run", "start:prod"]
