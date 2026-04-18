#!/bin/sh

# Docker entrypoint script for diary application
# Runs database migrations and starts the backend server

set -e

echo "Starting diary application..."

# Change to app directory
cd /app

# Set database path to persist data in volume
export DATABASE_PATH="/app/data/diary.db"

echo "Running database migrations..."
npm run db:create

echo "Database setup complete. Starting backend server..."

# Start the backend server
npm run start:backend
