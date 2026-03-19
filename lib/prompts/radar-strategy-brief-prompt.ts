/**
 * PURPOSE: System + user prompt for AI hiring strategy brief generation
 * INPUTS: Company record and array of signals
 * OUTPUTS: { system, user } prompt strings for OpenAI chat completion
 * RELATIONSHIPS: Used by app/api/radar/strategy-brief/route.ts
 */

import type { Signal } from '@/lib/queries/signal-queries'

interface Company {
  name: string
  tier: number | null
  category: string | null
  region: string | null
  specialization: string | null
  headcount_estimate: number | null
  funding_status: string | null
  glassdoor_score: number | null
  tech_stack: string | null
  bleed_score: number | null
  bleed_score_reasoning: string | null
}

export function buildStrategyBriefPrompt(
  company: Company,
  signals: Signal[]
): { system: string; user: string } {
  const system = `You are a senior recruiting strategist preparing a 60-second verbal briefing.

Write a hiring strategy brief that a recruiter would read before reaching out to candidates from this company. Cover:
1. Company health assessment (1-2 sentences)
2. Talent availability prediction (who's likely open to offers)
3. Approach strategy (how to position outreach)
4. Timing recommendation (act now / wait / monitor)
5. Risk factors (what could go wrong)

STYLE: Direct, recruiter-friendly language. No jargon. 150-250 words max.

RESPONSE FORMAT — return ONLY valid JSON:
{
  "brief": "<the full strategy brief text>",
  "headline": "<one-line summary, e.g. 'High-value target — senior engineers likely frustrated after third layoff round'>",
  "urgency": "high" | "medium" | "low",
  "best_roles_to_target": ["<role1>", "<role2>", "<role3>"],
  "model_used": "gpt-4o"
}

Be sharp. Every sentence should inform a decision.`

  const signalSummary =
    signals.length > 0
      ? signals
          .slice(0, 10)
          .map(
            (s) =>
              `[${s.severity.toUpperCase()}] ${s.title} (${s.signal_date || 'no date'})`
          )
          .join('\n')
      : 'No distress signals recorded.'

  const user = `Generate a hiring strategy brief for:

COMPANY: ${company.name}
TIER: ${company.tier || 'Unknown'} | CATEGORY: ${company.category || 'Unknown'} | REGION: ${company.region || 'Unknown'}
SPECIALIZATION: ${company.specialization || 'None'}
HEADCOUNT: ${company.headcount_estimate || 'Unknown'}
FUNDING: ${company.funding_status || 'Unknown'}
GLASSDOOR: ${company.glassdoor_score || 'Unknown'}
TECH STACK: ${company.tech_stack || 'Unknown'}
BLEED SCORE: ${company.bleed_score || 'Not scored'}
BLEED REASONING: ${company.bleed_score_reasoning || 'N/A'}

RECENT SIGNALS (${signals.length} total):
${signalSummary}`

  return { system, user }
}
