# Redis Configuration Fix Summary

## Problem
The application was crashing with the error:
```
MaxRetriesPerRequestError: Reached the max retries per request limit (which is 3)
```

This occurred because:
1. Redis connection was failing (likely Redis wasn't running)
2. The retry limit was too low (3 attempts)
3. No graceful error handling for Redis unavailability
4. API service had hardcoded Redis connection instead of using config

## Changes Made

### 1. Fixed API Service Redis Configuration
**File**: `services/api/src/app.module.ts`
- Changed hardcoded `localhost:6379` to use `config.worker.redis`
- Added `OnModuleInit` lifecycle hook with Redis connection testing
- Added graceful error handling that logs warnings but allows service to continue

### 2. Improved Redis Connection Settings
**File**: `packages/config/src/index.ts`
- Increased `maxRetriesPerRequest` from 3 to 20 (configurable via env)
- Added `enableOfflineQueue` option (default: true)
- Added `connectTimeout` configuration (default: 10 seconds)
- Implemented exponential backoff retry strategy
- Added maximum retry limit (50 attempts) before stopping

### 3. Added Worker Service Health Checks
**File**: `services/worker/src/app.module.ts`
- Added `OnModuleInit` lifecycle hook
- Implemented Redis connection testing on startup
- Added graceful error handling with informative logging
- Service continues with limited functionality if Redis is unavailable

### 4. Updated Environment Configuration
**Files**: `.env` and `.env.example`
- Added detailed Redis configuration options:
  - `REDIS_URL`: Connection URL
  - `REDIS_MAX_RETRIES`: Maximum retry attempts
  - `REDIS_ENABLE_OFFLINE_QUEUE`: Queue jobs when offline
  - `REDIS_CONNECT_TIMEOUT`: Connection timeout in milliseconds
- Added helpful comments explaining optional nature of Redis

### 5. Enhanced Documentation
**File**: `README.md`
- Added Redis configuration section in setup instructions
- Created troubleshooting section for Redis connection issues
- Added guidance for running without Redis
- Included Docker commands for debugging Redis

## How to Use

### With Redis (Recommended)
```bash
# Start Redis via Docker Compose
docker-compose up -d redis

# Verify Redis is running
docker exec -it streamlink-redis redis-cli ping
# Should return: PONG

# Start the application
pnpm dev
```

### Without Redis (Limited Functionality)
```bash
# Just start the application
pnpm dev

# Services will log warnings but continue running
# Background jobs and queue processing will be disabled
```

## Environment Variables

Add to your `.env` file:
```bash
# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_MAX_RETRIES=20
REDIS_ENABLE_OFFLINE_QUEUE=true
REDIS_CONNECT_TIMEOUT=10000
```

## Benefits

1. **No More Crashes**: App continues running even if Redis is unavailable
2. **Better Resilience**: Improved retry logic with exponential backoff
3. **Clear Logging**: Informative messages about Redis connection status
4. **Flexible Development**: Can develop without Redis for basic features
5. **Production Ready**: Robust error handling for production environments

## Testing

To test the fix:
1. Start services without Redis: `pnpm dev`
2. You should see warnings but services should start successfully
3. Start Redis: `docker-compose up -d redis`
4. Restart services - they should connect to Redis
5. Stop Redis while services running - they should handle disconnection gracefully

## Next Steps

For production deployment:
- Ensure Redis is running and properly configured
- Monitor Redis connection health via logs
- Consider Redis Sentinel or Redis Cluster for high availability
- Adjust `REDIS_MAX_RETRIES` based on your infrastructure
