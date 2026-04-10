import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tickers = searchParams.get('tickers')?.split(',') || []

    if (tickers.length === 0) {
      return NextResponse.json({ error: 'At least one ticker required' }, { status: 400 })
    }

    // Placeholder for signal data
    const signals = tickers.map(ticker => ({
      ticker,
      signal: ['Buy', 'Sell', 'Hold'][Math.floor(Math.random() * 3)],
      confidence: Math.random() * 0.5 + 0.5,
      strength: Math.random(),
    }))

    return NextResponse.json(signals, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  } catch (error) {
    console.error('Signals API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
