import { NextRequest, NextResponse } from 'next/server'
import { getOHLCV } from '@/lib/api/rateLimiter'
import { finnhubAPI } from '@/lib/api/finnhub'
import { EnsembleModel } from '@/lib/ml/ensembleModel'
import { cache } from '@/lib/cache/redis'

export const dynamic = 'force-dynamic'
import { CACHE_TTL } from '@/lib/utils/constants'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticker = searchParams.get('ticker')

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker required' }, { status: 400 })
    }

    const cacheKey = cache.getCacheKey.prediction(ticker)
    const cached = await cache.get(cacheKey)

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      })
    }

    // Fetch OHLCV data
    const ohlcv = await getOHLCV(ticker)
    if (!ohlcv || ohlcv.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch stock data' },
        { status: 404 },
      )
    }

    // Fetch news for sentiment
    const news = await finnhubAPI.getNews(ticker, 5)
    const headlines = news.map(n => n.headline)

    // Generate prediction
    const ensemble = new EnsembleModel()
    const prediction = ensemble.predict(ticker, ohlcv, headlines)

    await cache.set(cacheKey, prediction, CACHE_TTL.NEWS)

    return NextResponse.json(prediction, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Predict API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
