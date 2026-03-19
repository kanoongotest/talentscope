/**
 * PURPOSE: Supabase query functions for signals table
 * OUTPUTS: Signal lists, creation, aggregate counts
 * RELATIONSHIPS: Used by company-signal-timeline.tsx, signal-add-form.tsx, radar-kpi-cards.tsx
 */

import { supabase } from '@/lib/supabase-client'

export interface Signal {
  id: string
  company_id: string
  signal_type: string
  severity: 'critical' | 'elevated' | 'signal'
  title: string
  description: string | null
  source_url: string | null
  signal_date: string | null
  ai_analysis: string | null
  ai_prediction: string | null
  created_at: string
}

export interface CreateSignalInput {
  company_id: string
  signal_type: string
  severity: 'critical' | 'elevated' | 'signal'
  title: string
  description?: string
  source_url?: string
  signal_date?: string
}

export async function fetchSignalsByCompanyId(companyId: string): Promise<Signal[]> {
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .eq('company_id', companyId)
    .order('signal_date', { ascending: false })

  if (error) throw error
  return (data || []) as Signal[]
}

export async function createSignal(input: CreateSignalInput): Promise<Signal> {
  const { data, error } = await supabase
    .from('signals')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data as Signal
}

export async function fetchSignalStats() {
  const { data, error } = await supabase
    .from('signals')
    .select('severity, company_id')

  if (error) throw error

  const signals = data || []
  const companiesWithSignals = new Set(signals.map((s: { company_id: string }) => s.company_id)).size
  const criticalCount = signals.filter((s: { severity: string }) => s.severity === 'critical').length

  return { companiesWithSignals, criticalCount, totalSignals: signals.length }
}
