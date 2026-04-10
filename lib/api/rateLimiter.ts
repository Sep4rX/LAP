import { alphaVantageAPI } from '@/lib/api/alphaVantage'
import { yahooFinanceAPI } from '@/lib/api/yahooFinance'
import { finnhubAPI } from '@/lib/api/finnhub'
import { TOP_10_TIER_1 } from '@/lib/utils/stockUniverse'
import { QuoteData, OHLCVData } from '@/types'

export async function getQuote(ticker: string): Promise<QuoteData | null> {
  // Try Tier 1 (Alpha Vantage) for top 10
  if (TOP_10_TIER_1.includes(ticker)) {
    const quote = await alphaVantageAPI.getQuote(ticker)
    if (quote) return quote
  }

  // Try Finnhub (universal)
  const finnhubQuote = await finnhubAPI.getQuote(ticker)
  if (finnhubQuote) return finnhubQuote

  // Fallback to Yahoo Finance
  return yahooFinanceAPI.getQuote(ticker)
}

export async function getOHLCV(ticker: string): Promise<OHLCVData[] | null> {
  // Try Tier 1 (Alpha Vantage) for top 10
  if (TOP_10_TIER_1.includes(ticker)) {
    const ohlcv = await alphaVantageAPI.getOHLCV(ticker)
    if (ohlcv) return ohlcv
  }

  // Fallback to Yahoo Finance
  return yahooFinanceAPI.getOHLCV(ticker)
}

export async function getAllQuotes(tickers: string[]): Promise<Record<string, QuoteData>> {
  const quotes: Record<string, QuoteData> = {}

  // Parallel requests
  const results = await Promise.all(
    tickers.map(async ticker => {
      const quote = await getQuote(ticker)
      return { ticker, quote }
    }),
  )

  results.forEach(({ ticker, quote }) => {
    if (quote) {
      quotes[ticker] = quote
    }
  })

  return quotes
}

export async function getAllOHLCV(tickers: string[]): Promise<Record<string, OHLCVData[]>> {
  const ohlcv: Record<string, OHLCVData[]> = {}

  const results = await Promise.all(
    tickers.map(async ticker => {
      const data = await getOHLCV(ticker)
      return { ticker, data }
    }),
  )

  results.forEach(({ ticker, data }) => {
    if (data) {
      ohlcv[ticker] = data
    }
  })

  return ohlcv
}
