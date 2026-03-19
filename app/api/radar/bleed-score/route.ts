/**
 * PURPOSE: POST endpoint to generate AI bleed score for a company
 * INPUTS: JSON body { company_id: string }
 * OUTPUTS: AI-generated bleed score with reasoning, updates company record
 * RELATIONSHIPS: Uses radar-bleed-score-prompt, openai-client, company-queries, signal-queries
 */

import { NextResponse } from 'next/server'
import { openai, AI_MODEL_PRIMARY } from '@/lib/openai-client'
import { fetchCompanyById } from '@/lib/queries/company-queries'
import { updateCompanyBleedScore } from '@/lib/queries/company-queries'
import { fetchSignalsByCompanyId } from '@/lib/queries/signal-queries'
import { buildBleedScorePrompt } from '@/lib/prompts/radar-bleed-score-prompt'

export async function POST(request: Request) {
  const body = await request.json()
  const { company_id } = body

  if (!company_id) {
    return NextResponse.json({ error: 'company_id is required' }, { status: 400 })
  }

  let company
  try {
    company = await fetchCompanyById(company_id)
  } catch {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  const signals = await fetchSignalsByCompanyId(company_id)
  const { system, user } = buildBleedScorePrompt(company, signals)

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

    let result
    try {
      result = JSON.parse(raw)
    } catch {
      console.error('Failed to parse bleed score AI response:', raw)
      return NextResponse.json(
        { error: 'AI returned invalid JSON', raw_response: raw },
        { status: 502 }
      )
    }

    await updateCompanyBleedScore(company_id, {
      bleed_score: result.bleed_score,
      bleed_score_reasoning: result.reasoning,
      bleed_score_confidence: result.confidence,
      bleed_score_updated_at: new Date().toISOString(),
    })

    return NextResponse.json({
      ...result,
      model_used: AI_MODEL_PRIMARY,
      latency_ms: latencyMs,
    })
  } catch (err) {
    console.error('Bleed score API error:', err)
    const message = err instanceof Error ? err.message : 'AI request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
