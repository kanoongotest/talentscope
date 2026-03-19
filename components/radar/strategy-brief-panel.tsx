/**
 * PURPOSE: AI hiring strategy brief display with generation trigger
 * INPUTS: companyId
 * OUTPUTS: Strategy brief with headline, urgency badge, roles, and full text
 * RELATIONSHIPS: Used by app/radar/[id]/page.tsx, calls /api/radar/strategy-brief
 */

'use client'

import { useState } from 'react'
import { AiOutputWrapper } from './ai-output-wrapper'
import { AiLoadingStepper } from './ai-loading-stepper'

interface BriefResult {
  brief: string
  headline: string
  urgency: 'high' | 'medium' | 'low'
  best_roles_to_target: string[]
  model_used: string
  latency_ms: number
}

const URGENCY_STYLES = {
  high: 'bg-red-50 text-red-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-green-50 text-green-700',
} as const

export function StrategyBriefPanel({ companyId }: { companyId: string }) {
  const [result, setResult] = useState<BriefResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/radar/strategy-brief', {
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
          Strategy Brief
        </h2>
        <button
          onClick={generate}
          disabled={loading}
          className="rounded bg-[#185CE3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1248B3] disabled:opacity-50"
        >
          {result ? 'Regenerate' : 'Generate Strategy Brief'}
        </button>
      </div>

      {loading && (
        <AiLoadingStepper
          steps={['Assessing company health...', 'Analyzing talent signals...', 'Preparing intelligence brief...']}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && result && (
        <AiOutputWrapper modelName={result.model_used} latencyMs={result.latency_ms}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${URGENCY_STYLES[result.urgency]}`}>
                {result.urgency} urgency
              </span>
            </div>

            <p className="text-base font-semibold text-gray-900">{result.headline}</p>

            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {result.brief}
            </p>

            {result.best_roles_to_target?.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Best Roles to Target
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.best_roles_to_target.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AiOutputWrapper>
      )}

      {!loading && !error && !result && (
        <p className="text-sm text-gray-400">
          Generate a 60-second hiring strategy brief powered by AI analysis.
        </p>
      )}
    </div>
  )
}
