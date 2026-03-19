/**
 * PURPOSE: Supabase query functions for companies table
 * OUTPUTS: Typed company data, paginated lists, aggregate stats, filter options
 * RELATIONSHIPS: Used by app/radar/page.tsx, app/radar/[id]/page.tsx, radar-kpi-cards.tsx
 */

import { supabase } from '@/lib/supabase-client'

export interface CompanyFilters {
  search?: string
  tier?: string
  category?: string
  region?: string
  wpVerified?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export interface CompanyRow {
  id: string
  name: string
  website: string | null
  tier: number | null
  category: string | null
  region: string | null
  bleed_score: number | null
  wp_verify: boolean | null
  signal_count: number
}

export async function fetchCompaniesWithFilters(
  filters: CompanyFilters,
  page: number = 1,
  pageSize: number = 25
) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('companies')
    .select('id, name, website, tier, category, region, bleed_score, wp_verify, signals(count)', {
      count: 'exact',
    })

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }
  if (filters.tier) {
    query = query.eq('tier', parseInt(filters.tier))
  }
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.region) {
    query = query.eq('region', filters.region)
  }
  if (filters.wpVerified === 'true') {
    query = query.eq('wp_verify', true)
  } else if (filters.wpVerified === 'false') {
    query = query.eq('wp_verify', false)
  }

  const sortCol = filters.sortBy || 'name'
  const sortAsc = (filters.sortDir || 'asc') === 'asc'
  query = query.order(sortCol, { ascending: sortAsc })
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) throw error

  const companies: CompanyRow[] = (data || []).map((c: Record<string, unknown>) => ({
    ...c,
    signal_count: Array.isArray(c.signals) && c.signals[0]
      ? (c.signals[0] as { count: number }).count
      : 0,
  })) as CompanyRow[]

  return { companies, total: count || 0 }
}

export async function fetchCompanyById(id: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function fetchCompanyStats() {
  const { count: total } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  const { data: tierData } = await supabase
    .from('companies')
    .select('tier')

  const tierCounts = { 1: 0, 2: 0, 3: 0 }
  tierData?.forEach((c: { tier: number }) => {
    if (c.tier in tierCounts) tierCounts[c.tier as 1 | 2 | 3]++
  })

  return { total: total || 0, tierCounts }
}

export async function updateCompanyBleedScore(
  id: string,
  data: {
    bleed_score: number
    bleed_score_reasoning: string
    bleed_score_confidence: string
    bleed_score_updated_at: string
  }
) {
  const { error } = await supabase
    .from('companies')
    .update(data)
    .eq('id', id)

  if (error) throw error
}

export async function updateCompanyField(
  id: string,
  field: string,
  value: string | number | null
) {
  const { error } = await supabase
    .from('companies')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function fetchFilterOptions() {
  const [catRes, regRes] = await Promise.all([
    supabase.from('companies').select('category').not('category', 'is', null),
    supabase.from('companies').select('region').not('region', 'is', null),
  ])

  const categories = [...new Set((catRes.data || []).map((c: { category: string }) => c.category))].sort()
  const regions = [...new Set((regRes.data || []).map((c: { region: string }) => c.region))].sort()

  return { categories, regions }
}
