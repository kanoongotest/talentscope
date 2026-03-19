/**
 * PURPOSE: CRUD for scoring weights stored in app_config table
 * OUTPUTS: Weight configuration object, upsert function
 * RELATIONSHIPS: Used by app/api/settings/weights, app/api/analyzer/score
 */

import { supabase } from '@/lib/supabase-client'

export interface ScoringWeights {
  technical: number
  wordpress: number
  ai: number
  culture: number
  professional: number
  remote: number
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  technical: 0.25,
  wordpress: 0.25,
  ai: 0.25,
  culture: 0.10,
  professional: 0.10,
  remote: 0.05,
}

export async function fetchScoringWeights(): Promise<ScoringWeights> {
  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'scoring_weights')
    .single()

  if (error || !data) {
    // Seed defaults if not found
    await supabase.from('app_config').upsert({
      key: 'scoring_weights',
      value: DEFAULT_WEIGHTS,
      description: 'Dimension weights for resume scoring. Must sum to 1.0.',
    })
    return DEFAULT_WEIGHTS
  }

  return data.value as ScoringWeights
}

export async function updateScoringWeights(weights: ScoringWeights): Promise<ScoringWeights> {
  const { error } = await supabase
    .from('app_config')
    .upsert({
      key: 'scoring_weights',
      value: weights,
      description: 'Dimension weights for resume scoring. Must sum to 1.0.',
    })

  if (error) throw error
  return weights
}
