/**
 * PURPOSE: Master layout for analysis results with methodology panel overlay
 * INPUTS: Full AnalysisRecord
 * OUTPUTS: Verdict, score, highlights, radar, dimensions, predictions, actions
 * RELATIONSHIPS: Used by app/analyzer/[id]/page.tsx
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AnalysisRecord } from '@/lib/queries/analysis-queries'
import { VerdictBanner } from './verdict-banner'
import { ScoreSummaryHeader } from './score-summary-header'
import { AnalysisConfidenceIndicator } from './analysis-confidence-indicator'
import { KeyHighlights } from './key-highlights'
import { ScoreRadarChart } from './score-radar-chart'
import { ExtractedLinks } from './extracted-links'
import { DimensionScoreCard } from './dimension-score-card'
import { ContradictionAlerts } from './contradiction-alerts'
import { PredictionAndRecommendations } from './prediction-and-recommendations'
import { CopyToSlackButton } from './copy-to-slack-button'
import { ScoringMethodologyPanel } from './scoring-methodology-panel'

interface Props {
  analysis: AnalysisRecord
}

const DIMENSION_META = [
  { key: 'technical', name: 'Technical Proficiency', weight: '25%' },
  { key: 'wordpress', name: 'WordPress Expertise', weight: '25%' },
  { key: 'ai_proficiency', name: 'AI Proficiency', weight: '25%' },
  { key: 'culture', name: 'Culture & Communication', weight: '10%' },
  { key: 'professional', name: 'Professional Trajectory', weight: '10%' },
  { key: 'remote', name: 'Remote Readiness', weight: '5%' },
] as const

const EXPECTATIONS: Record<string, Record<string, number>> = {
  'Mid-Level':  { technical: 60, wordpress: 60, ai_proficiency: 50, culture: 55, professional: 50, remote: 50 },
  'Senior':     { technical: 75, wordpress: 75, ai_proficiency: 65, culture: 65, professional: 65, remote: 55 },
  'Lead':       { technical: 80, wordpress: 80, ai_proficiency: 75, culture: 75, professional: 75, remote: 60 },
  'Manager':    { technical: 70, wordpress: 70, ai_proficiency: 65, culture: 80, professional: 80, remote: 60 },
}

export function AnalysisResultsView({ analysis }: Props) {
  const [expandedDims, setExpandedDims] = useState<Set<string>>(new Set())
  const [allExpanded, setAllExpanded] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)

  const agents = (analysis.agent_results || {}) as Record<string, {
    score: number; reasoning: string; confidence: string; confidence_reason: string
  }>
  const ar = analysis.agent_results as Record<string, unknown>
  const strengths = (ar?.strengths as string[]) || null
  const concerns = (ar?.concerns as string[]) || null
  const verdictShort = (ar?.verdict_short as string) || null

  const hasAnswers = !!(analysis.application_answers && analysis.application_answers.length > 0)
  const expected = EXPECTATIONS[analysis.seniority_level] || EXPECTATIONS['Mid-Level']

  function toggleDim(key: string) {
    setExpandedDims((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }

  function toggleAll() {
    if (allExpanded) { setExpandedDims(new Set()) } else { setExpandedDims(new Set(DIMENSION_META.map((d) => d.key))) }
    setAllExpanded(!allExpanded)
  }

  const radarScores = {
    technical: agents.technical?.score ?? 0,
    wordpress: agents.wordpress?.score ?? 0,
    ai: agents.ai_proficiency?.score ?? 0,
    culture: agents.culture?.score ?? 0,
    professional: agents.professional?.score ?? 0,
    remote: agents.remote?.score ?? 0,
  }

  const analysisUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/analyzer" className="inline-flex items-center gap-1 text-sm text-[#185CE3] hover:underline">
        ← Back to Analyzer
      </Link>

      <VerdictBanner band={analysis.score_band} verdictShort={verdictShort} />

      <ScoreSummaryHeader
        candidateName={analysis.candidate_name} scoreTotal={analysis.score_total}
        scoreBand={analysis.score_band} executiveSummary={analysis.executive_summary}
        roleType={analysis.role_type} seniorityLevel={analysis.seniority_level}
        createdAt={analysis.created_at} modelUsed={analysis.ai_model_used}
        latencyMs={analysis.latency_ms} promptVersion={analysis.prompt_version}
        onOpenMethodology={() => setShowMethodology(true)}
      />

      <AnalysisConfidenceIndicator hasAnswers={hasAnswers} hasContext={!!analysis.resume_text} />

      <KeyHighlights strengths={strengths} concerns={concerns} executiveSummary={analysis.executive_summary} />

      <div className="grid grid-cols-2 gap-4">
        <ScoreRadarChart scores={radarScores} seniorityLevel={analysis.seniority_level} band={analysis.score_band} />
        <ExtractedLinks resumeText={analysis.resume_text} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Dimension Scores</h2>
          <button onClick={toggleAll} className="text-xs text-[#185CE3] hover:underline">
            {allExpanded ? 'Collapse All' : 'Show Full Analysis'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {DIMENSION_META.map((dim) => {
            const agent = agents[dim.key]
            if (!agent) return null
            return (
              <DimensionScoreCard
                key={dim.key} name={dim.name} weight={dim.weight}
                score={agent.score} expected={expected[dim.key] || 50}
                reasoning={agent.reasoning} confidence={agent.confidence}
                confidenceReason={agent.confidence_reason}
                expanded={expandedDims.has(dim.key)} onToggle={() => toggleDim(dim.key)}
              />
            )
          })}
        </div>
      </div>

      <ContradictionAlerts flags={analysis.contradiction_flags} />
      <PredictionAndRecommendations predictions={analysis.predictions} recommendations={analysis.ai_recommendations} />

      <div className="flex items-center gap-3">
        <Link href="/analyzer" className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Analyze Another
        </Link>
        <Link href="/questions" className="rounded bg-[#185CE3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1248B3]">
          Generate Follow-Up Questions →
        </Link>
        <CopyToSlackButton
          candidateName={analysis.candidate_name} scoreTotal={analysis.score_total}
          scoreBand={analysis.score_band} strengths={strengths}
          concerns={concerns} verdictShort={verdictShort} analysisUrl={analysisUrl}
        />
      </div>

      <ScoringMethodologyPanel isOpen={showMethodology} onClose={() => setShowMethodology(false)} />
    </div>
  )
}
