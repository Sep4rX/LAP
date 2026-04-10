'use client'

import { COLORS } from '@/lib/utils/constants'

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface border border-border rounded font-mono">
          <div className="text-xs text-muted mb-2">Portfolio Value</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.ACCENT }}>
            $512,450
          </div>
          <div className="text-xs text-green-500 mt-1">+8.4% YTD</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded font-mono">
          <div className="text-xs text-muted mb-2">Market Status</div>
          <div style={{ color: COLORS.ACCENT }}>●</div>
          <div className="text-xs mt-1">Open</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded font-mono">
          <div className="text-xs text-muted mb-2">VIX Index</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.MUTED }}>
            19.45
          </div>
          <div className="text-xs mt-1">Moderate Vol</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded font-mono">
          <div className="text-xs text-muted mb-2">Top Signal</div>
          <div style={{ color: COLORS.ACCENT }}>BUY</div>
          <div className="text-xs mt-1">48 stocks</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-surface border border-border rounded font-mono text-xs">
          <div className="text-muted mb-4">Main Dashboard Area</div>
          <div className="text-center text-muted py-12">Chart & stock grid component would be here</div>
        </div>
        <div className="space-y-6">
          <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
            <div className="text-muted mb-4">Macro Panel</div>
            <div className="text-center text-muted py-8">Macro indicators here</div>
          </div>
          <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
            <div className="text-muted mb-4">Alerts</div>
            <div className="text-center text-muted py-8">Active alerts here</div>
          </div>
        </div>
      </div>
    </div>
  )
}
