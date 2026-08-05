import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient() {
  if (!redis) {
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
    redis = new Redis(url, {
      maxRetriesPerRequest: null,
    });
  }

  return redis;
}
