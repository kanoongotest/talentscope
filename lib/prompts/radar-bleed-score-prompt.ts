/**
 * PURPOSE: System + user prompt for AI bleed score generation
 * INPUTS: Company record and array of signals
 * OUTPUTS: { system, user } prompt strings for OpenAI chat completion
 * RELATIONSHIPS: Used by app/api/radar/bleed-score/route.ts
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
  revenue_tier: string | null
  tech_stack: string | null
}

export function buildBleedScorePrompt(
  company: Company,
  signals: Signal[]
): { system: string; user: string } {
  const system = `You are a talent intelligence analyst specializing in employee attrition risk assessment.

Your task: Calculate a "bleed score" (0–100) for a company. This score measures how likely the company is to lose talent.
- 0 = extremely stable, growing, employees are happy
- 50 = moderate churn risk, some warning signs
- 100 = actively hemorrhaging talent, mass exodus underway

SCORING FRAMEWORK:
- Base on company profile (tier, category, funding, glassdoor)
- Weight distress signals heavily — layoffs, leadership departures, negative press
- Recent signals (last 90 days) carry 2x weight vs older signals
- No signals + stable profile = score 10-25
- No signals + weak profile (no funding data, low glassdoor) = score 25-40

RESPONSE FORMAT — return ONLY valid JSON:
{
  "bleed_score": <number 0-100>,
  "reasoning": "<3-4 concise sentences referencing specific data points>",
  "confidence": "High" | "Medium" | "Low",
  "confidence_reason": "<one sentence explaining confidence level>",
  "prediction": "<what to expect in 30-90 days, or null if insufficient data>",
  "recommendation": "<specific actionable next step for the recruiting team>"
}

Be sharp and precise. No filler. Reference actual data from the input.`

  const signalSummary =
    signals.length > 0
      ? signals
          .map(
            (s) =>
              `[${s.severity.toUpperCase()}] ${s.title} (${s.signal_date || 'no date'}) — ${s.description || 'No details'}`
          )
          .join('\n')
      : 'No distress signals recorded.'

  const user = `Analyze this company and generate a bleed score:

COMPANY: ${company.name}
TIER: ${company.tier || 'Unknown'}
CATEGORY: ${company.category || 'Unknown'}
REGION: ${company.region || 'Unknown'}
SPECIALIZATION: ${company.specialization || 'None listed'}
HEADCOUNT: ${company.headcount_estimate || 'Unknown'}
FUNDING: ${company.funding_status || 'Unknown'}
GLASSDOOR: ${company.glassdoor_score || 'Unknown'}
REVENUE TIER: ${company.revenue_tier || 'Unknown'}
TECH STACK: ${company.tech_stack || 'Unknown'}

DISTRESS SIGNALS (${signals.length} total):
${signalSummary}`

  return { system, user }
}
