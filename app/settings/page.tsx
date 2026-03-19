/**
 * PURPOSE: Settings page with configurable scoring weights
 * INPUTS: None (fetches weights from API)
 * OUTPUTS: Form to view/edit scoring dimension weights
 * RELATIONSHIPS: Uses /api/settings/weights
 */

'use client'

import { useEffect, useState } from 'react'
import { Check, AlertTriangle } from 'lucide-react'

const DIMENSIONS = [
  { key: 'technical', name: 'Technical Proficiency', desc: 'Coding depth, architecture, tools, debugging' },
  { key: 'wordpress', name: 'WordPress Expertise', desc: 'Plugins, themes, REST API, Gutenberg, employer pedigree' },
  { key: 'ai', name: 'AI Proficiency', desc: 'Claude, Cursor, Copilot, prompt engineering, AI workflows' },
  { key: 'culture', name: 'Culture & Communication', desc: 'Writing quality, async skills, collaboration, self-direction' },
  { key: 'professional', name: 'Professional Trajectory', desc: 'Career growth, stability, leadership, community' },
  { key: 'remote', name: 'Remote Readiness', desc: 'Remote experience, timezone, async evidence' },
]

export default function SettingsPage() {
  const [weights, setWeights] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/settings/weights')
      .then((r) => r.json())
      .then((data) => { setWeights(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  const totalPct = Math.round(total * 100)
  const isValid = Math.abs(total - 1.0) < 0.01

  function setWeight(key: string, pct: number) {
    setWeights((prev) => ({ ...prev, [key]: pct / 100 }))
    setMessage(null)
  }

  async function handleSave() {
    if (!isValid) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/settings/weights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weights),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setMessage({ type: 'success', text: 'Weights saved. New analyses will use these weights.' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-400 text-sm">Loading settings...</div>

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Scoring Weights</h2>
        <p className="text-sm text-gray-500 mb-5">
          Adjust how much each dimension contributes to the overall candidate score. Weights must total 100%.
        </p>

        <div className="space-y-4">
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{dim.name}</p>
                <p className="text-xs text-gray-400">{dim.desc}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round((weights[dim.key] || 0) * 100)}
                  onChange={(e) => setWeight(dim.key, parseInt(e.target.value) || 0)}
                  className="w-16 rounded border border-gray-300 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#185CE3]/30"
                />
                <span className="text-sm text-gray-400">%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {isValid ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <AlertTriangle size={16} className="text-red-500" />
            )}
            <span className={`text-sm font-medium ${isValid ? 'text-green-700' : 'text-red-600'}`}>
              Total: {totalPct}%
            </span>
          </div>
          <button
            onClick={handleSave}
            disabled={!isValid || saving}
            className="rounded bg-[#185CE3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1248B3] disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save Weights'}
          </button>
        </div>

        {message && (
          <p className={`mt-3 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-3">
          Changes only affect future analyses. Past scores are not recalculated.
        </p>
      </div>
    </div>
  )
}
