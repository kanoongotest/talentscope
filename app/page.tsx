/**
 * PURPOSE: TalentScope landing/dashboard page
 * OUTPUTS: Welcome screen with module navigation cards
 * RELATIONSHIPS: Entry point for the application
 */

export default function HomePage() {
  const modules = [
    { name: 'Radar', description: 'Company intelligence & distress monitoring', href: '/radar', status: 'coming-soon' },
    { name: 'Analyzer', description: 'AI-powered resume scoring', href: '/analyzer', status: 'coming-soon' },
    { name: 'Question Engine', description: 'Follow-up question generation', href: '/questions', status: 'coming-soon' },
    { name: 'Pipeline', description: 'Passive candidate tracking', href: '/pipeline', status: 'coming-soon' },
    { name: 'Challenge Lab', description: 'Code evaluation & generation', href: '/challenges', status: 'coming-soon' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TalentScope</h1>
        <p className="text-gray-500 mb-8">Talent intelligence for the AI era</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => (
            <div key={mod.name} className="bg-white border border-gray-200 rounded p-6">
              <h2 className="text-lg font-semibold text-gray-900">{mod.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{mod.description}</p>
              <span className="inline-block mt-3 text-xs text-gray-400 uppercase tracking-wide">Coming Soon</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
