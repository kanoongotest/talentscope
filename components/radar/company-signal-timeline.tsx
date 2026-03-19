/**
 * PURPOSE: Displays signal timeline for a company with add-signal toggle
 * INPUTS: companyId string
 * OUTPUTS: Card with signal list sorted by date, add signal button
 * RELATIONSHIPS: Used by app/radar/[id]/page.tsx, uses signal-queries, signal-add-form
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { SignalAddForm } from './signal-add-form'
import type { Signal } from '@/lib/queries/signal-queries'

const SEVERITY_CONFIG = {
  critical: { color: 'bg-red-50 text-red-700', icon: AlertTriangle },
  elevated: { color: 'bg-amber-50 text-amber-700', icon: AlertCircle },
  signal: { color: 'bg-blue-50 text-blue-700', icon: Info },
} as const

export function CompanySignalTimeline({ companyId }: { companyId: string }) {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const loadSignals = useCallback(async () => {
    const { fetchSignalsByCompanyId } = await import('@/lib/queries/signal-queries')
    const data = await fetchSignalsByCompanyId(companyId)
    setSignals(data)
    setLoading(false)
  }, [companyId])

  useEffect(() => {
    loadSignals()
  }, [loadSignals])

  const handleSignalAdded = () => {
    setShowForm(false)
    loadSignals()
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Distress Signals
          </h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
            {signals.length}
          </span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-[#185CE3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1248B3] transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Signal'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <SignalAddForm companyId={companyId} onSuccess={handleSignalAdded} />
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading signals...</p>
      ) : signals.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">
          No signals recorded for this company.
        </p>
      ) : (
        <div className="space-y-3">
          {signals.map((signal) => {
            const config = SEVERITY_CONFIG[signal.severity] || SEVERITY_CONFIG.signal
            const Icon = config.icon
            return (
              <div key={signal.id} className="flex gap-3 p-3 rounded border border-gray-100">
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded shrink-0 ${config.color}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${config.color}`}>
                      {signal.severity}
                    </span>
                    <span className="text-xs text-gray-400">
                      {signal.signal_date ? new Date(signal.signal_date).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">{signal.title}</p>
                  {signal.description && (
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{signal.description}</p>
                  )}
                  {signal.source_url && (
                    <a
                      href={signal.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#185CE3] hover:underline mt-1 inline-block"
                    >
                      Source →
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
