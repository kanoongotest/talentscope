/**
 * PURPOSE: Three sample profile buttons that pre-fill the upload form
 * INPUTS: onSelect callback to push sample data into the form
 * OUTPUTS: Row of 3 colored buttons for Strong, Average, and Red Flag candidates
 * RELATIONSHIPS: Used by app/analyzer/page.tsx, reads from lib/data/sample-profiles
 */

'use client'

import { SAMPLE_PROFILES } from '@/lib/data/sample-profiles'
import type { FormData } from './resume-upload-form'

interface Props {
  onSelect: (data: FormData) => void
}

const ACCENT_STYLES = {
  green: 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100',
  amber: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100',
  red: 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100',
} as const

export function SampleProfilesLoader({ onSelect }: Props) {
  function handleSelect(index: number) {
    const p = SAMPLE_PROFILES[index]
    onSelect({
      resumeText: p.resumeText,
      answers: p.applicationAnswers,
      additionalContext: p.additionalContext,
      roleType: p.roleType,
      seniorityLevel: p.seniorityLevel,
    })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
        Try with sample data
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {SAMPLE_PROFILES.map((p, i) => (
          <button
            key={p.label}
            onClick={() => handleSelect(i)}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${ACCENT_STYLES[p.accent]}`}
          >
            <span className="block font-semibold">{p.label}</span>
            <span className="block text-xs opacity-70 mt-0.5">{p.candidateName}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
