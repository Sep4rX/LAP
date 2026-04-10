'use client'

import { COLORS } from '@/lib/utils/constants'

export function BacktestPanel() {
  return (
    <div className="p-6 bg-surface border border-border rounded font-mono text-xs space-y-4">
      <div className="pb-4 border-b border-border">
        <div className="text-muted mb-2">BACKTEST RESULTS</div>
        <div className="grid grid-cols-4 gap-2">
          <button className="px-2 py-1 border border-border rounded hover:bg-background">1M</button>
          <button className="px-2 py-1 border border-accent rounded" style={{ color: COLORS.ACCENT }}>
            3M
          </button>
          <button className="px-2 py-1 border border-border rounded hover:bg-background">6M</button>
          <button className="px-2 py-1 border border-border rounded hover:bg-background">1Y</button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted">Total Return:</span>
          <span style={{ color: COLORS.ACCENT }}>+12.4%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Sharpe Ratio:</span>
          <span style={{ color: COLORS.INFO }}>1.65</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Max Drawdown:</span>
          <span style={{ color: COLORS.DANGER }}>-8.2%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Win Rate:</span>
          <span style={{ color: COLORS.ACCENT }}>62%</span>
        </div>
      </div>
    </div>
  )
}
