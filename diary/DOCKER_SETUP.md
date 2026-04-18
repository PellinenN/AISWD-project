# Docker Setup Guide for Diary Application

## Quick Start

### Build and run the application
```bash
# Build the Docker image and start the container
docker-compose up --build

# On subsequent runs (image already built)
docker-compose up

# Run in background
docker-compose up -d
```

### Access the application
- **Frontend & Backend**: `http://localhost:5000`
- **Backend API**: `http://localhost:5000/api/*` endpoints

### Stop the application
```bash
# Stop running containers
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v
```

## Configuration

### Environment Variables

The application uses the following environment variables (configured in `.env.docker`):

- `NODE_ENV=production` — Application mode (production for Docker)
- `PORT=5000` — Backend server port
- `JWT_SECRET` — Secret key for JWT token signing (change this in production!)
- `JWT_EXPIRY=7d` — JWT token expiration time
- `CORS_ORIGIN` — CORS origin (empty in Docker since frontend and backend are same-origin)

### Override Environment Variables

You can override environment variables when starting Docker Compose:

```bash
# Override JWT_SECRET
JWT_SECRET=my-custom-secret docker-compose up

# Or create a .env file in the project root
echo "JWT_SECRET=my-custom-secret" > .env
docker-compose up
```

## Database

### Database Persistence

The SQLite database is stored in a Docker volume named `diary-data`, which persists across container restarts:

```bash
# View database file location
docker volume inspect diary-data

# The database file is stored at: ./data/diary.db (mounted to /app/data/diary.db in container)
```

### Database Initialization

On first run, the Docker entrypoint script automatically:
1. Runs database migrations (`npm run db:create`)
2. Creates the SQLite database schema
3. Starts the backend server

### Backup Database

```bash
# Copy database from container to host
docker cp <container-id>:/app/data/diary.db ./backup-diary.db

# Or if using docker-compose (find container name first)
docker-compose ps
docker cp diary_diary-app_1:/app/data/diary.db ./backup-diary.db
```

### Reset Database

```bash
# Remove the volume (WARNING: deletes all data)
docker-compose down -v
docker-compose up --build
```

## Building & Running

### Build Docker Image

```bash
# Build the image with a tag
docker build -t diary-app:latest .

# View build stages
docker build -t diary-app:latest --progress=plain .
```

### Run with Docker Compose

```bash
# Build and start
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f diary-app
```

### Run Docker Container Directly

```bash
# Run the built image
docker run -p 5000:5000 \
  -e JWT_SECRET=test-secret \
  -v diary-data:/app/data \
  diary-app:latest

# Or with environment file
docker run -p 5000:5000 \
  --env-file .env.docker \
  -v diary-data:/app/data \
  diary-app:latest
```

## Troubleshooting

### Container won't start

Check the logs:
```bash
docker-compose logs diary-app
```

Common issues:
- **Port 5000 already in use**: Change port mapping in `docker-compose.yml` from `5000:5000` to `8000:5000`
- **Database initialization failed**: Check migrations file exists at `src/backend/database/migrate.js`
- **Build fails**: Ensure all dependencies in `package.json` are correctly specified

### Database migration errors

```bash
# Check database file permissions
docker-compose exec diary-app ls -la /app/data/

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### CORS errors in browser console

Since the frontend and backend are served from the same origin (`http://localhost:5000`), CORS should not be an issue. If you see CORS errors:
1. Check browser network tab for actual error
2. Verify backend is running: `curl http://localhost:5000/api/...`
3. Check server logs: `docker-compose logs diary-app`

### Unable to connect to backend

```bash
# Verify container is running
docker-compose ps

# Check if port is open
curl http://localhost:5000

# Check logs for errors
docker-compose logs diary-app
```

## Development Workflows

### View logs in real-time

```bash
docker-compose logs -f
```

### Rebuild after code changes

```bash
# Rebuild and restart (recommended)
docker-compose up --build

# Or just rebuild without starting
docker-compose build --no-cache
docker-compose up
```

### Enter container shell for debugging

```bash
docker-compose exec diary-app sh
```

### Run database commands in container

```bash
# Run npm commands
docker-compose exec diary-app npm run db:create

# Check database with sqlite3 (if available in container)
docker-compose exec diary-app sqlite3 /app/data/diary.db ".tables"
```

## Production Considerations

This setup is optimized for **local development**. For production deployment, consider:

1. **Use a managed database** (PostgreSQL, MySQL) instead of SQLite
2. **Remove `restart: unless-stopped`** in docker-compose.yml for better control
3. **Set secure JWT_SECRET** environment variable
4. **Use docker secrets** or a secrets management system
5. **Implement health checks** in docker-compose.yml
6. **Use Docker Swarm or Kubernetes** for orchestration
7. **Add nginx reverse proxy** for SSL/TLS termination
8. **Monitor container logs and metrics**

## Cleanup

```bash
# Stop containers
docker-compose down

# Remove all unused images, containers, and volumes
docker system prune -a --volumes
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://docs.docker.com/language/nodejs/build-images/)
