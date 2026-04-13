import { NextRequest, NextResponse } from 'next/server'
import { getQuote } from '@/lib/api/rateLimiter'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticker = searchParams.get('ticker')

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker required' }, { status: 400 })
    }

    const quote = await getQuote(ticker)

    if (!quote) {
      return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 404 })
    }

    return NextResponse.json(quote, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
