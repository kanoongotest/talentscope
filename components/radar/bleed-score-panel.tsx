/**
 * PURPOSE: Interactive bleed score display with AI generation trigger
 * INPUTS: companyId, initial bleed score data from company record
 * OUTPUTS: Score display with generate/recalculate button and AI reasoning
 * RELATIONSHIPS: Used by app/radar/[id]/page.tsx, calls /api/radar/bleed-score
 */

'use client'

import { useState } from 'react'
import { AiOutputWrapper } from './ai-output-wrapper'
import { AiLoadingStepper } from './ai-loading-stepper'

interface Props {
  companyId: string
  initialScore: number | null
  initialReasoning: string | null
  initialConfidence: string | null
  initialUpdatedAt: string | null
}

interface BleedResult {
  bleed_score: number
  reasoning: string
  confidence: string
  confidence_reason: string
  prediction: string | null
  recommendation: string
  model_used: string
  latency_ms: number
}

function scoreColor(score: number): string {
  if (score <= 30) return 'text-green-600'
  if (score <= 60) return 'text-amber-600'
  return 'text-red-600'
}

export function BleedScorePanel({
  companyId, initialScore, initialReasoning, initialConfidence, initialUpdatedAt,
}: Props) {
  const [result, setResult] = useState<BleedResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const score = result?.bleed_score ?? initialScore
  const reasoning = result?.reasoning ?? initialReasoning
  const confidence = result?.confidence ?? initialConfidence

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/radar/bleed-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id: companyId }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Request failed')
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Bleed Score
        </h2>
        <button
          onClick={generate}
          disabled={loading}
          className="rounded bg-[#185CE3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1248B3] disabled:opacity-50"
        >
          {score ? 'Recalculate' : 'Generate Bleed Score'}
        </button>
      </div>

      {loading && (
        <AiLoadingStepper steps={['Analyzing company profile...', 'Reviewing distress signals...', 'Calculating score...']} />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && score !== null && score > 0 && (
        <AiOutputWrapper
          modelName={result?.model_used || 'gpt-4o'}
          latencyMs={result?.latency_ms || 0}
          timestamp={initialUpdatedAt ? new Date(initialUpdatedAt).toLocaleString() : undefined}
        >
          <div className="space-y-3">
            <p className={`text-4xl font-bold ${scoreColor(score)}`}>{score}</p>
            {reasoning && <p className="text-sm text-gray-700">{reasoning}</p>}
            {confidence && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                {confidence} Confidence
              </span>
            )}
            {result?.confidence_reason && (
              <p className="text-xs text-gray-500">{result.confidence_reason}</p>
            )}
            {result?.prediction && (
              <div className="mt-2 p-3 rounded bg-amber-50 border border-amber-100">
                <p className="text-[11px] font-semibold uppercase text-amber-700 mb-1">Prediction</p>
                <p className="text-sm text-amber-900">{result.prediction}</p>
              </div>
            )}
            {result?.recommendation && (
              <div className="mt-2 p-3 rounded bg-blue-50 border border-blue-100">
                <p className="text-[11px] font-semibold uppercase text-blue-700 mb-1">Recommendation</p>
                <p className="text-sm text-blue-900">{result.recommendation}</p>
              </div>
            )}
          </div>
        </AiOutputWrapper>
      )}

      {!loading && !error && (!score || score === 0) && !result && (
        <p className="text-sm text-gray-400">
          No bleed score yet. Click &quot;Generate Bleed Score&quot; to run AI analysis.
        </p>
      )}
    </div>
  )
}
