/**
 * PURPOSE: System + user prompt for AI company enrichment suggestions
 * INPUTS: Company record with existing data
 * OUTPUTS: { system, user } prompt strings for OpenAI chat completion
 * RELATIONSHIPS: Used by app/api/radar/enrich/route.ts
 */

interface Company {
  name: string
  website: string | null
  category: string | null
  region: string | null
  specialization: string | null
  headcount_estimate: number | null
  funding_status: string | null
  key_people: string | null
  tech_stack: string | null
  revenue_tier: string | null
  enrichment_notes: string | null
}

export function buildEnrichmentPrompt(
  company: Company
): { system: string; user: string } {
  const system = `You are a company research analyst. Your task: suggest enrichment data for a WordPress ecosystem company.

RULES:
- Be honest about uncertainty. If you don't know, say "Unknown — requires manual research"
- Base estimates on company category, region, and any known data
- For headcount: estimate from typical company sizes in the WordPress ecosystem
- For key people: only suggest names you are confident about from well-known companies
- For tech stack: infer from company category (agencies use different stacks than hosting companies)

RESPONSE FORMAT — return ONLY valid JSON:
{
  "suggestions": {
    "headcount_estimate": <number or null>,
    "funding_status": "<string or null>",
    "key_people": "<string or null>",
    "tech_stack": "<string or null>",
    "revenue_tier": "<string or null>",
    "enrichment_notes": "<2-3 sentence summary>"
  },
  "confidence": "High" | "Medium" | "Low",
  "confidence_reason": "<one sentence>",
  "sources_checked": ["<list of source types checked>"]
}

Be concise. No filler. Flag uncertainty explicitly.`

  const existingData = [
    company.headcount_estimate && `Headcount: ${company.headcount_estimate}`,
    company.funding_status && `Funding: ${company.funding_status}`,
    company.key_people && `Key People: ${company.key_people}`,
    company.tech_stack && `Tech Stack: ${company.tech_stack}`,
    company.revenue_tier && `Revenue Tier: ${company.revenue_tier}`,
    company.enrichment_notes && `Notes: ${company.enrichment_notes}`,
  ]
    .filter(Boolean)
    .join('\n')

  const user = `Research and suggest enrichment data for this company:

COMPANY: ${company.name}
WEBSITE: ${company.website || 'Unknown'}
CATEGORY: ${company.category || 'Unknown'}
REGION: ${company.region || 'Unknown'}
SPECIALIZATION: ${company.specialization || 'None'}

EXISTING DATA:
${existingData || 'No enrichment data yet.'}

Suggest values for any missing fields. Keep existing data if it looks accurate.`

  return { system, user }
}
