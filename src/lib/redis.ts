import Redis from 'ioredis';

const memoryCache = new Map<string, { value: string; expiresAt: number }>();

let redisClient: Redis | null = null;
let redisAvailable = false;

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  try {
    redisClient = new Redis(url, {
      maxRetriesPerRequest: 1,
      connectTimeout: 1500,
      lazyConnect: true,
    });
    redisClient.on('error', () => {
      redisAvailable = false;
    });
    redisClient.on('ready', () => {
      redisAvailable = true;
    });
    return redisClient;
  } catch {
    return null;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (client && redisAvailable) {
    try {
      const raw = await client.get(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      // Fallback to in-memory cache
    }
  }
  const hit = memoryCache.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    return JSON.parse(hit.value) as T;
  }
  if (hit) memoryCache.delete(key);
  return null;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
  const serialized = JSON.stringify(value);
  memoryCache.set(key, {
    value: serialized,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
  const client = getRedisClient();
  if (client && redisAvailable) {
    try {
      await client.set(key, serialized, 'EX', ttlSeconds);
    } catch {
      // Ignore Redis write error when offline
    }
  }
}
