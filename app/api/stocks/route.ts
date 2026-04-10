import { NextRequest, NextResponse } from 'next/server'
import { getOHLCV } from '@/lib/api/rateLimiter'
import { getIndicators } from '@/lib/quant/indicators'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticker = searchParams.get('ticker')

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker required' }, { status: 400 })
    }

    const ohlcv = await getOHLCV(ticker)

    if (!ohlcv || ohlcv.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 404 })
    }

    const indicators = getIndicators(ohlcv)

    return NextResponse.json(
      { ohlcv, indicators },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      },
    )
  } catch (error) {
    console.error('Stock data API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
