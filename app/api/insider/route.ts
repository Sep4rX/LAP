import { NextRequest, NextResponse } from 'next/server'
import { finnhubAPI } from '@/lib/api/finnhub'
import { cache } from '@/lib/cache/redis'
import { CACHE_TTL } from '@/lib/utils/constants'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticker = searchParams.get('ticker')

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker required' }, { status: 400 })
    }

    const cacheKey = cache.getCacheKey.insider(ticker)
    const cached = await cache.get(cacheKey)

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
        },
      })
    }

    const insider = await finnhubAPI.getInsiderActivity(ticker)

    if (!insider) {
      return NextResponse.json(
        { error: 'Failed to fetch insider data' },
        { status: 404 },
      )
    }

    await cache.set(cacheKey, insider, CACHE_TTL.INSIDER)

    return NextResponse.json(insider, {
      headers: {
        'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Insider API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
