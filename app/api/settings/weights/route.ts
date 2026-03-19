/**
 * PURPOSE: GET/PUT endpoints for scoring weight configuration
 * INPUTS: PUT body with weight values
 * OUTPUTS: Current or updated weights as JSON
 * RELATIONSHIPS: Uses weights-queries, consumed by settings page and scoring API
 */

import { NextResponse } from 'next/server'
import { fetchScoringWeights, updateScoringWeights } from '@/lib/queries/weights-queries'
import type { ScoringWeights } from '@/lib/queries/weights-queries'

export async function GET() {
  try {
    const weights = await fetchScoringWeights()
    return NextResponse.json(weights)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch weights'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json() as ScoringWeights
    const sum = Object.values(body).reduce((a, b) => a + b, 0)

    if (Math.abs(sum - 1.0) > 0.01) {
      return NextResponse.json({ error: `Weights must sum to 1.0 (got ${sum.toFixed(4)})` }, { status: 400 })
    }

    const required = ['technical', 'wordpress', 'ai', 'culture', 'professional', 'remote']
    for (const key of required) {
      if (typeof (body as unknown as Record<string, unknown>)[key] !== 'number') {
        return NextResponse.json({ error: `Missing or invalid weight: ${key}` }, { status: 400 })
      }
    }

    const updated = await updateScoringWeights(body)
    return NextResponse.json(updated)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update weights'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
