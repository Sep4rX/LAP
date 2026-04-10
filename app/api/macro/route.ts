import { NextRequest, NextResponse } from 'next/server'
import { fredAPI } from '@/lib/api/fred'
import { cache } from '@/lib/cache/redis'
import { CACHE_TTL } from '@/lib/utils/constants'

export async function GET(request: NextRequest) {
  try {
    const cacheKey = 'api:macro'
    const cached = await cache.get(cacheKey)

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        },
      })
    }

    const macro = await fredAPI.getMacroData()

    if (!macro) {
      return NextResponse.json(
        { error: 'Failed to fetch macro data' },
        { status: 500 },
      )
    }

    await cache.set(cacheKey, macro, CACHE_TTL.MACRO)

    return NextResponse.json(macro, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  } catch (error) {
    console.error('Macro API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
