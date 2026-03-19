/**
 * PURPOSE: Full resume upload form with paste text, Q&A pairs, role selection
 * INPUTS: None (self-contained form state)
 * OUTPUTS: Submits to /api/analyzer/score, redirects to results page on success
 * RELATIONSHIPS: Used by app/analyzer/page.tsx
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronRight, Plus, X, Upload } from 'lucide-react'
import { AiLoadingStepper } from '@/components/radar/ai-loading-stepper'

export interface FormData {
  resumeText: string
  answers: { question: string; answer: string }[]
  additionalContext: string
  roleType: string
  seniorityLevel: string
}

interface Props {
  onFormDataChange?: (data: FormData) => void
  externalData?: FormData | null
}

const ROLES = ['WordPress Developer', 'Full Stack Developer', 'Frontend Developer', 'DevOps Engineer', 'Other']
const LEVELS = ['Mid-Level', 'Senior', 'Lead', 'Manager']

export function ResumeUploadForm({ externalData }: Props) {
  const router = useRouter()
  const [resumeText, setResumeText] = useState(externalData?.resumeText || '')
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>(
    externalData?.answers || [{ question: '', answer: '' }]
  )
  const [additionalContext, setAdditionalContext] = useState(externalData?.additionalContext || '')
  const [roleType, setRoleType] = useState(externalData?.roleType || 'WordPress Developer')
  const [seniorityLevel, setSeniorityLevel] = useState(externalData?.seniorityLevel || 'Mid-Level')
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync when externalData changes
  if (externalData && externalData.resumeText !== resumeText && !loading) {
    setResumeText(externalData.resumeText)
    setAnswers(externalData.answers.length ? externalData.answers : [{ question: '', answer: '' }])
    setAdditionalContext(externalData.additionalContext)
    setRoleType(externalData.roleType)
    setSeniorityLevel(externalData.seniorityLevel)
    if (externalData.answers.length) setExpanded(true)
  }

  function updateAnswer(i: number, field: 'question' | 'answer', val: string) {
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? { ...a, [field]: val } : a)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!resumeText.trim()) return
    setLoading(true)
    setError(null)

    const filteredAnswers = answers.filter((a) => a.question.trim() && a.answer.trim())

    try {
      const res = await fetch('/api/analyzer/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          application_answers: filteredAnswers.length ? filteredAnswers : null,
          additional_context: additionalContext || null,
          role_type: roleType,
          seniority_level: seniorityLevel,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Analysis failed')
      const data = await res.json()
      router.push(`/analyzer/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#185CE3]/30 focus:border-[#185CE3]'

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Candidate</h3>
        <p className="text-sm text-gray-500 mb-4">Six AI agents are evaluating the resume...</p>
        <AiLoadingStepper steps={[
          'Reading resume and extracting key signals...',
          'Scoring technical proficiency...',
          'Evaluating WordPress expertise and employer pedigree...',
          'Assessing communication and culture fit...',
          'Checking AI proficiency and remote readiness...',
          'Generating executive summary and recommendations...',
        ]} />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Evaluate a Candidate</h2>
        <p className="text-sm text-gray-500 mt-1">Paste or upload what you have. The more context, the smarter the analysis.</p>
      </div>

      <ResumeSection resumeText={resumeText} onChange={setResumeText} inputClass={inputClass} />

      <OptionalSection expanded={expanded} onToggle={() => setExpanded(!expanded)}
        answers={answers} onUpdateAnswer={updateAnswer}
        onAddAnswer={() => setAnswers((p) => [...p, { question: '', answer: '' }])}
        onRemoveAnswer={(i) => setAnswers((p) => p.filter((_, idx) => idx !== i))}
        additionalContext={additionalContext} onContextChange={setAdditionalContext}
        inputClass={inputClass} />

      <RoleSection roleType={roleType} onRoleChange={setRoleType}
        seniorityLevel={seniorityLevel} onLevelChange={setSeniorityLevel} inputClass={inputClass} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={!resumeText.trim()}
        className="w-full rounded bg-[#185CE3] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1248B3] disabled:opacity-40 transition-colors">
        Analyze Candidate →
      </button>
    </form>
  )
}

function ResumeSection({ resumeText, onChange, inputClass }: { resumeText: string; onChange: (v: string) => void; inputClass: string }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2 block">The Resume *</label>
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 mb-2 text-center text-sm text-gray-400">
        <Upload size={20} className="mx-auto mb-1 text-gray-300" />
        PDF upload coming soon — paste resume text below
      </div>
      <textarea value={resumeText} onChange={(e) => onChange(e.target.value)} rows={8}
        className={inputClass} placeholder="Paste the candidate's resume text here..." />
    </div>
  )
}

function OptionalSection({ expanded, onToggle, answers, onUpdateAnswer, onAddAnswer, onRemoveAnswer, additionalContext, onContextChange, inputClass }: {
  expanded: boolean; onToggle: () => void; answers: { question: string; answer: string }[];
  onUpdateAnswer: (i: number, f: 'question' | 'answer', v: string) => void;
  onAddAnswer: () => void; onRemoveAnswer: (i: number) => void;
  additionalContext: string; onContextChange: (v: string) => void; inputClass: string
}) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <button type="button" onClick={onToggle} className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
        <span>Tell us more (optional)</span>
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Did the candidate answer any questions?</p>
            <p className="text-xs text-gray-500 mb-3">Interview questions, application form responses, screening questionnaires.</p>
            {answers.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <div className="flex-1 space-y-1">
                  <input value={a.question} onChange={(e) => onUpdateAnswer(i, 'question', e.target.value)}
                    className={inputClass} placeholder="e.g., Why are you interested in this role?" />
                  <textarea value={a.answer} onChange={(e) => onUpdateAnswer(i, 'answer', e.target.value)}
                    rows={2} className={inputClass} placeholder="Candidate's response..." />
                </div>
                {answers.length > 1 && (
                  <button type="button" onClick={() => onRemoveAnswer(i)} className="self-start p-1 text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={onAddAnswer} className="inline-flex items-center gap-1 text-sm text-[#185CE3] hover:underline">
              <Plus size={14} /> Add another question
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Anything else we should know?</p>
            <p className="text-xs text-gray-500 mb-2">Context that helps the AI score better.</p>
            <textarea value={additionalContext} onChange={(e) => onContextChange(e.target.value)}
              rows={2} className={inputClass} placeholder="e.g., Referred by our lead developer. Has an active GitHub with 3 WordPress plugins." />
          </div>
        </div>
      )}
    </div>
  )
}

function RoleSection({ roleType, onRoleChange, seniorityLevel, onLevelChange, inputClass }: {
  roleType: string; onRoleChange: (v: string) => void; seniorityLevel: string; onLevelChange: (v: string) => void; inputClass: string
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2 block">What role is this for?</label>
      <div className="grid grid-cols-2 gap-3">
        <select value={roleType} onChange={(e) => onRoleChange(e.target.value)} className={inputClass}>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={seniorityLevel} onChange={(e) => onLevelChange(e.target.value)} className={inputClass}>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <p className="text-xs text-gray-400 mt-1">Not sure? Leave the defaults — the AI will adjust based on what it reads.</p>
    </div>
  )
}
