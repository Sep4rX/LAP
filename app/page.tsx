'use client'

import { useState } from 'react'
import { Dashboard } from '@/components/Dashboard'
import { SignalTable } from '@/components/SignalTable'
import { VolatilityChart } from '@/components/VolatilityChart'
import { CorrelationMatrix } from '@/components/CorrelationMatrix'
import { MacroPanel } from '@/components/MacroPanel'
import { RiskMetrics } from '@/components/RiskMetrics'
import { AlertsFeed } from '@/components/AlertsFeed'
import { Watchlist } from '@/components/Watchlist'
import { SentimentGauge } from '@/components/SentimentGauge'
import { BacktestPanel } from '@/components/BacktestPanel'
import { InsiderActivity } from '@/components/InsiderActivity'
import { EarningsCalendar } from '@/components/EarningsCalendar'
import { useMacroData } from '@/hooks/useMacroData'

export default function Home() {
  const { macro, isLoading: macroLoading } = useMacroData()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'signals' | 'analysis' | 'portfolio'>('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'signals', label: 'SIGNALS' },
    { id: 'analysis', label: 'ANALYSIS' },
    { id: 'portfolio', label: 'PORTFOLIO' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Tab Navigation */}
      <div className="border-b border-border bg-background sticky top-0 z-40">
        <div className="px-6 py-4 flex gap-8 overflow-x-auto font-mono text-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'dashboard' | 'signals' | 'analysis' | 'portfolio')}
              className={`pb-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? `border-b-2 border-accent text-accent`
                  : 'text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 p-6">
            <Dashboard />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VolatilityChart />
              </div>
              <div>
                <MacroPanel macro={macro} isLoading={macroLoading} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertsFeed />
              <SentimentGauge />
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="space-y-6 p-6">
            <SignalTable />
            <BacktestPanel />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CorrelationMatrix />
              <RiskMetrics />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <InsiderActivity />
              <EarningsCalendar />
              <Watchlist />
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-6 p-6">
            <div className="p-6 bg-surface border border-border rounded font-mono">
              <div className="mb-4 pb-4 border-b border-border">
                <span className="text-muted">PORTFOLIO MANAGER</span>
              </div>
              <div className="text-center text-muted py-12">
                Portfolio management features coming soon
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-4 mt-12">
        <div className="container mx-auto px-6 font-mono text-xs text-muted flex justify-between items-center">
          <div>AlphaEdge v1.0.0 • Hedge Fund ML Engine</div>
          <div>© 2024 • MIT License</div>
        </div>
      </footer>
    </div>
  )
}
