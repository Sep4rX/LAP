'use client'

import { COLORS } from '@/lib/utils/constants'
import { Star } from 'lucide-react'

export function Watchlist() {
  const watchlist = ['AAPL', 'MSFT', 'NVDA', 'TSLA']

  return (
    <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
      <div className="mb-4 pb-3 border-b border-border flex items-center gap-2">
        <Star size={16} style={{ color: COLORS.ACCENT }} fill={COLORS.ACCENT} />
        <span className="text-muted">WATCHLIST</span>
      </div>

      <div className="space-y-2">
        {watchlist.map((ticker) => (
          <div
            key={ticker}
            className="p-3 bg-background border border-border rounded hover:border-accent transition cursor-pointer flex justify-between items-center"
          >
            <span style={{ color: COLORS.ACCENT }} className="font-bold">
              {ticker}
            </span>
            <span className="text-muted">↔️</span>
          </div>
        ))}
      </div>
    </div>
  )
}
