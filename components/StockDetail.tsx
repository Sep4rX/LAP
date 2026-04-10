'use client'

import { COLORS } from '@/lib/utils/constants'

export function StockDetail() {
  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="bg-surface border border-border rounded p-6 font-mono">
        <div className="mb-4 pb-4 border-b border-border">
          <div style={{ color: COLORS.ACCENT }} className="text-2xl font-bold">
            AAPL
          </div>
          <div className="text-muted">Apple Inc.</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-muted mb-1">Price</div>
            <div style={{ color: COLORS.ACCENT }} className="text-lg">
              $189.45
            </div>
          </div>
          <div>
            <div className="text-muted mb-1">Change</div>
            <div style={{ color: COLORS.ACCENT }}>+2.34%</div>
          </div>
          <div>
            <div className="text-muted mb-1">52W High</div>
            <div style={{ color: COLORS.INFO }}>$199.62</div>
          </div>
          <div>
            <div className="text-muted mb-1">52W Low</div>
            <div style={{ color: COLORS.WARNING }}>$154.31</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded p-6 font-mono">
            <div className="text-muted text-xs mb-4">Candlestick Chart</div>
            <div className="h-80 bg-background rounded" />
          </div>
          <div className="bg-surface border border-border rounded p-6 font-mono">
            <div className="text-muted text-xs mb-4">Indicators</div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-muted mb-1">RSI(14)</div>
                <div style={{ color: COLORS.ACCENT }}>67.3</div>
              </div>
              <div>
                <div className="text-muted mb-1">MACD</div>
                <div style={{ color: COLORS.INFO }}>0.0234</div>
              </div>
              <div>
                <div className="text-muted mb-1">BB Upper</div>
                <div style={{ color: COLORS.ACCENT }}>195.2</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded p-6 font-mono text-xs">
            <div className="text-muted mb-4">Prediction</div>
            <div style={{ color: COLORS.ACCENT }} className="text-lg font-bold mb-2">
              BUY
            </div>
            <div>Confidence: 82%</div>
            <div>Target: $198.50</div>
          </div>

          <div className="bg-surface border border-border rounded p-6 font-mono text-xs">
            <div className="text-muted mb-4">Fundamentals</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>PE Ratio:</span>
                <span style={{ color: COLORS.INFO }}>28.3</span>
              </div>
              <div className="flex justify-between">
                <span>Dividend:</span>
                <span style={{ color: COLORS.ACCENT }}>0.92%</span>
              </div>
              <div className="flex justify-between">
                <span>Market Cap:</span>
                <span style={{ color: COLORS.ACCENT }}>$2.9T</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
