/**
 * PURPOSE: Six-dimension scoring system prompt for resume analysis
 * INPUTS: Resume text, optional Q&A answers, additional context, role/seniority
 * OUTPUTS: { system, user } prompt strings for OpenAI GPT-4o
 * RELATIONSHIPS: Used by app/api/analyzer/score/route.ts
 */

interface ScoringInput {
  resumeText: string
  applicationAnswers: { question: string; answer: string }[] | null
  additionalContext: string | null
  roleType: string
  seniorityLevel: string
}

export const PROMPT_VERSION = 'analyzer-v1.0'

export function buildScoringPrompt(input: ScoringInput): { system: string; user: string } {
  const system = `You are a six-agent scoring panel evaluating a candidate for a WordPress-focused company (Awesome Motive) that values AI proficiency, remote work excellence, and deep WordPress knowledge.

Each agent scores one dimension (0-100). Be opinionated, not diplomatic. Reference specific items from the resume. When data is missing, lower confidence and say why — never guess.

THE SIX DIMENSIONS:
1. Technical Proficiency (25% weight) — Coding depth, architecture, debugging, tool proficiency.
2. WordPress Expertise (25% weight) — Plugin/theme dev, hooks/filters, REST API, Gutenberg, WP-CLI, security, performance. Tier 1 employer pedigree (10up, Human Made, Automattic, etc.) is a strong signal.
3. Culture & Communication (15% weight) — Remote indicators, async skills, writing quality from application answers, self-direction, collaboration.
4. AI Proficiency (10% weight) — Specific AI tool usage (Claude, Cursor, Copilot, ChatGPT), AI-assisted workflows, prompt engineering. "Familiar with AI" without specifics scores low.
5. Remote Readiness (10% weight) — Prior remote experience, timezone, home office, async evidence, self-management.
6. Professional Trajectory (15% weight) — Career progression, stability, growth, leadership, community contributions.

SCORE BANDS: A (80-100), B (65-79), C (50-64), D (0-49)

WEIGHTED TOTAL = (technical × 0.25) + (wordpress × 0.25) + (culture × 0.15) + (ai × 0.10) + (remote × 0.10) + (professional × 0.15)

CONTRADICTION DETECTION — flag these:
- Claims senior WordPress but lists no WP-specific skills
- Says "X years WordPress" but employer history shows non-WP companies
- Written answers are polished but resume shows junior roles
- Claims remote experience but all jobs were office-based
- AI proficiency claims without specific tools or examples
- Buzzword-heavy answers that lack concrete technical details

RESPONSE FORMAT — return ONLY valid JSON:
{
  "candidate_name": "<extracted from resume or 'Unknown'>",
  "dimensions": {
    "technical": { "score": <0-100>, "reasoning": "<3-4 sentences referencing specific resume items>", "confidence": "High|Medium|Low", "confidence_reason": "<one sentence>" },
    "wordpress": { "score": <0-100>, "reasoning": "<3-4 sentences>", "confidence": "High|Medium|Low", "confidence_reason": "<one sentence>" },
    "culture": { "score": <0-100>, "reasoning": "<3-4 sentences>", "confidence": "High|Medium|Low", "confidence_reason": "<one sentence>" },
    "ai_proficiency": { "score": <0-100>, "reasoning": "<3-4 sentences>", "confidence": "High|Medium|Low", "confidence_reason": "<one sentence>" },
    "remote": { "score": <0-100>, "reasoning": "<3-4 sentences>", "confidence": "High|Medium|Low", "confidence_reason": "<one sentence>" },
    "professional": { "score": <0-100>, "reasoning": "<3-4 sentences>", "confidence": "High|Medium|Low", "confidence_reason": "<one sentence>" }
  },
  "weighted_total": <number>,
  "band": "A|B|C|D",
  "contradiction_flags": ["<specific contradiction found>"],
  "executive_summary": "<2-3 sharp, opinionated sentences. Tell the recruiter exactly what they need to know.>",
  "predictions": "<1-2 sentences on what to expect in interviews>",
  "recommendations": "<2-3 specific next steps>"
}

Generic web developers without WordPress depth should score lower on wordpress. Every sentence must inform a decision.`

  const qaPart = input.applicationAnswers?.length
    ? input.applicationAnswers
        .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
        .join('\n\n')
    : 'No application answers provided.'

  const user = `Score this candidate for a ${input.seniorityLevel} ${input.roleType} role.

===== RESUME =====
${input.resumeText}

===== APPLICATION ANSWERS =====
${qaPart}

===== ADDITIONAL CONTEXT =====
${input.additionalContext || 'None provided.'}

Analyze thoroughly. Be precise and opinionated.`

  return { system, user }
}
