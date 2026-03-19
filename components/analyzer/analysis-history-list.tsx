/**
 * PURPOSE: List of past resume analyses with scores, bands, and links to detail pages
 * INPUTS: None (fetches from Supabase client-side)
 * OUTPUTS: Table of past analyses, empty state if none
 * RELATIONSHIPS: Used by app/analyzer/page.tsx
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { AnalysisRecord } from '@/lib/queries/analysis-queries'

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

export function AnalysisHistoryList() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { fetchAnalysisHistory } = await import('@/lib/queries/analysis-queries')
      try {
        const data = await fetchAnalysisHistory()
        setAnalyses(data)
      } catch {
        // Silently handle — empty list
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Past Analyses
        </h3>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
          {analyses.length}
        </span>
      </div>

      {analyses.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">
          No analyses yet. Upload a resume or try a sample profile to get started.
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {analyses.map((a) => (
            <Link
              key={a.id}
              href={`/analyzer/${a.id}`}
              className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{a.candidate_name}</p>
                <p className="text-xs text-gray-400">
                  {a.role_type} · {a.seniority_level} · {new Date(a.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-lg font-bold ${scoreColor(a.score_total)}`}>
                  {Math.round(a.score_total)}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${BAND_STYLES[a.score_band] || BAND_STYLES.D}`}>
                  Band {a.score_band}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
