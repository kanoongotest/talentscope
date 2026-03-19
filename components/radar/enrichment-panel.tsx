/**
 * PURPOSE: AI enrichment suggestions panel with accept/reject per field
 * INPUTS: companyId, current company field values
 * OUTPUTS: Side-by-side current vs suggested values with accept buttons
 * RELATIONSHIPS: Used by app/radar/[id]/page.tsx, calls /api/radar/enrich
 */

'use client'

import { useState } from 'react'
import { AiOutputWrapper } from './ai-output-wrapper'
import { AiLoadingStepper } from './ai-loading-stepper'

interface Props {
  companyId: string
  currentValues: Record<string, string | number | null>
}

interface Suggestion {
  field: string
  label: string
  current: string | number | null
  suggested: string | number | null
  accepted: boolean
}

const FIELD_LABELS: Record<string, string> = {
  headcount_estimate: 'Headcount Estimate',
  funding_status: 'Funding Status',
  key_people: 'Key People',
  tech_stack: 'Tech Stack',
  revenue_tier: 'Revenue Tier',
  enrichment_notes: 'Enrichment Notes',
}

export function EnrichmentPanel({ companyId, currentValues }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelInfo, setModelInfo] = useState({ model: '', latency: 0 })
  const [confidence, setConfidence] = useState<{ level: string; reason: string } | null>(null)

  async function enrich() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/radar/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id: companyId }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Request failed')
      const data = await res.json()
      setModelInfo({ model: data.model_used, latency: data.latency_ms })
      setConfidence({ level: data.confidence, reason: data.confidence_reason })

      const items: Suggestion[] = Object.entries(data.suggestions || {})
        .filter(([key]) => key in FIELD_LABELS)
        .map(([key, val]) => ({
          field: key,
          label: FIELD_LABELS[key],
          current: currentValues[key] ?? null,
          suggested: val as string | number | null,
          accepted: false,
        }))
      setSuggestions(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function acceptField(index: number) {
    const s = suggestions[index]
    try {
      const { updateCompanyField } = await import('@/lib/queries/company-queries')
      await updateCompanyField(companyId, s.field, s.suggested)
      setSuggestions((prev) =>
        prev.map((item, i) => (i === index ? { ...item, accepted: true } : item))
      )
    } catch {
      setError(`Failed to update ${s.label}`)
    }
  }

  async function acceptAll() {
    for (let i = 0; i < suggestions.length; i++) {
      if (!suggestions[i].accepted && suggestions[i].suggested !== null) {
        await acceptField(i)
      }
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          AI Enrichment
        </h2>
        {suggestions.length === 0 ? (
          <button onClick={enrich} disabled={loading}
            className="rounded bg-[#185CE3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1248B3] disabled:opacity-50">
            Enrich with AI
          </button>
        ) : (
          <button onClick={acceptAll}
            className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
            Accept All
          </button>
        )}
      </div>

      {loading && <AiLoadingStepper steps={['Researching company data...', 'Cross-referencing sources...', 'Generating suggestions...']} />}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {suggestions.length > 0 && (
        <AiOutputWrapper modelName={modelInfo.model} latencyMs={modelInfo.latency}>
          <div className="space-y-2">
            {confidence && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 mb-2">
                {confidence.level} Confidence — {confidence.reason}
              </span>
            )}
            {suggestions.map((s, i) => (
              <div key={s.field} className={`flex items-center gap-3 p-3 rounded border ${s.accepted ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold uppercase text-gray-500">{s.label}</p>
                  <p className="text-xs text-gray-400 truncate">Current: {String(s.current ?? '—')}</p>
                  <p className="text-sm text-gray-900 truncate">Suggested: {String(s.suggested ?? '—')}</p>
                </div>
                {!s.accepted && s.suggested !== null ? (
                  <button onClick={() => acceptField(i)}
                    className="shrink-0 rounded border border-green-300 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50">
                    Accept
                  </button>
                ) : s.accepted ? (
                  <span className="shrink-0 text-xs text-green-600 font-medium">Accepted</span>
                ) : null}
              </div>
            ))}
          </div>
        </AiOutputWrapper>
      )}
    </div>
  )
}
