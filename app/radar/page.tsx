/**
 * PURPOSE: Radar main page — company list with KPI cards, filters, and paginated table
 * INPUTS: URL search params for filters, pagination, and sorting
 * OUTPUTS: Full radar view with live data from Supabase
 * RELATIONSHIPS: Uses radar-kpi-cards, company-list-filters, company-list-table, company-queries
 */

import { Suspense } from 'react'
import { RadarKpiCards } from '@/components/radar/radar-kpi-cards'
import { CompanyListFilters } from '@/components/radar/company-list-filters'
import { CompanyListTable } from '@/components/radar/company-list-table'
import { fetchCompaniesWithFilters, fetchFilterOptions } from '@/lib/queries/company-queries'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function RadarPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const pageSize = 25

  const filters = {
    search: params.search,
    tier: params.tier,
    category: params.category,
    region: params.region,
    wpVerified: params.wpVerified,
    sortBy: params.sortBy,
    sortDir: (params.sortDir as 'asc' | 'desc') || 'asc',
  }

  const [{ companies, total }, filterOptions] = await Promise.all([
    fetchCompaniesWithFilters(filters, page, pageSize),
    fetchFilterOptions(),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Radar</h1>

      <Suspense fallback={<div className="h-24 animate-pulse bg-gray-100 rounded-lg" />}>
        <RadarKpiCards />
      </Suspense>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <Suspense fallback={null}>
          <CompanyListFilters
            categories={filterOptions.categories}
            regions={filterOptions.regions}
          />
        </Suspense>
      </div>

      <CompanyListTable
        companies={companies}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  )
}
