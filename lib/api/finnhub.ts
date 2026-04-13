import axios from 'axios'
import { QuoteData, NewsItem, InsiderActivity } from '@/types'
import { cache } from '@/lib/cache/redis'
import { CACHE_TTL } from '@/lib/utils/constants'

const BASE_URL = 'https://finnhub.io/api/v1'
const API_KEY = process.env.FINNHUB_API_KEY

export const finnhubAPI = {
  async getQuote(ticker: string): Promise<QuoteData | null> {
    try {
      const cacheKey = cache.getCacheKey.quote(`finnhub:${ticker}`)
      const cached = await cache.get<QuoteData>(cacheKey)
      if (cached) return cached

      const response = await axios.get(`${BASE_URL}/quote`, {
        params: {
          symbol: ticker,
          token: API_KEY,
        },
        timeout: 5000,
      })

      const data = response.data
      if (!data.c) return null

      const quote: QuoteData = {
        ticker,
        price: data.c,
        change: data.d || 0,
        changePercent: data.dp || 0,
        timestamp: data.t ? data.t * 1000 : Date.now(),
        high: data.h,
        low: data.l,
        open: data.o,
        close: data.pc,
      }

      await cache.set(cacheKey, quote, CACHE_TTL.QUOTES)
      return quote
    } catch (error) {
      console.error(`Finnhub quote error for ${ticker}:`, error)
      return null
    }
  },

  async getNews(ticker: string, limit: number = 10): Promise<NewsItem[]> {
    try {
      const cacheKey = cache.getCacheKey.news(ticker)
      const cached = await cache.get<NewsItem[]>(cacheKey)
      if (cached) return cached

      const response = await axios.get(`${BASE_URL}/company-news`, {
        params: {
          symbol: ticker,
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0],
          token: API_KEY,
        },
        timeout: 5000,
      })

      const news: NewsItem[] = (response.data || [])
        .slice(0, limit)
        .map((item: { headline: string; summary?: string; url: string; source: string; datetime: number }) => ({
          ticker,
          headline: item.headline,
          description: item.summary || '',
          url: item.url,
          source: item.source,
          timestamp: item.datetime * 1000,
        }))

      await cache.set(cacheKey, news, CACHE_TTL.NEWS)
      return news
    } catch (error) {
      console.error(`Finnhub news error for ${ticker}:`, error)
      return []
    }
  },

  async getInsiderActivity(ticker: string): Promise<InsiderActivity | null> {
    try {
      const cacheKey = cache.getCacheKey.insider(ticker)
      const cached = await cache.get<InsiderActivity>(cacheKey)
      if (cached) return cached

      const response = await axios.get(`${BASE_URL}/stock/insider-sentiment`, {
        params: {
          symbol: ticker,
          token: API_KEY,
        },
        timeout: 5000,
      })

      const data = response.data.data?.[0]
      if (!data) return null

      const insider: InsiderActivity = {
        ticker,
        sentiment: data.sentiment || 0,
        mspr: data.mspr || 0,
        change: data.change || 0,
      }

      await cache.set(cacheKey, insider, CACHE_TTL.INSIDER)
      return insider
    } catch (error) {
      console.error(`Finnhub insider error for ${ticker}:`, error)
      return null
    }
  },

  async getEarnings(ticker: string) {
    try {
      const response = await axios.get(`${BASE_URL}/calendar/earnings`, {
        params: {
          symbol: ticker,
          token: API_KEY,
        },
        timeout: 5000,
      })
      return response.data
    } catch (error) {
      console.error(`Finnhub earnings error for ${ticker}:`, error)
      return null
    }
  },

  async getRecommendations(ticker: string) {
    try {
      const response = await axios.get(`${BASE_URL}/stock/recommendation`, {
        params: {
          symbol: ticker,
          token: API_KEY,
        },
        timeout: 5000,
      })
      return response.data || []
    } catch (error) {
      console.error(`Finnhub recommendations error for ${ticker}:`, error)
      return []
    }
  },
}
