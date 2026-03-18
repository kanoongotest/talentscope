/**
 * PURPOSE: Placeholder page for Analyzer module
 * OUTPUTS: Empty state with module description and phase indicator
 * RELATIONSHIPS: Linked from sidebar navigation
 */

import { FileSearch } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { MODULE_DESCRIPTIONS } from '@/lib/constants'

export default function AnalyzerPage() {
  const mod = MODULE_DESCRIPTIONS['/analyzer']
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <EmptyState
        icon={<FileSearch size={48} />}
        title="Analyzer"
        description={mod.description}
        ctaLabel={`Coming in Phase ${mod.phase}`}
      />
    </div>
  )
}
