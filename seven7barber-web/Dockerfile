# ============================================
# Stage 1: Build
# ============================================
FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD=$NEXT_PUBLIC_CLOUDINARY_CLOUD

RUN bun run build

# ============================================
# Stage 2: Production
# ============================================
FROM oven/bun:1-slim AS production

WORKDIR /app

# Create non-root user (Debian-based image uses groupadd/useradd)
RUN groupadd --system --gid 1001 nextjs && \
    useradd --system --uid 1001 --gid nextjs --no-create-home nextjs

# Copy built application and dependencies
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./
COPY --from=build /app/public ./public

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Set ownership
RUN chown -R nextjs:nextjs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["bun", "run", "start"]
