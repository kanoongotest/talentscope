/**
 * PURPOSE: Table display for filtered/paginated company list with sortable headers
 * INPUTS: Companies array, total count, current page, current sort params
 * OUTPUTS: Sortable table with pagination controls
 * RELATIONSHIPS: Used by app/radar/page.tsx, renders company-row-card.tsx rows
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CompanyRowCard } from './company-row-card'
import type { CompanyRow } from '@/lib/queries/company-queries'

interface Props {
  companies: CompanyRow[]
  total: number
  page: number
  pageSize: number
}

const TABLE_COLS: { key: string; label: string; sortable: boolean }[] = [
  { key: 'name', label: 'Company Name', sortable: true },
  { key: 'website', label: 'Website', sortable: false },
  { key: 'tier', label: 'Tier', sortable: true },
  { key: 'category', label: 'Category', sortable: false },
  { key: 'region', label: 'Region', sortable: false },
  { key: 'bleed_score', label: 'Bleed Score', sortable: true },
  { key: 'signals', label: 'Signals', sortable: false },
]

export function CompanyListTable({ companies, total, page, pageSize }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sortBy') || 'name'
  const currentDir = searchParams.get('sortDir') || 'asc'

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const totalPages = Math.ceil(total / pageSize)

  function toggleSort(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (currentSort === key) {
      params.set('sortDir', currentDir === 'asc' ? 'desc' : 'asc')
    } else {
      params.set('sortBy', key)
      params.set('sortDir', 'asc')
    }
    router.push(`/radar?${params.toString()}`)
  }

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`/radar?${params.toString()}`)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {TABLE_COLS.map((col) => {
              const isSortable = col.sortable !== false
              const isActive = currentSort === col.key
              return (
                <th
                  key={col.key}
                  onClick={isSortable ? () => toggleSort(col.key) : undefined}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    isSortable ? 'cursor-pointer hover:text-gray-700 select-none' : ''
                  }`}
                >
                  {col.label}
                  {isActive && (
                    <span className="ml-1">{currentDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-gray-50 cursor-pointer">
              <CompanyRowCard company={company} />
            </tr>
          ))}
          {companies.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                No companies match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm">
        <span className="text-gray-600">
          Showing {total > 0 ? from : 0}–{to} of {total} companies
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            Previous
          </button>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
