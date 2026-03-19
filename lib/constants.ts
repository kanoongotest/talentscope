/**
 * PURPOSE: Design tokens, module definitions, and app-wide constants
 * OUTPUTS: Typed constants consumed by layout, navigation, and dashboard components
 * RELATIONSHIPS: Imported by sidebar-navigation, top-bar, placeholder pages
 */

export const MODULES = [
  { name: 'Dashboard', href: '/', icon: 'LayoutDashboard', section: 'intelligence' },
  { name: 'Radar', href: '/radar', icon: 'Radio', section: 'intelligence', badge: '562' },
  { name: 'Analyzer', href: '/analyzer', icon: 'FileSearch', section: 'intelligence' },
  { name: 'Question Engine', href: '/questions', icon: 'MessageSquare', section: 'workflow' },
  { name: 'Pipeline', href: '/pipeline', icon: 'Users', section: 'workflow' },
  { name: 'Challenge Lab', href: '/challenges', icon: 'Code', section: 'workflow' },
] as const

export const MODULE_DESCRIPTIONS: Record<string, { description: string; phase: number }> = {
  '/radar': { description: 'Company intelligence and distress signal monitoring across 562 WordPress companies.', phase: 2 },
  '/analyzer': { description: 'AI-powered resume analysis with scoring, strengths, and gap detection.', phase: 3 },
  '/questions': { description: 'Generate tailored follow-up questions based on resume analysis results.', phase: 4 },
  '/pipeline': { description: 'Track passive candidates through your recruiting pipeline stages.', phase: 5 },
  '/challenges': { description: 'Generate and evaluate technical coding challenges for candidates.', phase: 6 },
}

export const BOTTOM_NAV = [
  { name: 'Settings', icon: 'Settings', comingSoon: false, href: '/settings' },
  { name: 'Help', icon: 'HelpCircle', comingSoon: true },
] as const

export const APP_VERSION = '0.1.0'
export const APP_NAME = 'TalentScope'
export const APP_TAGLINE = 'Talent Intelligence'
