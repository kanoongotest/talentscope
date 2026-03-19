/**
 * PURPOSE: Client-side PDF text extraction using pdf.js
 * INPUTS: File object (PDF)
 * OUTPUTS: Extracted text string from all pages
 * RELATIONSHIPS: Used by components/analyzer/resume-upload-form.tsx
 */

export async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pageTexts: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pageTexts.push(text)
  }

  return pageTexts.join('\n\n').trim()
}
