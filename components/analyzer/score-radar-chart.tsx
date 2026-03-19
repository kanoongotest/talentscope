/**
 * PURPOSE: Hexagonal radar/spider chart showing 6 dimension scores vs role expectations
 * INPUTS: Six dimension scores, seniority level for expectation baseline, band for fill color
 * OUTPUTS: Inline SVG radar chart with candidate shape and expected outline
 * RELATIONSHIPS: Used by analysis-results-view.tsx
 */

interface Props {
  scores: { technical: number; wordpress: number; culture: number; ai: number; remote: number; professional: number }
  seniorityLevel: string
  band: string
}

const EXPECTATIONS: Record<string, number[]> = {
  'Mid-Level':  [60, 60, 55, 40, 55, 50],
  'Senior':     [75, 75, 65, 55, 65, 65],
  'Lead':       [80, 80, 75, 60, 70, 75],
  'Manager':    [70, 70, 80, 55, 75, 80],
}

const LABELS = ['Technical', 'WordPress', 'Culture', 'AI', 'Remote', 'Professional']

const BAND_FILL: Record<string, string> = {
  A: 'rgba(22,163,74,0.15)',
  B: 'rgba(24,92,227,0.15)',
  C: 'rgba(217,119,6,0.15)',
  D: 'rgba(220,38,38,0.15)',
}

const BAND_STROKE: Record<string, string> = {
  A: '#16A34A', B: '#185CE3', C: '#D97706', D: '#DC2626',
}

const SIZE = 280
const CX = SIZE / 2
const CY = SIZE / 2
const R = 100

function polarToXY(angle: number, radius: number): [number, number] {
  const rad = ((angle - 90) * Math.PI) / 180
  return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)]
}

function scoreToPoints(values: number[]): string {
  return values
    .map((v, i) => {
      const angle = (360 / 6) * i
      const [x, y] = polarToXY(angle, (v / 100) * R)
      return `${x},${y}`
    })
    .join(' ')
}

export function ScoreRadarChart({ scores, seniorityLevel, band }: Props) {
  const actual = [scores.technical, scores.wordpress, scores.culture, scores.ai, scores.remote, scores.professional]
  const expected = EXPECTATIONS[seniorityLevel] || EXPECTATIONS['Mid-Level']

  const rings = [25, 50, 75, 100]

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
        Score Profile
      </h3>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[280px] mx-auto">
        {/* Grid rings */}
        {rings.map((ring) => (
          <polygon
            key={ring}
            points={Array.from({ length: 6 }, (_, i) => {
              const [x, y] = polarToXY((360 / 6) * i, (ring / 100) * R)
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={ring === 100 ? 1 : 0.5}
          />
        ))}

        {/* Axis lines */}
        {Array.from({ length: 6 }, (_, i) => {
          const [x, y] = polarToXY((360 / 6) * i, R)
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#E5E7EB" strokeWidth={0.5} />
        })}

        {/* Expected outline */}
        <polygon
          points={scoreToPoints(expected)}
          fill="none"
          stroke="#9CA3AF"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Actual scores */}
        <polygon
          points={scoreToPoints(actual)}
          fill={BAND_FILL[band] || BAND_FILL.D}
          stroke={BAND_STROKE[band] || BAND_STROKE.D}
          strokeWidth={2}
        />

        {/* Score dots */}
        {actual.map((v, i) => {
          const [x, y] = polarToXY((360 / 6) * i, (v / 100) * R)
          return <circle key={i} cx={x} cy={y} r={3} fill={BAND_STROKE[band] || BAND_STROKE.D} />
        })}

        {/* Labels */}
        {LABELS.map((label, i) => {
          const [x, y] = polarToXY((360 / 6) * i, R + 22)
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-500"
              fontSize={9}
              fontWeight={500}
            >
              {label}
            </text>
          )
        })}
      </svg>
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ background: BAND_STROKE[band] || BAND_STROKE.D }} />
          Candidate
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 border-t border-dashed border-gray-400" />
          Expected ({seniorityLevel})
        </span>
      </div>
    </div>
  )
}
