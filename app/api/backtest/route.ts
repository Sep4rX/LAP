import { NextRequest, NextResponse } from 'next/server'
import { getOHLCV } from '@/lib/api/rateLimiter'
import { backtest, calculateReturns } from '@/lib/quant/backtest'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticker = searchParams.get('ticker')
    const period = searchParams.get('period') || '3M'

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker required' }, { status: 400 })
    }

    const ohlcv = await getOHLCV(ticker)

    if (!ohlcv || ohlcv.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch stock data' },
        { status: 404 },
      )
    }

    // Generate simple buy/hold signals based on moving averages
    const closes = ohlcv.map(d => d.close)
    const signals: boolean[] = [false]

    const sma20Window = 20
    const sma50Window = 50

    for (let i = Math.max(sma20Window, sma50Window); i < closes.length; i++) {
      const sma20 = closes.slice(i - sma20Window + 1, i + 1).reduce((a, b) => a + b, 0) / sma20Window
      const sma50 = closes.slice(i - sma50Window + 1, i + 1).reduce((a, b) => a + b, 0) / sma50Window
      signals.push(sma20 > sma50)
    }

    // Pad signals
    while (signals.length < ohlcv.length) {
      signals.unshift(false)
    }

    const result = backtest(ohlcv, signals.slice(-ohlcv.length), 100000)

    return NextResponse.json(
      { ...result, period },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      },
    )
  } catch (error) {
    console.error('Backtest API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
