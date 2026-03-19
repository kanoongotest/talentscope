/**
 * PURPOSE: Reusable wrapper for AI-generated output showing model badge, latency, and feedback
 * INPUTS: children (AI content), modelName, latencyMs, timestamp
 * OUTPUTS: Wrapped content with transparent AI metadata footer
 * RELATIONSHIPS: Used by bleed-score-panel, enrichment-panel, strategy-brief-panel
 */

'use client'

import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState } from 'react'

interface Props {
  children: React.ReactNode
  modelName: string
  latencyMs: number
  timestamp?: string
}

export function AiOutputWrapper({ children, modelName, latencyMs, timestamp }: Props) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const latencyStr = (latencyMs / 1000).toFixed(1) + 's'
  const time = timestamp || new Date().toLocaleTimeString()

  return (
    <div className="space-y-3">
      {children}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 font-mono">
            {modelName}
          </span>
          <span>{latencyStr}</span>
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFeedback('up')}
            className={`p-1 rounded hover:bg-gray-100 ${feedback === 'up' ? 'text-green-600' : 'text-gray-300'}`}
            title="Helpful"
          >
            <ThumbsUp size={14} />
          </button>
          <button
            onClick={() => setFeedback('down')}
            className={`p-1 rounded hover:bg-gray-100 ${feedback === 'down' ? 'text-red-500' : 'text-gray-300'}`}
            title="Not helpful"
          >
            <ThumbsDown size={14} />
          </button>
          {/* TODO: POST feedback to /api/feedback when feedback table is ready */}
        </div>
      </div>
    </div>
  )
}
