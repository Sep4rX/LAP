'use client'

import { NewsItem } from '@/types'
import { formatDateTime } from '@/lib/utils/formatters'
import { COLORS } from '@/lib/utils/constants'
import { ExternalLink } from 'lucide-react'

interface NewsFeedProps {
  news: NewsItem[]
  isLoading?: boolean
}

export function NewsFeed({ news, isLoading }: NewsFeedProps) {
  if (isLoading) {
    return (
      <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
        <div className="text-center text-muted">Loading news...</div>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="p-6 bg-surface border border-border rounded font-mono text-xs">
        <div className="text-center text-muted">No news available</div>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-6 bg-surface border border-border rounded font-mono text-xs max-h-96 overflow-y-auto">
      <div className="mb-4 pb-3 border-b border-border">
        <span className="text-muted">LATEST NEWS</span>
      </div>

      {news.map((item: NewsItem) => (
        <div key={item.url} className="pb-3 border-b border-border last:border-b-0">
          <div className="flex gap-2 mb-1">
            <span style={{ color: COLORS.ACCENT }} className="font-bold">
              {item.source}
            </span>
            <span className="text-muted" style={{ color: COLORS.MUTED }}>
              {formatDateTime(item.timestamp)}
            </span>
          </div>
          <div style={{ color: COLORS.TEXT }} className="text-xs leading-tight mb-2">
            {item.headline}
          </div>
          {item.description && (
            <div style={{ color: COLORS.MUTED }} className="text-xs line-clamp-2 mb-2">
              {item.description}
            </div>
          )}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs hover:opacity-80"
            style={{ color: COLORS.INFO }}
          >
            Read <ExternalLink size={12} />
          </a>
        </div>
      ))}
    </div>
  )
}
