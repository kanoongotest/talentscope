/**
 * PURPOSE: Top section of analysis results — total score, band badge, executive summary
 * INPUTS: Analysis record data
 * OUTPUTS: Header card with score, band, candidate info, summary, model badge
 * RELATIONSHIPS: Used by app/analyzer/[id]/page.tsx
 */

import { AiOutputWrapper } from '@/components/radar/ai-output-wrapper'

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

const BAND_LABELS: Record<string, string> = {
  A: 'Exceptional — Fast-track to interview',
  B: 'Strong — Standard interview process',
  C: 'Potential — Needs targeted follow-up',
  D: 'Below bar — Unlikely to advance',
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
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <AiOutputWrapper modelName={modelUsed} latencyMs={latencyMs} timestamp={new Date(createdAt).toLocaleString()}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{candidateName}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {roleType} · {seniorityLevel} · Analyzed {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-5xl font-bold ${scoreColor(scoreTotal)}`}>
              {Math.round(scoreTotal)}
            </p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold mt-1 ${BAND_STYLES[scoreBand] || BAND_STYLES.D}`}>
              Band {scoreBand}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-1">{BAND_LABELS[scoreBand] || ''}</p>
        </div>
        <div className="mt-4 p-4 rounded bg-gray-50 border border-gray-100">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Executive Summary
          </p>
          <p className="text-sm text-gray-800 leading-relaxed">{executiveSummary}</p>
        </div>
      </AiOutputWrapper>
    </div>
  )
}
