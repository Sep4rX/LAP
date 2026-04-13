import axios from 'axios'
import { QuoteData, OHLCVData, TechnicalIndicators } from '@/types'
import { cache } from '@/lib/cache/redis'
import { CACHE_TTL } from '@/lib/utils/constants'

const BASE_URL = 'https://www.alphavantage.co/query'
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY

let requestCount = 0
let requestResetTime = Date.now()

export const alphaVantageAPI = {
  async getQuote(ticker: string): Promise<QuoteData | null> {
    try {
      const cacheKey = cache.getCacheKey.quote(ticker)
      const cached = await cache.get<QuoteData>(cacheKey)
      if (cached) return cached

      if (!this.canMakeRequest()) {
        console.log('Alpha Vantage daily limit reached, use fallback')
        return null
      }

      const response = await axios.get(BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: ticker,
          apikey: API_KEY,
        },
        timeout: 5000,
      })

      const data = response.data['Global Quote']
      if (!data || !data['05. price']) {
        console.error(`No quote data for ${ticker}`)
        return null
      }

      const quote: QuoteData = {
        ticker,
        price: parseFloat(data['05. price']),
        change: parseFloat(data['09. change'] || '0'),
        changePercent: parseFloat(data['10. change percent']?.replace('%', '') || '0'),
        timestamp: Date.now(),
        volume: parseInt(data['06. volume'] || '0'),
        high: parseFloat(data['03. high'] || '0'),
        low: parseFloat(data['04. low'] || '0'),
        open: parseFloat(data['02. open'] || '0'),
        close: parseFloat(data['08. previous close'] || '0'),
      }

      await cache.set(cacheKey, quote, CACHE_TTL.QUOTES)
      return quote
    } catch (error) {
      console.error(`Alpha Vantage quote error for ${ticker}:`, error)
      return null
    }
  },

  async getOHLCV(ticker: string): Promise<OHLCVData[] | null> {
    try {
      const cacheKey = cache.getCacheKey.ohlcv(ticker)
      const cached = await cache.get<OHLCVData[]>(cacheKey)
      if (cached) return cached

      if (!this.canMakeRequest()) {
        return null
      }

      const response = await axios.get(BASE_URL, {
        params: {
          function: 'TIME_SERIES_DAILY_ADJUSTED',
          symbol: ticker,
          outputsize: 'full',
          apikey: API_KEY,
        },
        timeout: 5000,
      })

      const timeSeries = response.data['Time Series (Daily Adjusted)'] || {}
      const ohlcv: OHLCVData[] = Object.entries(timeSeries)
        .slice(0, 60)
        .map(([date, data]) => ({
          timestamp: new Date(date).getTime(),
          open: parseFloat((data as Record<string, string>)['1. open']),
          high: parseFloat((data as Record<string, string>)['2. high']),
          low: parseFloat((data as Record<string, string>)['3. low']),
          close: parseFloat((data as Record<string, string>)['4. close']),
          volume: parseInt((data as Record<string, string>)['6. volume']),
        }))
        .reverse()

      await cache.set(cacheKey, ohlcv, CACHE_TTL.OHLCV)
      return ohlcv
    } catch (error) {
      console.error(`Alpha Vantage OHLCV error for ${ticker}:`, error)
      return null
    }
  },

  async getIndicators(ticker: string): Promise<TechnicalIndicators | null> {
    try {
      const cacheKey = cache.getCacheKey.indicators(ticker)
      const cached = await cache.get<TechnicalIndicators>(cacheKey)
      if (cached) return cached

      if (!this.canMakeRequest()) {
        return null
      }

      const rsiResponse = await axios.get(BASE_URL, {
        params: {
          function: 'RSI',
          symbol: ticker,
          interval: 'daily',
          time_period: 14,
          apikey: API_KEY,
        },
        timeout: 5000,
      })

      const indicators: TechnicalIndicators = {}

      const rsiData = rsiResponse.data['Technical Analysis: RSI']
      if (rsiData) {
        const latestRSI = Object.values(rsiData)[0] as Record<string, string>
        indicators.rsi = parseFloat(latestRSI['RSI'])
      }

      // In production, fetch MACD, BB, etc. similarly
      // For now, simplified implementation

      await cache.set(cacheKey, indicators, CACHE_TTL.INDICATORS)
      return indicators
    } catch (error) {
      console.error(`Alpha Vantage indicators error for ${ticker}:`, error)
      return null
    }
  },

  canMakeRequest(): boolean {
    const now = Date.now()
    if (now - requestResetTime > 86400000) {
      // Reset daily counter
      requestCount = 0
      requestResetTime = now
    }
    if (requestCount >= 25) {
      return false
    }
    requestCount++
    return true
  },

  getRemainingRequests(): number {
    const now = Date.now()
    if (now - requestResetTime > 86400000) {
      requestCount = 0
      requestResetTime = now
    }
    return Math.max(0, 25 - requestCount)
  },
}
