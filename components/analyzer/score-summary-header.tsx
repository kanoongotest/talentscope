/**
 * PURPOSE: Top section of analysis results — score, band badge with tooltip, executive summary
 * INPUTS: Analysis record data
 * OUTPUTS: Header card with score, band tooltip, candidate info, summary, completion time
 * RELATIONSHIPS: Used by analysis-results-view.tsx
 */

'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'

interface Props {
  candidateName: string
  scoreTotal: number
  scoreBand: string
  executiveSummary: string
  roleType: string
  seniorityLevel: string
  createdAt: string
  modelUsed: string
  latencyMs: number
}

const BAND_STYLES: Record<string, string> = {
  A: 'bg-green-100 text-green-800',
  B: 'bg-blue-100 text-blue-800',
  C: 'bg-amber-100 text-amber-800',
  D: 'bg-red-100 text-red-800',
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 65) return 'text-blue-600'
  if (score >= 50) return 'text-amber-600'
  return 'text-red-600'
}

export function ScoreSummaryHeader({
  candidateName, scoreTotal, scoreBand, executiveSummary,
  roleType, seniorityLevel, createdAt, modelUsed, latencyMs,
}: Props) {
  const [showBandInfo, setShowBandInfo] = useState(false)
  const latencyStr = (latencyMs / 1000).toFixed(1)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{candidateName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {roleType} · {seniorityLevel} · {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-5xl font-bold ${scoreColor(scoreTotal)}`}>
            {Math.round(scoreTotal)}
          </p>
          <div className="flex items-center gap-1 mt-1 justify-end relative">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${BAND_STYLES[scoreBand] || BAND_STYLES.D}`}>
              Band {scoreBand}
            </span>
            <button
              onClick={() => setShowBandInfo(!showBandInfo)}
              className="text-gray-400 hover:text-gray-600"
              title="What do bands mean?"
            >
              <HelpCircle size={14} />
            </button>
            {showBandInfo && (
              <div className="absolute top-8 right-0 z-10 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg text-left">
                <p className="text-xs font-semibold text-gray-700 mb-2">Score Bands</p>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <p><span className="font-semibold text-green-700">A (80-100)</span> Exceptional. Fast-track to interview.</p>
                  <p><span className="font-semibold text-blue-700">B (65-79)</span> Strong. Standard interview process.</p>
                  <p><span className="font-semibold text-amber-700">C (50-64)</span> Potential. Needs targeted follow-up.</p>
                  <p><span className="font-semibold text-red-700">D (0-49)</span> Below bar. Unlikely to advance.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 rounded bg-gray-50 border border-gray-100">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Executive Summary
        </p>
        <p className="text-sm text-gray-800 leading-relaxed">{executiveSummary}</p>
      </div>

      <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 font-mono">{modelUsed}</span>
        <span>Analysis completed in {latencyStr}s</span>
        <span>{new Date(createdAt).toLocaleString()}</span>
      </div>
    </div>
  )
}
