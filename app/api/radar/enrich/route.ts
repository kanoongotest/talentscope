/**
 * PURPOSE: POST endpoint to generate AI enrichment suggestions for a company
 * INPUTS: JSON body { company_id: string }
 * OUTPUTS: AI-generated field suggestions (not auto-saved — user reviews first)
 * RELATIONSHIPS: Uses radar-enrichment-prompt, openai-client, company-queries
 */

import { NextResponse } from 'next/server'
import { openai, AI_MODEL_LIGHTWEIGHT } from '@/lib/openai-client'
import { fetchCompanyById } from '@/lib/queries/company-queries'
import { buildEnrichmentPrompt } from '@/lib/prompts/radar-enrichment-prompt'

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

  const { system, user } = buildEnrichmentPrompt(company)
  const startTime = Date.now()

  try {
    const completion = await openai.chat.completions.create({
      model: AI_MODEL_LIGHTWEIGHT,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    })

    const latencyMs = Date.now() - startTime
    const raw = completion.choices[0]?.message?.content || '{}'

    let result
    try {
      result = JSON.parse(raw)
    } catch {
      console.error('Failed to parse enrichment AI response:', raw)
      return NextResponse.json(
        { error: 'AI returned invalid JSON', raw_response: raw },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ...result,
      model_used: AI_MODEL_LIGHTWEIGHT,
      latency_ms: latencyMs,
    })
  } catch (err) {
    console.error('Enrichment API error:', err)
    const message = err instanceof Error ? err.message : 'AI request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
