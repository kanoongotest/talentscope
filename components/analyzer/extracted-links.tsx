/**
 * PURPOSE: Display URLs found in resume text as categorized clickable links
 * INPUTS: Resume text string
 * OUTPUTS: Card with categorized links, hidden if none found
 * RELATIONSHIPS: Used by analysis-results-view.tsx, uses lib/utils/extract-urls-from-text
 */

import { Github, Linkedin, Globe, ExternalLink } from 'lucide-react'
import { extractUrlsFromText, type ExtractedUrl } from '@/lib/utils/extract-urls-from-text'

interface Props {
  resumeText: string
}

const TYPE_ICONS: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  wordpress: Globe,
  portfolio: Globe,
  other: ExternalLink,
}

export function ExtractedLinks({ resumeText }: Props) {
  const links = extractUrlsFromText(resumeText)
  if (links.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
        Links Found in Resume
      </h3>
      <div className="space-y-2">
        {links.map((link: ExtractedUrl) => {
          const Icon = TYPE_ICONS[link.type] || ExternalLink
          return (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#185CE3] hover:underline"
            >
              <Icon size={14} className="shrink-0" />
              <span className="truncate">{link.url}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
