/**
 * PURPOSE: OpenAI API client singleton
 * OUTPUTS: Configured OpenAI client for use in API routes (server-side only)
 * RELATIONSHIPS: Used by all AI-powered features (Analyzer, Radar, Question Engine, Challenge Lab)
 * NOTE: Never import this in client components — server-side only
 */

import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Model constants with reasoning comments
export const AI_MODEL_PRIMARY = 'gpt-4o' // Heavy lifting: scoring, analysis, strategy briefs
export const AI_MODEL_LIGHTWEIGHT = 'gpt-4o-mini' // Fast tasks: suggestions, summaries, enrichment
