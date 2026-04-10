'use client'

import { COLORS } from '@/lib/utils/constants'

export function RiskMetrics() {
  return (
    <div className="p-6 bg-surface border border-border rounded font-mono">
      <div className="mb-4 pb-3 border-b border-border text-xs text-muted">
        PORTFOLIO RISK
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-xs text-muted mb-2">Value at Risk (95%)</div>
          <div className="text-lg" style={{ color: COLORS.DANGER }}>
            $12,450
          </div>
        </div>

        <div>
          <div className="text-xs text-muted mb-2">Sharpe Ratio (T=252)</div>
          <div className="text-lg" style={{ color: COLORS.ACCENT }}>
            1.82
          </div>
        </div>

        <div>
          <div className="text-xs text-muted mb-2">Max Drawdown (YTD)</div>
          <div className="text-lg" style={{ color: COLORS.WARNING }}>
            -8.4%
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted mb-3">Sector Allocation</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Technology</span>
              <span style={{ color: COLORS.ACCENT }}>35%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Healthcare</span>
              <span style={{ color: COLORS.INFO }}>18%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Financials</span>
              <span style={{ color: COLORS.WARNING }}>22%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Other</span>
              <span style={{ color: COLORS.MUTED }}>25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
