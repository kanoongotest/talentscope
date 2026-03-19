/**
 * PURPOSE: POST endpoint to create a new signal for a company
 * INPUTS: JSON body with company_id, signal_type, severity, title, description, source_url, signal_date
 * OUTPUTS: Created signal as JSON, or 400 error with validation message
 * RELATIONSHIPS: Called by signal-add-form.tsx, writes to signals table
 */

import { NextResponse } from 'next/server'
import { createSignal } from '@/lib/queries/signal-queries'

export async function POST(request: Request) {
  const body = await request.json()
  const { company_id, signal_type, severity, title, description, source_url, signal_date } = body

  if (!company_id || !signal_type || !severity || !title) {
    return NextResponse.json(
      { error: 'Missing required fields: company_id, signal_type, severity, title' },
      { status: 400 }
    )
  }

  const validSeverities = ['critical', 'elevated', 'signal']
  if (!validSeverities.includes(severity)) {
    return NextResponse.json(
      { error: 'severity must be one of: critical, elevated, signal' },
      { status: 400 }
    )
  }

  try {
    const signal = await createSignal({
      company_id,
      signal_type,
      severity,
      title,
      description: description || null,
      source_url: source_url || null,
      signal_date: signal_date || new Date().toISOString().split('T')[0],
    })

    return NextResponse.json(signal, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
