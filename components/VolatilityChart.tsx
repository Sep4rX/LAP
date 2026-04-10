'use client'

import { COLORS } from '@/lib/utils/constants'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function VolatilityChart() {
  const data = Array(30).fill(0).map((_, i) => ({
    day: i,
    volatility: 15 + Math.sin(i / 5) * 5 + Math.random() * 3,
  }))

  return (
    <div className="p-6 bg-surface border border-border rounded">
      <div className="mb-4 pb-3 border-b border-border font-mono text-xs text-muted">
        30-DAY VOLATILITY FORECAST
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.BORDER} />
          <XAxis stroke={COLORS.MUTED} />
          <YAxis stroke={COLORS.MUTED} />
          <Tooltip
            contentStyle={{ backgroundColor: COLORS.SURFACE, border: `1px solid ${COLORS.BORDER}` }}
            formatter={(value: any) => value.toFixed(2)}
          />
          <Line
            type="monotone"
            dataKey="volatility"
            stroke={COLORS.ACCENT}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
