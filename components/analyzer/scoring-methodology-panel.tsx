/**
 * PURPOSE: Slide-out overlay panel explaining scoring methodology
 * INPUTS: isOpen boolean, onClose callback
 * OUTPUTS: Right-side panel with dimension descriptions, weights, and band definitions
 * RELATIONSHIPS: Used by score-summary-header.tsx and app/analyzer/page.tsx
 */

'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const DIMS = [
  { name: 'AI Proficiency', weight: 25, color: 'text-[#185CE3]', desc: 'Claude, Cursor, Copilot, prompt engineering, AI-assisted workflows' },
  { name: 'Technical Proficiency', weight: 25, color: 'text-[#185CE3]', desc: 'Coding depth, architecture, debugging, tools, testing' },
  { name: 'WordPress Expertise', weight: 25, color: 'text-[#185CE3]', desc: 'Plugin/theme dev, REST API, Gutenberg, WP-CLI, employer pedigree' },
  { name: 'Culture & Communication', weight: 10, color: 'text-gray-600', desc: 'Writing quality, async skills, collaboration, self-direction' },
  { name: 'Professional Trajectory', weight: 10, color: 'text-gray-600', desc: 'Career growth, stability, leadership, community contributions' },
  { name: 'Remote Readiness', weight: 5, color: 'text-gray-600', desc: 'Remote experience, timezone compatibility, async evidence' },
]

const BANDS = [
  { band: 'A', range: '80-100', label: 'Fast-track to interview', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
  { band: 'B', range: '65-79', label: 'Standard interview process', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  { band: 'C', range: '50-64', label: 'Needs targeted follow-up', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
  { band: 'D', range: '0-49', label: 'Below bar', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
]

export function ScoringMethodologyPanel({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-xl overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">How we score candidates</h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">v2.0</span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Every candidate is evaluated by a six-dimension AI scoring panel. Each dimension has a specialist agent
            that analyzes different aspects of the candidate&apos;s profile. The weighted total determines the overall band.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {DIMS.map((d) => (
              <div key={d.name} className="rounded-lg border border-gray-200 p-3">
                <p className={`text-xl font-bold ${d.color}`}>{d.weight}%</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{d.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs text-blue-800 leading-relaxed">
              AI Proficiency is weighted equally with Technical and WordPress — our team builds with Claude and
              Cursor daily, and we consider AI-native development a core skill.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Score Bands</h3>
            <div className="space-y-2">
              {BANDS.map((b) => (
                <div key={b.band} className={`flex items-center gap-3 rounded-lg border ${b.border} ${b.bg} px-4 py-2.5`}>
                  <span className={`text-lg font-bold ${b.text}`}>{b.band}</span>
                  <div>
                    <span className={`text-xs font-semibold ${b.text}`}>{b.range}</span>
                    <p className={`text-xs ${b.text} opacity-80`}>{b.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
