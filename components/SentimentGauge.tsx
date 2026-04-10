'use client'

import { COLORS } from '@/lib/utils/constants'
import { Gauge } from 'lucide-react'

export function SentimentGauge() {
  const sentiment = 0.65 // -1 to 1

  return (
    <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
      <div className="mb-4 pb-3 border-b border-border flex items-center gap-2">
        <Gauge size={16} style={{ color: COLORS.ACCENT }} />
        <span className="text-muted">MARKET SENTIMENT</span>
      </div>

      <div className="flex justify-center items-center mb-4">
        <div
          className="w-24 h-24 rounded-full border-2 flex items-center justify-center text-lg font-bold"
          style={{
            borderColor: sentiment > 0.3 ? COLORS.ACCENT : COLORS.DANGER,
            color: sentiment > 0.3 ? COLORS.ACCENT : COLORS.DANGER,
          }}
        >
          {(sentiment * 100).toFixed(0)}%
        </div>
      </div>

      <div className="text-center">
        <div className="text-muted mb-2">Bullish Pressure</div>
        <div
          className="text-sm px-3 py-1 rounded border border-border"
          style={{ color: sentiment > 0.3 ? COLORS.ACCENT : COLORS.MUTED }}
        >
          {sentiment > 0.5 ? 'Strong Bull' : sentiment > 0.2 ? 'Moderate Bull' : 'Neutral/Bear'}
        </div>
      </div>
    </div>
  )
}
