/**
 * PURPOSE: Copy a formatted candidate summary to clipboard for Slack sharing
 * INPUTS: Candidate name, score, band, strengths, concerns, verdict
 * OUTPUTS: Button that copies formatted text and shows "Copied!" toast
 * RELATIONSHIPS: Used by analysis-results-view.tsx
 */

'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface Props {
  candidateName: string
  scoreTotal: number
  scoreBand: string
  strengths: string[] | null
  concerns: string[] | null
  verdictShort: string | null
  analysisUrl: string
}

const BAND_LABELS: Record<string, string> = {
  A: 'Exceptional', B: 'Strong', C: 'Potential', D: 'Below bar',
}

export function CopyToSlackButton({
  candidateName, scoreTotal, scoreBand, strengths, concerns, verdictShort, analysisUrl,
}: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const strengthsLine = strengths?.length
      ? strengths.join(', ')
      : 'None highlighted'
    const concernsLine = concerns?.length
      ? concerns.join(', ')
      : 'None flagged'
    const verdict = verdictShort || `Band ${scoreBand} candidate`

    const text = [
      `\u{1F4CA} Candidate: ${candidateName} | Score: ${Math.round(scoreTotal)} (Band ${scoreBand} \u2014 ${BAND_LABELS[scoreBand] || 'Unknown'})`,
      `\u2705 Strengths: ${strengthsLine}`,
      `\u26A0\uFE0F Concerns: ${concernsLine}`,
      `\u{1F3AF} Verdict: ${verdict}`,
      `\u{1F517} Full analysis: ${analysisUrl}`,
    ].join('\n')

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {copied ? (
        <>
          <Check size={14} className="text-green-600" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          Copy to Slack
        </>
      )}
    </button>
  )
}
