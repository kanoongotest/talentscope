/**
 * PURPOSE: Root layout with Inter font, global styles, and app shell
 * INPUTS: children (page content)
 * OUTPUTS: HTML document with sidebar navigation and top bar
 * RELATIONSHIPS: Wraps all routes, uses components/layout/app-shell.tsx
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/layout/app-shell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TalentScope — Talent Intelligence',
  description: 'Talent intelligence for the AI era',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
