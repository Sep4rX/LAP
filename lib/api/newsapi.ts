import axios from 'axios'
import { NewsItem } from '@/types'
import { cache } from '@/lib/cache/redis'
import { CACHE_TTL } from '@/lib/utils/constants'

const BASE_URL = 'https://newsapi.org/v2'
const API_KEY = process.env.NEWS_API_KEY

export const newsAPI = {
  async getNews(ticker: string, limit: number = 10): Promise<NewsItem[]> {
    try {
      const cacheKey = cache.getCacheKey.news(`newsapi:${ticker}`)
      const cached = await cache.get<NewsItem[]>(cacheKey)
      if (cached) return cached

      const response = await axios.get(`${BASE_URL}/everything`, {
        params: {
          q: ticker,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: limit,
          apiKey: API_KEY,
        },
        timeout: 5000,
      })

      const news: NewsItem[] = (response.data.articles || []).map(
        (article: any) => ({
          ticker,
          headline: article.title,
          description: article.description || '',
          url: article.url,
          source: article.source.name,
          timestamp: new Date(article.publishedAt).getTime(),
        }),
      )

      await cache.set(cacheKey, news, CACHE_TTL.NEWS)
      return news
    } catch (error) {
      console.error(`NewsAPI error for ${ticker}:`, error)
      return []
    }
  },

  async getBusinessNews(limit: number = 20): Promise<NewsItem[]> {
    try {
      const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
          category: 'business',
          language: 'en',
          pageSize: limit,
          apiKey: API_KEY,
        },
        timeout: 5000,
      })

      return (response.data.articles || []).map((article: any) => ({
        ticker: 'MARKET',
        headline: article.title,
        description: article.description || '',
        url: article.url,
        source: article.source.name,
        timestamp: new Date(article.publishedAt).getTime(),
      }))
    } catch (error) {
      console.error('NewsAPI business news error:', error)
      return []
    }
  },
}
