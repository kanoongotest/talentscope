/**
 * PURPOSE: Resume input with PDF drag-and-drop extraction + paste fallback
 * INPUTS: Current resume text, onChange callback, input CSS class
 * OUTPUTS: Drop zone for PDF upload, textarea for paste, extracted text populates field
 * RELATIONSHIPS: Used by resume-upload-form.tsx, uses lib/utils/extract-pdf-text
 */

'use client'

import { useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'

interface Props {
  resumeText: string
  onChange: (v: string) => void
  inputClass: string
}

export function ResumeInputSection({ resumeText, onChange, inputClass }: Props) {
  const [pdfName, setPdfName] = useState<string | null>(null)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  async function handlePdf(file: File) {
    if (file.type !== 'application/pdf') {
      setPdfError('Please upload a PDF file.')
      return
    }
    setPdfError(null)
    setExtracting(true)
    try {
      const { extractPdfText } = await import('@/lib/utils/extract-pdf-text')
      const text = await extractPdfText(file)
      if (!text.trim()) {
        setPdfError("This PDF doesn't contain readable text. Try pasting the resume text instead.")
        return
      }
      onChange(text)
      setPdfName(file.name)
    } catch {
      setPdfError("Couldn't read this PDF. Try pasting the resume text instead.")
    } finally {
      setExtracting(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handlePdf(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handlePdf(file)
  }

  function clearPdf() {
    setPdfName(null)
    onChange('')
  }

  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2 block">
        The Resume *
      </label>

      {pdfName ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 mb-2 text-sm">
          <FileText size={18} className="text-green-600 shrink-0" />
          <span className="text-green-800 font-medium truncate flex-1">{pdfName}</span>
          <button type="button" onClick={clearPdf} className="text-gray-400 hover:text-red-500">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-4 mb-2 text-center text-sm cursor-pointer transition-colors block ${
            dragOver
              ? 'border-[#185CE3] bg-blue-50 text-[#185CE3]'
              : 'border-gray-200 text-gray-400 hover:border-gray-300'
          }`}
        >
          <input type="file" accept=".pdf" onChange={handleFileInput} className="hidden" />
          {extracting ? (
            <span className="text-[#185CE3]">Extracting text from PDF...</span>
          ) : (
            <>
              <Upload size={20} className="mx-auto mb-1 text-gray-300" />
              Drag and drop a PDF here, or click to browse
            </>
          )}
        </label>
      )}

      {pdfError && <p className="text-sm text-red-600 mb-2">{pdfError}</p>}

      <textarea
        value={resumeText}
        onChange={(e) => { onChange(e.target.value); setPdfName(null) }}
        rows={8}
        className={inputClass}
        placeholder="Or paste the candidate's resume text here..."
      />
    </div>
  )
}
