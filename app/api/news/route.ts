import { NextRequest, NextResponse } from 'next/server'
import { finnhubAPI } from '@/lib/api/finnhub'
import { newsAPI } from '@/lib/api/newsapi'
import { cache } from '@/lib/cache/redis'
import { CACHE_TTL } from '@/lib/utils/constants'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticker = searchParams.get('ticker')

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker required' }, { status: 400 })
    }

    const cacheKey = cache.getCacheKey.news(ticker)
    const cached = await cache.get(cacheKey)

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      })
    }

    // Try Finnhub first, fallback to NewsAPI
    let news = await finnhubAPI.getNews(ticker, 10)
    if (news.length === 0) {
      news = await newsAPI.getNews(ticker, 10)
    }

    await cache.set(cacheKey, news, CACHE_TTL.NEWS)

    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
