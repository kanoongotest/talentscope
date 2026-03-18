/**
 * PURPOSE: Seed the companies table with 562 WordPress ecosystem companies from CSV
 * INPUTS: data/companies-seed.csv
 * OUTPUTS: 562 rows inserted into the companies table in Supabase
 * RELATIONSHIPS: Populates data for the Radar module
 *
 * Usage: npx tsx scripts/seed-companies.ts
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function parseCsv(raw: string): Record<string, string>[] {
  const lines = raw.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).map((line) => {
    const values = line.match(/(".*?"|[^,]+|(?<=,)(?=,))/g) || []
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = (values[i] || '').trim().replace(/^"|"$/g, '')
    })
    return row
  })
}

function mapRow(row: Record<string, string>) {
  return {
    name: row['Company Name'] || row['name'],
    website: row['Website'] || row['website'] || null,
    tier: parseInt(row['Tier'] || row['tier'], 10),
    category: row['Category'] || row['category'],
    region: row['Region'] || row['region'],
    specialization: row['Specialization'] || row['specialization'] || null,
    wp_verify: (row['WP_Verify'] || row['wp_verify'] || '').toLowerCase() === 'yes',
    verify_reason: row['Verify_Reason'] || row['verify_reason'] || null,
  }
}

async function seed() {
  const csvPath = resolve(__dirname, '..', 'data', 'companies-seed.csv')
  let raw: string
  try {
    raw = readFileSync(csvPath, 'utf-8')
  } catch {
    console.error(`CSV file not found at ${csvPath}`)
    console.error('Place companies-seed.csv in the data/ directory first.')
    process.exit(1)
  }

  const rows = parseCsv(raw).map(mapRow)
  console.log(`Parsed ${rows.length} companies from CSV`)

  const BATCH_SIZE = 50
  const totalBatches = Math.ceil(rows.length / BATCH_SIZE)

  let inserted = 0
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1

    const { error } = await supabase.from('companies').insert(batch)
    if (error) {
      console.error(`Error inserting batch ${batchNum}/${totalBatches}:`, error.message)
      process.exit(1)
    }

    inserted += batch.length
    console.log(`Inserted batch ${batchNum}/${totalBatches} (${inserted} total)`)
  }

  console.log(`\nDone! Inserted ${inserted} companies.`)
}

seed()
