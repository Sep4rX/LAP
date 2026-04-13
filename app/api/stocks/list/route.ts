import { NextResponse } from 'next/server'
import { STOCK_UNIVERSE } from '@/lib/utils/stockUniverse'
import { getAllQuotes, getAllOHLCV } from '@/lib/api/rateLimiter'

export async function GET() {
  try {
    const tickers = STOCK_UNIVERSE.map(s => s.ticker)

    const [quotes, ohlcv] = await Promise.all([
      getAllQuotes(tickers),
      getAllOHLCV(tickers),
    ])

    const enrichedStocks = STOCK_UNIVERSE.map(stock => ({
      ...stock,
      quote: quotes[stock.ticker],
      ohlcv: ohlcv[stock.ticker],
    })).filter(s => s.quote)

    return NextResponse.json(enrichedStocks, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Stocks API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
