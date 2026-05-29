# ── Stage 1: Build frontend ───────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package.json ./
COPY local/package*.json ./local/

# Install local devDeps (Vite, Tailwind, etc.)
WORKDIR /app/local
RUN npm ci

# Shared frontend components live outside /app/local. Node resolution from
# /app/shared climbs to /app/node_modules, so expose local deps there too.
RUN ln -s /app/local/node_modules /app/node_modules

# Copy shared engine + content (needed by Vite to resolve imports)
WORKDIR /app
COPY shared/ ./shared/

# Copy local source
COPY local/ ./local/

# Build Vite frontend → /app/dist
WORKDIR /app/local
RUN npm run build

# ── Stage 2: Runtime (lean image) ────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Install only production dependencies (express, better-sqlite3)
COPY package.json ./
COPY local/package*.json ./local/
WORKDIR /app/local
RUN npm ci --omit=dev

# Copy built frontend
COPY --from=builder /app/dist /app/dist

# Copy server source
COPY --from=builder /app/local/src ./src

# Copy shared engine (required at runtime: certifications.js, xp.js, etc.)
# Content is NOT copied here — it will be volume-mounted for live updates
COPY --from=builder /app/shared/engine /app/shared/engine

# Ensure data directory exists
RUN mkdir -p /app/data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/server/index.js"]
