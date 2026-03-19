/**
 * PURPOSE: Extract and categorize URLs found in resume text
 * INPUTS: Raw text string
 * OUTPUTS: Array of { url, type, label } objects
 * RELATIONSHIPS: Used by components/analyzer/extracted-links.tsx
 */

export interface ExtractedUrl {
  url: string
  type: 'github' | 'linkedin' | 'wordpress' | 'portfolio' | 'other'
  label: string
}

export function extractUrlsFromText(text: string): ExtractedUrl[] {
  const urlRegex = /https?:\/\/[^\s),>"']+/gi
  const matches = text.match(urlRegex)
  if (!matches) return []

  const unique = [...new Set(matches)]

  return unique.map((url) => {
    const cleaned = url.replace(/[.)]+$/, '')

    if (cleaned.includes('github.com')) {
      return { url: cleaned, type: 'github', label: 'GitHub' }
    }
    if (cleaned.includes('linkedin.com')) {
      return { url: cleaned, type: 'linkedin', label: 'LinkedIn' }
    }
    if (cleaned.includes('profiles.wordpress.org') || cleaned.includes('wordpress.org/plugins/')) {
      return { url: cleaned, type: 'wordpress', label: 'WordPress.org' }
    }
    return { url: cleaned, type: 'other', label: 'Link' }
  })
}
