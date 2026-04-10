'use client'

import { QuoteData } from '@/types'
import { cn } from '@/lib/utils/cn'
import { formatPrice, formatPercent, getColorForPercent } from '@/lib/utils/formatters'
import { COLORS } from '@/lib/utils/constants'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StockCardProps {
  ticker: string
  name: string
  sector: string
  quote: QuoteData | undefined
  isLoading?: boolean
  onClick?: () => void
  className?: string
}

export function StockCard({
  ticker,
  name,
  sector,
  quote,
  isLoading,
  onClick,
  className,
}: StockCardProps) {
  const isPositive = quote ? quote.changePercent > 0 : false
  const color = quote ? getColorForPercent(quote.changePercent) : COLORS.MUTED

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 border rounded cursor-pointer transition',
        'bg-surface border-border hover:border-accent',
        'font-mono text-xs',
        isLoading && 'opacity-50',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-bold text-sm" style={{ color: COLORS.ACCENT }}>
            {ticker}
          </div>
          <div className="text-muted text-xs">{name}</div>
        </div>
        {isPositive ? (
          <TrendingUp size={16} style={{ color: COLORS.ACCENT }} />
        ) : (
          <TrendingDown size={16} style={{ color: COLORS.DANGER }} />
        )}
      </div>

      <div className="space-y-1 mb-3">
        <div className="flex justify-between">
          <span className="text-muted">Price:</span>
          <span style={{ color }}>{quote ? formatPrice(quote.price) : '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Change:</span>
          <span style={{ color }}>{quote ? formatPercent(quote.changePercent) : '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Sector:</span>
          <span style={{ color: COLORS.INFO }}>{sector}</span>
        </div>
      </div>

      <div className="w-full h-8 bg-border rounded opacity-50" />
    </div>
  )
}
