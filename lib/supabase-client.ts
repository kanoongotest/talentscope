/**
 * PURPOSE: Supabase browser client singleton
 * OUTPUTS: Typed Supabase client for use in components and API routes
 * RELATIONSHIPS: Used by all modules that read/write data
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
