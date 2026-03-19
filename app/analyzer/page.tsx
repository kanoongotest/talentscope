/**
 * PURPOSE: Analyzer home page — upload form, sample profiles, analysis history
 * INPUTS: None
 * OUTPUTS: Interactive page with form, sample buttons, and history list
 * RELATIONSHIPS: Uses resume-upload-form, sample-profiles-loader, analysis-history-list
 */

'use client'

import { useState } from 'react'
import { ResumeUploadForm } from '@/components/analyzer/resume-upload-form'
import { SampleProfilesLoader } from '@/components/analyzer/sample-profiles-loader'
import { AnalysisHistoryList } from '@/components/analyzer/analysis-history-list'
import type { FormData } from '@/components/analyzer/resume-upload-form'

export default function AnalyzerPage() {
  const [sampleData, setSampleData] = useState<FormData | null>(null)

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analyzer</h1>
        <p className="text-sm text-gray-500 mt-1">
          Evaluate candidates with AI-powered six-dimension scoring
        </p>
      </div>

      <ResumeUploadForm externalData={sampleData} />
      <SampleProfilesLoader onSelect={setSampleData} />
      <AnalysisHistoryList />
    </div>
  )
}
