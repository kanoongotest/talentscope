/**
 * PURPOSE: Search bar and filter dropdowns for the Radar company list
 * INPUTS: Current search params, available filter options (categories, regions)
 * OUTPUTS: Interactive filter bar that updates URL search params
 * RELATIONSHIPS: Used by app/radar/page.tsx, reads/writes URL search params
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface FilterProps {
  categories: string[]
  regions: string[]
}

export function CompanyListFilters({ categories, regions }: FilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/radar?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearFilters = () => router.push('/radar')

  const hasFilters = searchParams.toString().length > 0

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search companies..."
        defaultValue={searchParams.get('search') || ''}
        onChange={(e) => updateParam('search', e.target.value)}
        className="rounded border border-gray-300 px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#185CE3]/30 focus:border-[#185CE3]"
      />

      <FilterSelect
        label="Tier"
        value={searchParams.get('tier') || ''}
        options={['1', '2', '3']}
        displayFn={(v) => `Tier ${v}`}
        onChange={(v) => updateParam('tier', v)}
      />

      <FilterSelect
        label="Category"
        value={searchParams.get('category') || ''}
        options={categories}
        onChange={(v) => updateParam('category', v)}
      />

      <FilterSelect
        label="Region"
        value={searchParams.get('region') || ''}
        options={regions}
        onChange={(v) => updateParam('region', v)}
      />

      <FilterSelect
        label="WP Verified"
        value={searchParams.get('wpVerified') || ''}
        options={['true', 'false']}
        displayFn={(v) => (v === 'true' ? 'Verified' : 'Not Verified')}
        onChange={(v) => updateParam('wpVerified', v)}
      />

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-800 underline"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  displayFn,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  displayFn?: (v: string) => string
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#185CE3]/30"
    >
      <option value="">All {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {displayFn ? displayFn(opt) : opt}
        </option>
      ))}
    </select>
  )
}
