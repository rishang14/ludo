# --- Stage 1: Build Stage ---
FROM node:24-alpine AS builder
WORKDIR /app
# Only copy package files first to use Docker's cache
COPY package*.json ./
RUN npm install
# Now copy the rest and build
COPY . .
RUN npm run build

# --- Stage 2: Production Run Stage ---
FROM node:24-alpine AS runner
# Security Fix: Update OS packages to fix 'High Vulnerabilities'
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Fix 1: Copy to ./ (current WORKDIR) not / (root)
COPY --from=builder /app/package*.json ./
# Fix 2: You MUST copy the built code!
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm install --omit=dev

# Security Fix: Don't run as root! Use the built-in 'node' user
USER node

EXPOSE 8000
EXPOSE 8001

# Use npm start (which runs node dist/index.js)
CMD ["npm", "start"]