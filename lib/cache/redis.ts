import { kv } from '@vercel/kv'
import { CACHE_TTL } from '@/lib/utils/constants'

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!process.env.KV_REST_API_URL) {
        console.warn('KV_REST_API_URL not configured, skipping cache')
        return null
      }
      return await kv.get<T>(key)
    } catch (error) {
      console.error(`Cache get error for ${key}:`, error)
      return null
    }
  },

  async set<T>(key: string, value: T, ttl: number = CACHE_TTL.QUOTES): Promise<void> {
    try {
      if (!process.env.KV_REST_API_URL) {
        console.warn('KV_REST_API_URL not configured, skipping cache set')
        return
      }
      await kv.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error(`Cache set error for ${key}:`, error)
    }
  },

  async del(key: string): Promise<void> {
    try {
      if (!process.env.KV_REST_API_URL) return
      await kv.del(key)
    } catch (error) {
      console.error(`Cache del error for ${key}:`, error)
    }
  },

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      if (!process.env.KV_REST_API_URL) {
        return keys.map(() => null)
      }
      return await Promise.all(keys.map(k => this.get<T>(k)))
    } catch (error) {
      console.error('Cache mget error:', error)
      return keys.map(() => null)
    }
  },

  getCacheKey: {
    quote: (ticker: string) => `quote:${ticker}`,
    ohlcv: (ticker: string) => `ohlcv:${ticker}`,
    indicators: (ticker: string) => `indicators:${ticker}`,
    fundamentals: (ticker: string) => `fundamentals:${ticker}`,
    macro: () => 'macro:data',
    news: (ticker: string) => `news:${ticker}`,
    insider: (ticker: string) => `insider:${ticker}`,
    prediction: (ticker: string) => `prediction:${ticker}`,
  },
}
