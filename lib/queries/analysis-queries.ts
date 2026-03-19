/**
 * PURPOSE: CRUD operations for the resume_analyses table
 * OUTPUTS: Analysis records — create, fetch by ID, list history, count
 * RELATIONSHIPS: Used by app/api/analyzer/score/route.ts, app/analyzer/[id]/page.tsx, history list
 */

import { supabase } from '@/lib/supabase-client'

export interface AnalysisRecord {
  id: string
  candidate_name: string
  resume_text: string
  application_answers: { question: string; answer: string }[] | null
  role_type: string
  seniority_level: string
  score_technical: number
  score_wordpress: number
  score_culture: number
  score_ai: number
  score_remote: number
  score_professional: number
  score_total: number
  score_band: string
  agent_results: Record<string, unknown>
  contradiction_flags: string[]
  confidence_levels: Record<string, unknown>
  executive_summary: string
  predictions: string
  ai_recommendations: string
  ai_model_used: string
  prompt_version: string
  tokens_used: number | null
  latency_ms: number
  is_sample: boolean
  created_at: string
}

export interface CreateAnalysisInput {
  candidate_name: string
  resume_text: string
  application_answers?: { question: string; answer: string }[] | null
  role_type: string
  seniority_level: string
  score_technical: number
  score_wordpress: number
  score_culture: number
  score_ai: number
  score_remote: number
  score_professional: number
  score_total: number
  score_band: string
  agent_results: Record<string, unknown>
  contradiction_flags: string[]
  confidence_levels: Record<string, unknown>
  executive_summary: string
  predictions: string
  ai_recommendations: string
  ai_model_used: string
  prompt_version: string
  tokens_used: number | null
  latency_ms: number
  is_sample: boolean
}

export async function createAnalysis(input: CreateAnalysisInput): Promise<AnalysisRecord> {
  const { data, error } = await supabase
    .from('resume_analyses')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data as AnalysisRecord
}

export async function fetchAnalysisById(id: string): Promise<AnalysisRecord> {
  const { data, error } = await supabase
    .from('resume_analyses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as AnalysisRecord
}

export async function fetchAnalysisHistory(): Promise<AnalysisRecord[]> {
  const { data, error } = await supabase
    .from('resume_analyses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return (data || []) as AnalysisRecord[]
}

export async function fetchAnalysisCount(): Promise<number> {
  const { count, error } = await supabase
    .from('resume_analyses')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count || 0
}
