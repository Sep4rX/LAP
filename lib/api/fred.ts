import axios from 'axios'
import { MacroData } from '@/types'
import { cache } from '@/lib/cache/redis'
import { CACHE_TTL } from '@/lib/utils/constants'

const BASE_URL = 'https://api.stlouisfed.org/fred'
const API_KEY = process.env.FRED_API_KEY

const SERIES_IDS = {
  VIX: 'VIXCLS',
  FED_RATE: 'DFF',
  YIELD_CURVE: 'T10Y2Y',
  UNEMPLOYMENT: 'UNRATE',
  CPI: 'CPIAUCSL',
  GDP: 'A191RL1Q225SBEA',
}

export const fredAPI = {
  async getMacroData(): Promise<MacroData | null> {
    try {
      const cacheKey = cache.getCacheKey.macro()
      const cached = await cache.get<MacroData>(cacheKey)
      if (cached) return cached

      const [vix, fedRate, yieldCurve, unemployment, cpi] = await Promise.all([
        this.getSeries(SERIES_IDS.VIX),
        this.getSeries(SERIES_IDS.FED_RATE),
        this.getSeries(SERIES_IDS.YIELD_CURVE),
        this.getSeries(SERIES_IDS.UNEMPLOYMENT),
        this.getSeries(SERIES_IDS.CPI),
      ])

      const regime = this.determineRegime(vix?.value || 0, yieldCurve?.value || 0)

      const macroData: MacroData = {
        vix: vix?.value || 0,
        fedRate: fedRate?.value || 0,
        yieldCurve: yieldCurve?.value || 0,
        cpi: cpi?.value || 0,
        unemployment: unemployment?.value || 0,
        gdp: 0, // Would fetch separately
        regime,
        timestamp: Date.now(),
      }

      await cache.set(cacheKey, macroData, CACHE_TTL.MACRO)
      return macroData
    } catch (error) {
      console.error('FRED macro data error:', error)
      return null
    }
  },

  async getSeries(
    seriesId: string,
  ): Promise<{ value: number; date: string } | null> {
    try {
      const response = await axios.get(
        `${BASE_URL}/series/observations`,
        {
          params: {
            series_id: seriesId,
            api_key: API_KEY,
            limit: 1,
            sort_order: 'desc',
          },
          timeout: 5000,
        },
      )

      const observation = response.data.observations?.[0]
      if (!observation || observation.value === '.') {
        return null
      }

      return {
        value: parseFloat(observation.value),
        date: observation.date,
      }
    } catch (error) {
      console.error(`FRED series error for ${seriesId}:`, error)
      return null
    }
  },

  determineRegime(vix: number, yieldCurve: number): MacroData['regime'] {
    if (vix > 25 || yieldCurve < -0.5) {
      return 'Risk-Off'
    }
    if (vix < 15 && yieldCurve > 1) {
      return 'Risk-On'
    }
    return 'Neutral'
  },
}
