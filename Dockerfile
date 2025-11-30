# OECD MCP Server - Docker Configuration
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy README.md for landing page
COPY README.md ./

# Copy source code BEFORE installing (prepare script needs it)
COPY src/ ./src/

# Install ALL dependencies (including TypeScript for building)
# The prepare script will run automatically and build the project
RUN npm ci

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start HTTP server
CMD ["node", "dist/http-server.js"]
