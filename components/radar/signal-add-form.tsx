/**
 * PURPOSE: Form to add a new signal for a company
 * INPUTS: companyId, onSuccess callback
 * OUTPUTS: Interactive form that POSTs to /api/signals
 * RELATIONSHIPS: Used by company-signal-timeline.tsx
 */

'use client'

import { useState } from 'react'

interface Props {
  companyId: string
  onSuccess: () => void
}

export function SignalAddForm({ companyId, onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const body = {
      company_id: companyId,
      signal_type: form.get('signal_type'),
      severity: form.get('severity'),
      title: form.get('title'),
      description: form.get('description') || null,
      source_url: form.get('source_url') || null,
      signal_date: form.get('signal_date') || new Date().toISOString().split('T')[0],
    }

    try {
      const res = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create signal')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#185CE3]/30 focus:border-[#185CE3]'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Signal Type *</label>
          <input name="signal_type" required className={inputClass} placeholder="e.g., Layoff, Funding, Leadership" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Severity *</label>
          <select name="severity" required className={inputClass}>
            <option value="signal">Signal</option>
            <option value="elevated">Elevated</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
        <input name="title" required className={inputClass} placeholder="Brief signal headline" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <textarea name="description" rows={2} className={inputClass} placeholder="Details about the signal..." />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Source URL</label>
          <input name="source_url" type="url" className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Signal Date</label>
          <input
            name="signal_date"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-[#185CE3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1248B3] transition-colors disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add Signal'}
      </button>
    </form>
  )
}
