'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { COLORS } from '@/lib/utils/constants'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const [estTime, setEstTime] = useState(new Date().toLocaleTimeString())

  return (
    <nav className={cn(
      'border-b',
      'px-6 py-4',
      'flex items-center justify-between',
      'bg-background border-border',
      className,
    )}>
      <div className="flex items-center gap-4">
        <div className="text-xl font-mono font-bold" style={{ color: COLORS.ACCENT }}>
          ◆ AlphaEdge
        </div>
        <div className="text-xs text-muted" style={{ fontFamily: 'monospace' }}>
          EST: {estTime}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-xs px-2 py-1 bg-surface border border-border rounded font-mono">
          <span style={{ color: COLORS.ACCENT }}>●</span> Market Open
        </div>
        <div className="text-sm font-mono">
          <span style={{ color: COLORS.ACCENT }}>VIX:</span> 19.45
        </div>
        <button
          className="px-3 py-1 rounded border border-border hover:bg-surface transition font-mono text-xs"
          style={{ color: COLORS.TEXT }}
        >
          ⚙️
        </button>
      </div>
    </nav>
  )
}
