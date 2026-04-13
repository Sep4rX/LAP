import { OHLCVData, QuoteData } from '@/types'
import { cache } from '@/lib/cache/redis'
import { CACHE_TTL } from '@/lib/utils/constants'

export const yahooFinanceAPI = {
  async getQuote(ticker: string): Promise<QuoteData | null> {
    try {
      const cacheKey = cache.getCacheKey.quote(`yahoo:${ticker}`)
      const cached = await cache.get<QuoteData>(cacheKey)
      if (cached) return cached

      // This is server-side only, dynamically require yahoo-finance2
      const { default: yf } = await import('yahoo-finance2')

      const quote = await yf.quote(ticker)

      if (!quote || !quote.regularMarketPrice) {
        return null
      }

      const data: QuoteData = {
        ticker,
        price: quote.regularMarketPrice || 0,
        change: (quote.regularMarketPrice || 0) - (quote.regularMarketPreviousClose || 0),
        changePercent: ((quote.regularMarketPrice || 0) / (quote.regularMarketPreviousClose || 1) - 1) * 100,
        timestamp: Date.now(),
        volume: quote.regularMarketVolume || 0,
        high: quote.regularMarketDayHigh || 0,
        low: quote.regularMarketDayLow || 0,
        open: quote.regularMarketOpen || 0,
        close: quote.regularMarketPreviousClose || 0,
      }

      await cache.set(cacheKey, data, CACHE_TTL.QUOTES)
      return data
    } catch (error) {
      console.error(`Yahoo Finance quote error for ${ticker}:`, error)
      return null
    }
  },

  async getOHLCV(ticker: string): Promise<OHLCVData[] | null> {
    try {
      const cacheKey = cache.getCacheKey.ohlcv(`yahoo:${ticker}`)
      const cached = await cache.get<OHLCVData[]>(cacheKey)
      if (cached) return cached

      const { default: yf } = await import('yahoo-finance2')

      const result = await yf.historical(ticker, {
        period1: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        period2: new Date(),
        interval: '1d',
      })

      const ohlcv = (result || []).map(bar => ({
        timestamp: bar.date.getTime(),
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
        volume: bar.volume,
      }))

      await cache.set(cacheKey, ohlcv, CACHE_TTL.OHLCV)
      return ohlcv
    } catch (error) {
      console.error(`Yahoo Finance OHLCV error for ${ticker}:`, error)
      return null
    }
  },
}
