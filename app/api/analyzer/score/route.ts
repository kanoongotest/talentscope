/**
 * PURPOSE: POST endpoint to run six-dimension AI resume analysis with configurable weights
 * INPUTS: JSON body with resume_text, application_answers, additional_context, role_type, seniority_level
 * OUTPUTS: Created analysis record with full AI scoring results
 * RELATIONSHIPS: Uses analyzer-scoring-prompt, openai-client, analysis-queries, weights-queries
 */

import { NextResponse } from 'next/server'
import { openai, AI_MODEL_PRIMARY } from '@/lib/openai-client'
import { buildScoringPrompt, PROMPT_VERSION } from '@/lib/prompts/analyzer-scoring-prompt'
import { createAnalysis } from '@/lib/queries/analysis-queries'
import { fetchScoringWeights } from '@/lib/queries/weights-queries'

export async function POST(request: Request) {
  const body = await request.json()
  const { resume_text, application_answers, additional_context, role_type, seniority_level } = body

  if (!resume_text || !resume_text.trim()) {
    return NextResponse.json({ error: 'resume_text is required' }, { status: 400 })
  }

  const weights = await fetchScoringWeights()

  const { system, user } = buildScoringPrompt({
    resumeText: resume_text,
    applicationAnswers: application_answers || null,
    additionalContext: additional_context || null,
    roleType: role_type || 'WordPress Developer',
    seniorityLevel: seniority_level || 'Mid-Level',
    weights,
  })

  const startTime = Date.now()

  try {
    const completion = await openai.chat.completions.create({
      model: AI_MODEL_PRIMARY,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const latencyMs = Date.now() - startTime
    const raw = completion.choices[0]?.message?.content || '{}'
    const tokensUsed = completion.usage?.total_tokens || null

    let result
    try {
      result = JSON.parse(raw)
    } catch {
      console.error('Failed to parse analyzer AI response:', raw)
      return NextResponse.json({ error: 'AI returned invalid JSON', raw_response: raw }, { status: 502 })
    }

    const d = result.dimensions || {}
    const confidenceLevels = Object.fromEntries(
      Object.entries(d).map(([k, v]) => [k, {
        confidence: (v as Record<string, string>).confidence,
        reason: (v as Record<string, string>).confidence_reason,
      }])
    )

    // Recalculate weighted total server-side with actual weights
    const serverTotal =
      (d.technical?.score ?? 0) * weights.technical +
      (d.wordpress?.score ?? 0) * weights.wordpress +
      (d.ai_proficiency?.score ?? 0) * weights.ai +
      (d.culture?.score ?? 0) * weights.culture +
      (d.professional?.score ?? 0) * weights.professional +
      (d.remote?.score ?? 0) * weights.remote
    const band = serverTotal >= 80 ? 'A' : serverTotal >= 65 ? 'B' : serverTotal >= 50 ? 'C' : 'D'

    const analysis = await createAnalysis({
      candidate_name: result.candidate_name || 'Unknown',
      resume_text,
      application_answers: application_answers || null,
      role_type: role_type || 'WordPress Developer',
      seniority_level: seniority_level || 'Mid-Level',
      score_technical: d.technical?.score ?? 0,
      score_wordpress: d.wordpress?.score ?? 0,
      score_culture: d.culture?.score ?? 0,
      score_ai: d.ai_proficiency?.score ?? 0,
      score_remote: d.remote?.score ?? 0,
      score_professional: d.professional?.score ?? 0,
      score_total: serverTotal,
      score_band: band,
      agent_results: {
        ...d,
        strengths: result.strengths || [],
        concerns: result.concerns || [],
        verdict_short: result.verdict_short || '',
        weights_used: weights,
      },
      contradiction_flags: result.contradiction_flags || [],
      confidence_levels: confidenceLevels,
      executive_summary: result.executive_summary || '',
      predictions: result.predictions || '',
      ai_recommendations: result.recommendations || '',
      ai_model_used: AI_MODEL_PRIMARY,
      prompt_version: PROMPT_VERSION,
      tokens_used: tokensUsed,
      latency_ms: latencyMs,
      is_sample: false,
    })

    return NextResponse.json({
      id: analysis.id, ...result,
      weighted_total: serverTotal, band,
      latency_ms: latencyMs, model_used: AI_MODEL_PRIMARY,
    }, { status: 201 })
  } catch (err) {
    console.error('Analyzer scoring API error:', err)
    const message = err instanceof Error ? err.message : 'AI request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
