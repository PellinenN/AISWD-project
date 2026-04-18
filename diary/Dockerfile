# Multi-stage build: Stage 1 - Build React frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (both frontend and backend needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build React frontend (outputs to build/ directory)
RUN npm run build

# Stage 2 - Runtime
FROM node:20-alpine

WORKDIR /app

# Copy package files from builder
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --production

# Copy backend source code
COPY src/backend ./src/backend

# Copy frontend build output from builder stage
COPY --from=builder /app/build ./build

# Copy database migration files
COPY src/backend/database ./src/backend/database

# Copy entrypoint script
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Create data directory for SQLite database persistence
RUN mkdir -p /app/data

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production \
    PORT=5000

# Use entrypoint script to run migrations and start server
ENTRYPOINT ["./docker-entrypoint.sh"]
