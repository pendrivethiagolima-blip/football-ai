import { Redis } from '@upstash/redis'

export const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : undefined

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null
  return await redis.get<T>(key)
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = 60) {
  if (!redis) return
  await redis.set(key, value, { ex: ttlSeconds })
}


