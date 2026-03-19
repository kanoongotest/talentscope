/**
 * PURPOSE: GET endpoint returning pre-loaded sample candidate profiles
 * OUTPUTS: Array of 3 sample profiles for Analyzer demo
 * RELATIONSHIPS: Uses lib/data/sample-profiles.ts
 */

import { NextResponse } from 'next/server'
import { SAMPLE_PROFILES } from '@/lib/data/sample-profiles'

export async function GET() {
  return NextResponse.json(SAMPLE_PROFILES)
}
