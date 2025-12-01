# OECD MCP Server - Secure Multi-Stage Docker Build

# ========== Build Stage ==========
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy README.md for landing page
COPY README.md ./

# Copy source code
COPY src/ ./src/

# Install ALL dependencies (including TypeScript)
RUN npm ci

# Build the project (TypeScript compilation)
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# ========== Production Stage ==========
FROM node:20-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/README.md ./
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check (running as non-root user)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start HTTP server
CMD ["node", "dist/http-server.js"]
