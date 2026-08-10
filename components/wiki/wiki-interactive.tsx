'use client'

import { createContext, useContext, useMemo, useState } from 'react'

import type { WikiPage } from '@/lib/wiki'

type DemoType = WikiPage['artifact']['type']

export function WikiInteractive({ type }: { type: DemoType }) {
  const [revision, setRevision] = useState(0)
  let demo: React.ReactNode
  if (type === 'rag-retrieval') demo = <RagRetrievalDemo />
  else if (type === 'source-wiki') demo = <SourceWikiDemo />
  else if (type === 'hic-heatmap') demo = <HiCHeatmapDemo />
  else if (type === 'astar-grid') demo = <AStarDemo />
  else if (type === 'swerve-vectors') demo = <SwerveDemo />
  else if (type === 'pid-controller') demo = <PidDemo />
  else if (type === 'stereo-disparity') demo = <StereoDemo />
  else if (type === 'tamp-pipeline') demo = <TampDemo />
  else if (type === 'transit-load') demo = <TransitDemo />
  else if (type === 'api-backoff') demo = <ApiBackoffDemo />
  else if (type === 'economic-series') demo = <EconomicSeriesDemo />
  else if (type === 'schedule-grid') demo = <ScheduleGridDemo />
  else if (type === 'feature-engineering') demo = <FeatureEngineeringDemo />
  else if (type === 'alphagenome') demo = <AlphaGenomeDemo />
  else if (type === 'model-tradeoff') demo = <ModelTradeoffDemo />
  else if (type === 'agent-graph') demo = <AgentGraphDemo />
  else if (type === 'hpc-queue') demo = <HpcQueueDemo />
  else if (type === 'logging-replay') demo = <LoggingReplayDemo />
  else if (type === 'vehicle-physics') demo = <VehiclePhysicsDemo />
  else demo = <QBinomialDemo />

  return (
    <DemoResetContext.Provider value={() => setRevision((value) => value + 1)}>
      <div key={revision}>{demo}</div>
    </DemoResetContext.Provider>
  )
}

const DemoResetContext = createContext<() => void>(() => undefined)

function DemoShell({ title, children }: { title: string; children: React.ReactNode }) {
  const reset = useContext(DemoResetContext)
  return (
    <div className="wiki-demo" data-testid="wiki-demo">
      <div className="wiki-demo-header">
        <div>
          <p className="eyebrow">Interactive</p>
          <h3>{title}</h3>
        </div>
        <button id="wiki-demo-reset" type="button" onClick={reset}>Reset</button>
      </div>
      <div id="wiki-demo-result" data-testid="wiki-primary-control">{children}</div>
      <p id="wiki-demo-feedback" className="wiki-demo-feedback" aria-live="polite">
        This is a simplified teaching model. Its displayed values are computed from the controls; the article explains where the model stops.
      </p>
    </div>
  )
}

function RagRetrievalDemo() {
  const [query, setQuery] = useState('exam due date and vector search')
  const chunks = [
    { title: 'Syllabus policies', text: 'exam rules grading attendance deadline due date', concepts: 'course policy assessment schedule' },
    { title: 'Lecture: embeddings', text: 'vector search embeddings semantic similarity retrieval', concepts: 'meaning related words representation' },
    { title: 'Canvas calendar export', text: 'assignment due date exam calendar deadline', concepts: 'schedule time upcoming work' },
    { title: 'Study guide draft', text: 'study review retrieval practice concepts', concepts: 'learn exam preparation meaning' },
  ]
  const tokenize = (value: string) => new Set(value.toLowerCase().match(/[a-z0-9]+/g) ?? [])
  const queryTerms = tokenize(query)
  const score = (candidate: string) => {
    const terms = tokenize(candidate)
    const overlap = [...queryTerms].filter((term) => terms.has(term)).length
    return queryTerms.size ? overlap / queryTerms.size : 0
  }

  return (
    <DemoShell title="Hybrid retrieval turns a vague study question into ranked evidence">
      <label className="wiki-label">
        Query
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="wiki-input" />
      </label>
      <div className="wiki-rank-list">
        {chunks
          .map((chunk) => {
            const keyword = score(chunk.text)
            const vector = Math.min(1, score(`${chunk.text} ${chunk.concepts}`) * 1.35)
            return { ...chunk, keyword, vector, score: keyword * 0.55 + vector * 0.45 }
          })
          .sort((a, b) => b.score - a.score)
          .map((chunk) => (
            <div key={chunk.title} className="wiki-rank-row">
              <div>
                <strong>{chunk.title}</strong>
                <span>lexical {chunk.keyword.toFixed(2)} / expanded meaning {chunk.vector.toFixed(2)}</span>
              </div>
              <div className="wiki-meter" aria-label={`Hybrid score ${chunk.score.toFixed(2)}`}>
                <span style={{ width: `${chunk.score * 100}%` }} />
              </div>
              <b>{chunk.score.toFixed(2)}</b>
            </div>
          ))}
      </div>
    </DemoShell>
  )
}

function SourceWikiDemo() {
  const [version, setVersion] = useState(2)
  const blocks = ['Definition block', 'Worked example', 'Pitfall note', 'Flashcards']
  return (
    <DemoShell title="A source-grounded wiki page is a small versioned knowledge product">
      <label className="wiki-label">Material version <output>{version}</output>
        <input type="range" min="1" max="4" value={version} onChange={(event) => setVersion(Number(event.target.value))} className="wiki-range" />
      </label>
      <div className="wiki-flow">
        {blocks.map((block, index) => (
          <div key={block} className={index < version ? 'active' : ''}>
            <span>{index + 1}</span>
            <strong>{block}</strong>
            <small>{index < version ? 'regenerated from cited notes' : 'waiting for more source context'}</small>
          </div>
        ))}
      </div>
    </DemoShell>
  )
}

function HiCHeatmapDemo() {
  const [boundary, setBoundary] = useState(5)
  const cells = Array.from({ length: 100 }, (_, index) => {
    const x = index % 10
    const y = Math.floor(index / 10)
    const distance = Math.abs(x - y)
    const sameDomain = (x < boundary && y < boundary) || (x >= boundary && y >= boundary)
    return Math.max(0.08, 1 - distance * 0.12) * (sameDomain ? 1 : 0.36)
  })

  return (
    <DemoShell title="TAD boundaries appear where contact intensity changes">
      <label className="wiki-label">
        Boundary position
        <input type="range" min="3" max="7" value={boundary} onChange={(event) => setBoundary(Number(event.target.value))} className="wiki-range" />
      </label>
      <div className="wiki-heatmap">
        {cells.map((cell, index) => (
          <span key={index} style={{ opacity: cell, backgroundColor: index % 10 === boundary || Math.floor(index / 10) === boundary ? '#f6c177' : '#84a9ff' }} />
        ))}
      </div>
    </DemoShell>
  )
}

function AStarDemo() {
  const [heuristic, setHeuristic] = useState<'manhattan' | 'euclidean'>('manhattan')
  const cells = useMemo(() => {
    const walls = new Set([7, 8, 9, 17, 25, 33, 34, 35, 43])
    const start = 0
    const goal = 55
    const open = new Set([start])
    const visited = new Set<number>()
    const cameFrom = new Map<number, number>()
    const g = new Map<number, number>([[start, 0]])
    const distance = (cell: number) => {
      const dx = Math.abs((cell % 8) - (goal % 8))
      const dy = Math.abs(Math.floor(cell / 8) - Math.floor(goal / 8))
      return heuristic === 'manhattan' ? dx + dy : Math.hypot(dx, dy)
    }
    while (open.size) {
      const current = [...open].sort((a, b) => (g.get(a) ?? Infinity) + distance(a) - (g.get(b) ?? Infinity) - distance(b))[0]
      if (current === goal) break
      open.delete(current)
      visited.add(current)
      const x = current % 8
      const neighbors = [current - 8, current + 8, ...(x > 0 ? [current - 1] : []), ...(x < 7 ? [current + 1] : [])]
        .filter((cell) => cell >= 0 && cell < 64 && !walls.has(cell))
      for (const neighbor of neighbors) {
        const tentative = (g.get(current) ?? Infinity) + 1
        if (tentative < (g.get(neighbor) ?? Infinity)) {
          cameFrom.set(neighbor, current)
          g.set(neighbor, tentative)
          open.add(neighbor)
        }
      }
    }
    const path = new Set<number>()
    let cursor: number | undefined = goal
    while (cursor !== undefined) {
      path.add(cursor)
      if (cursor === start) break
      cursor = cameFrom.get(cursor)
    }
    return Array.from({ length: 64 }, (_, index) => ({ index, wall: walls.has(index), path: path.has(index), visited: visited.has(index) }))
  }, [heuristic])
  const visitedCount = cells.filter((cell) => cell.visited).length
  const pathLength = cells.filter((cell) => cell.path).length

  return (
    <DemoShell title="A* expands likely paths first instead of flooding the whole grid">
      <div className="wiki-segmented">
        <button onClick={() => setHeuristic('manhattan')} aria-pressed={heuristic === 'manhattan'} className={heuristic === 'manhattan' ? 'active' : ''}>Manhattan</button>
        <button onClick={() => setHeuristic('euclidean')} aria-pressed={heuristic === 'euclidean'} className={heuristic === 'euclidean' ? 'active' : ''}>Euclidean</button>
      </div>
      <div className="wiki-grid-demo">
        {cells.map((cell) => (
          <span key={cell.index} className={cell.wall ? 'wall' : cell.path ? 'path' : cell.visited ? 'visited' : ''} />
        ))}
      </div>
      <p className="wiki-demo-note">Expanded <strong>{visitedCount}</strong> cells; path contains <strong>{pathLength}</strong> cells.</p>
    </DemoShell>
  )
}

function SwerveDemo() {
  const [strafe, setStrafe] = useState(40)
  const [rotate, setRotate] = useState(20)
  const modules = [
    { x: 28, y: 28, sx: strafe - rotate, sy: -20 - rotate },
    { x: 72, y: 28, sx: strafe + rotate, sy: -20 + rotate },
    { x: 28, y: 72, sx: strafe - rotate, sy: 20 + rotate },
    { x: 72, y: 72, sx: strafe + rotate, sy: 20 - rotate },
  ]
  return (
    <DemoShell title="Each module receives its own speed and wheel angle">
      <label className="wiki-label">Strafe<input type="range" min="-60" max="60" value={strafe} onChange={(e) => setStrafe(Number(e.target.value))} className="wiki-range" /></label>
      <label className="wiki-label">Rotate<input type="range" min="-60" max="60" value={rotate} onChange={(e) => setRotate(Number(e.target.value))} className="wiki-range" /></label>
      <svg viewBox="0 0 100 100" className="wiki-svg-demo" role="img" aria-label="Swerve module vectors">
        <rect x="20" y="20" width="60" height="60" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
        {modules.map((module, index) => (
          <g key={index}>
            <circle cx={module.x} cy={module.y} r="5" fill="#d1bf8a" />
            <line x1={module.x} y1={module.y} x2={module.x + module.sx / 5} y2={module.y + module.sy / 5} stroke="#84a9ff" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </DemoShell>
  )
}

function PidDemo() {
  const [kp, setKp] = useState(35)
  const [kd, setKd] = useState(18)
  const points = Array.from({ length: 40 }, (_, i) => {
    const t = i / 8
    const damping = kd / 35
    const response = 1 - Math.exp(-t * (kp / 28)) * Math.cos(t * (2.1 - damping * 0.35))
    return `${(i / 39) * 100},${80 - Math.min(1.35, response) * 48}`
  }).join(' ')
  return (
    <DemoShell title="PID tuning changes speed, overshoot, and settling">
      <label className="wiki-label">P gain<input type="range" min="10" max="70" value={kp} onChange={(e) => setKp(Number(e.target.value))} className="wiki-range" /></label>
      <label className="wiki-label">D damping<input type="range" min="0" max="50" value={kd} onChange={(e) => setKd(Number(e.target.value))} className="wiki-range" /></label>
      <svg viewBox="0 0 100 90" className="wiki-svg-demo" role="img" aria-label="PID response curve">
        <line x1="0" x2="100" y1="32" y2="32" stroke="rgba(246,193,119,0.7)" strokeDasharray="3 3" />
        <polyline points={points} fill="none" stroke="#84a9ff" strokeWidth="3" />
      </svg>
    </DemoShell>
  )
}

function StereoDemo() {
  const [disparity, setDisparity] = useState(28)
  const depth = Math.round(1200 / disparity)
  return (
    <DemoShell title="Larger disparity means a closer object">
      <label className="wiki-label">Pixel disparity<input type="range" min="8" max="64" value={disparity} onChange={(e) => setDisparity(Number(e.target.value))} className="wiki-range" /></label>
      <div className="wiki-stereo">
        <div><span style={{ left: `${45 - disparity / 4}%` }} />Left camera</div>
        <div><span style={{ left: `${45 + disparity / 4}%` }} />Right camera</div>
      </div>
      <p className="wiki-demo-note">Estimated depth index: <strong>{depth}</strong>. The exact unit depends on focal length and baseline calibration.</p>
    </DemoShell>
  )
}

function TampDemo() {
  const [stage, setStage] = useState(3)
  const steps = ['Symbolic skeleton', 'Arm assignment', 'IK check', 'Collision check', 'Trajectory', 'Trace log']
  return (
    <DemoShell title="Learning can rank plans, but geometry still verifies them">
      <label className="wiki-label">Pipeline stage <output>{stage} of {steps.length}</output>
        <input type="range" min="1" max={steps.length} value={stage} onChange={(e) => setStage(Number(e.target.value))} className="wiki-range" />
      </label>
      <div className="wiki-flow">
        {steps.map((step, index) => (
          <div key={step} className={index < stage ? 'active' : ''}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
            <small>{index < 2 ? 'planner space' : index < 5 ? 'motion verifier' : 'training data'}</small>
          </div>
        ))}
      </div>
    </DemoShell>
  )
}

function TransitDemo() {
  const [hour, setHour] = useState(12)
  const routes = ['LX', 'H', 'REXB', 'EE', 'F']
  return (
    <DemoShell title="Class schedules create visible transit demand pulses">
      <label className="wiki-label">Hour of day<input type="range" min="7" max="22" value={hour} onChange={(e) => setHour(Number(e.target.value))} className="wiki-range" /></label>
      <div className="wiki-bar-chart">
        {routes.map((route, index) => {
          const peak = [10, 12, 15, 17, 19][index]
          const value = Math.max(20, 95 - Math.abs(hour - peak) * 18)
          return <div key={route}><span style={{ height: `${value}%` }} /><b>{route}</b></div>
        })}
      </div>
    </DemoShell>
  )
}

function QBinomialDemo() {
  const [q, setQ] = useState(2)
  const values = Array.from({ length: 6 }, (_, n) => q === 1 ? n : (q ** n - 1) / (q - 1))
  return (
    <DemoShell title="A q-integer records a weighted count: 1 + q + ... + q^(n-1)">
      <label className="wiki-label">q value <output>{q}</output><input type="range" min="1" max="5" value={q} onChange={(e) => setQ(Number(e.target.value))} className="wiki-range" /></label>
      <div className="wiki-bar-chart">
        {values.map((value, index) => (
          <div key={index}><span style={{ height: `${Math.min(100, value * 4)}%` }} /><b>[{index}]q = {value}</b></div>
        ))}
      </div>
    </DemoShell>
  )
}

function ApiBackoffDemo() {
  const [failures, setFailures] = useState(3)
  const [jitter, setJitter] = useState(25)
  const waits = Array.from({ length: 6 }, (_, index) => {
    const base = Math.min(32, 2 ** index)
    const jitterTerm = index < failures ? (jitter / 100) * base * (index % 2 === 0 ? 0.7 : -0.35) : 0
    return index < failures ? Math.max(0.5, base + jitterTerm) : 0
  })
  return (
    <DemoShell title="Backoff spaces retries so a failing API can recover">
      <label className="wiki-label">Failed attempts before success<input type="range" min="1" max="6" value={failures} onChange={(e) => setFailures(Number(e.target.value))} className="wiki-range" /></label>
      <label className="wiki-label">Jitter amount<input type="range" min="0" max="60" value={jitter} onChange={(e) => setJitter(Number(e.target.value))} className="wiki-range" /></label>
      <div className="wiki-bar-chart">
        {waits.map((wait, index) => (
          <div key={index}><span style={{ height: `${Math.max(6, wait * 3)}%`, opacity: wait ? 1 : 0.25 }} /><b>{wait ? `${wait.toFixed(1)}s` : 'success'}</b></div>
        ))}
      </div>
    </DemoShell>
  )
}

function EconomicSeriesDemo() {
  const [normalize, setNormalize] = useState(true)
  const series = [
    { name: 'CPI', values: [100, 104, 111, 119, 126, 132] },
    { name: 'Unemployment', values: [6.1, 5.4, 4.1, 6.8, 4.7, 3.9] },
    { name: 'Fed Funds', values: [0.25, 0.5, 1.75, 0.25, 2.5, 5.25] },
  ]
  const points = series.map((line) => {
    const min = Math.min(...line.values)
    const max = Math.max(...line.values)
    return line.values.map((value, index) => {
      const scaled = normalize ? (value - min) / Math.max(1, max - min) : value / Math.max(...line.values)
      return `${index * 20},${82 - scaled * 62}`
    }).join(' ')
  })
  return (
    <DemoShell title="Normalization lets unlike economic series share a visual frame">
      <div className="wiki-segmented">
        <button onClick={() => setNormalize(true)} aria-pressed={normalize} className={normalize ? 'active' : ''}>Indexed</button>
        <button onClick={() => setNormalize(false)} aria-pressed={!normalize} className={!normalize ? 'active' : ''}>Raw scale</button>
      </div>
      <svg viewBox="0 0 105 90" className="wiki-svg-demo" role="img" aria-label="Economic series chart">
        {points.map((point, index) => <polyline key={series[index].name} points={point} fill="none" stroke={['#84a9ff', '#d1bf8a', '#c15353'][index]} strokeWidth="2.5" />)}
      </svg>
      <div className="wiki-mini-legend">{series.map((line, index) => <span key={line.name}><i style={{ background: ['#84a9ff', '#d1bf8a', '#c15353'][index] }} />{line.name}</span>)}</div>
    </DemoShell>
  )
}

function ScheduleGridDemo() {
  const [campusWeight, setCampusWeight] = useState(40)
  const [gapWeight, setGapWeight] = useState(55)
  const days = ['M', 'T', 'W', 'Th', 'F']
  const slots = Array.from({ length: 30 }, (_, index) => {
    const day = index % 5
    const row = Math.floor(index / 5)
    const busy = (day + row + Math.round(campusWeight / 25)) % 4 === 0 || (row === 2 && day < 3)
    const preferred = !busy && Math.abs(day - row) * 14 < gapWeight
    return { busy, preferred }
  })
  return (
    <DemoShell title="A schedule generator balances conflicts, gaps, and travel constraints">
      <label className="wiki-label">Campus travel penalty<input type="range" min="0" max="100" value={campusWeight} onChange={(e) => setCampusWeight(Number(e.target.value))} className="wiki-range" /></label>
      <label className="wiki-label">Gap avoidance<input type="range" min="0" max="100" value={gapWeight} onChange={(e) => setGapWeight(Number(e.target.value))} className="wiki-range" /></label>
      <div className="wiki-schedule-grid">
        {days.map((day) => <b key={day}>{day}</b>)}
        {slots.map((slot, index) => <span key={index} className={slot.busy ? 'blocked' : slot.preferred ? 'preferred' : ''} />)}
      </div>
    </DemoShell>
  )
}

function FeatureEngineeringDemo() {
  const [logTransform, setLogTransform] = useState(true)
  const [interaction, setInteraction] = useState(true)
  const features = ['duration', 'miles', 'receipts', 'miles/day', 'receipts/day']
  if (logTransform) features.push('log(receipts+1)')
  if (interaction) features.push('miles x receipts')
  return (
    <DemoShell title="Raw columns become model-ready signals through feature engineering">
      <label className="wiki-check"><input type="checkbox" checked={logTransform} onChange={(e) => setLogTransform(e.target.checked)} /> Log transform skewed money values</label>
      <label className="wiki-check"><input type="checkbox" checked={interaction} onChange={(e) => setInteraction(e.target.checked)} /> Add interaction terms</label>
      <div className="wiki-feature-pipeline">
        <div><strong>Raw inputs</strong><span>duration, miles, receipts</span></div>
        <div><strong>Generated features</strong>{features.map((feature) => <span key={feature}>{feature}</span>)}</div>
        <div><strong>Model</strong><span>tree ensemble or regression</span></div>
      </div>
    </DemoShell>
  )
}

function AlphaGenomeDemo() {
  const [deletion, setDeletion] = useState(4)
  const tracks = ['CTCF', 'ATAC', 'H3K27ac', 'RNA']
  return (
    <DemoShell title="Sequence edits can be compared as predicted regulatory tracks">
      <label className="wiki-label">Deletion size index<input type="range" min="1" max="8" value={deletion} onChange={(e) => setDeletion(Number(e.target.value))} className="wiki-range" /></label>
      <div className="wiki-track-stack">
        {tracks.map((track, index) => {
          const width = Math.max(18, 86 - deletion * (index + 1) * 5)
          return <div key={track}><b>{track}</b><span><i style={{ width: `${width}%` }} /></span><small>{width > 55 ? 'stable' : 'disrupted'}</small></div>
        })}
      </div>
    </DemoShell>
  )
}

function ModelTradeoffDemo() {
  const [params, setParams] = useState(35)
  const accuracy = Math.min(94, 48 + Math.log2(params + 2) * 8)
  const latency = Math.round(params * 3.4)
  const memory = Math.round(params * 0.72)
  return (
    <DemoShell title="Smaller models trade peak accuracy for speed and deployment freedom">
      <label className="wiki-label">Model size index<input type="range" min="4" max="100" value={params} onChange={(e) => setParams(Number(e.target.value))} className="wiki-range" /></label>
      <div className="wiki-metric-triplet">
        <div><strong>{accuracy.toFixed(1)}%</strong><span>reasoning score</span></div>
        <div><strong>{latency}ms</strong><span>latency index</span></div>
        <div><strong>{memory}GB</strong><span>memory index</span></div>
      </div>
    </DemoShell>
  )
}

function AgentGraphDemo() {
  const [mode, setMode] = useState<'router' | 'handoff'>('router')
  const nodes = mode === 'router'
    ? ['User request', 'Orchestrator', 'Search tool', 'Study agent', 'Answer']
    : ['User request', 'Planner agent', 'Research agent', 'Draft agent', 'Review agent']
  return (
    <DemoShell title="Agent systems are graphs of state, routing, and tool access">
      <div className="wiki-segmented">
        <button onClick={() => setMode('router')} aria-pressed={mode === 'router'} className={mode === 'router' ? 'active' : ''}>Tool routing</button>
        <button onClick={() => setMode('handoff')} aria-pressed={mode === 'handoff'} className={mode === 'handoff' ? 'active' : ''}>Agent handoff</button>
      </div>
      <div className="wiki-agent-graph">
        {nodes.map((node, index) => (
          <div key={node} className={index === 1 ? 'hub' : ''}>
            <span>{index + 1}</span>
            <strong>{node}</strong>
            <small>{index === 0 ? 'input' : index === nodes.length - 1 ? 'output' : 'state update'}</small>
          </div>
        ))}
      </div>
    </DemoShell>
  )
}

function HpcQueueDemo() {
  const [gpus, setGpus] = useState(2)
  const [hours, setHours] = useState(4)
  const jobs = [
    { name: 'tokenize', need: 1, time: 1 },
    { name: 'sft-run', need: 2, time: 4 },
    { name: 'eval', need: 1, time: 2 },
    { name: 'quantize', need: 1, time: 1 },
  ]
  return (
    <DemoShell title="Schedulers fit jobs into finite GPU, memory, and wall-time budgets">
      <label className="wiki-label">Requested GPUs<input type="range" min="1" max="8" value={gpus} onChange={(e) => setGpus(Number(e.target.value))} className="wiki-range" /></label>
      <label className="wiki-label">Wall time hours<input type="range" min="1" max="12" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="wiki-range" /></label>
      <div className="wiki-job-list">
        {jobs.map((job) => {
          const fits = job.need <= gpus && job.time <= hours
          return <div key={job.name} className={fits ? 'fits' : ''}><strong>{job.name}</strong><span>{job.need} GPU / {job.time}h</span><b>{fits ? 'eligible' : 'waiting'}</b></div>
        })}
      </div>
    </DemoShell>
  )
}

function LoggingReplayDemo() {
  const [tick, setTick] = useState(55)
  const sensor = Math.sin(tick / 12) * 35 + 50
  const output = Math.max(0, Math.min(100, sensor + Math.cos(tick / 9) * 18))
  return (
    <DemoShell title="Log replay turns recorded inputs into repeatable debugging">
      <label className="wiki-label">Replay timestamp<input type="range" min="0" max="100" value={tick} onChange={(e) => setTick(Number(e.target.value))} className="wiki-range" /></label>
      <div className="wiki-replay-panel">
        <div><strong>{sensor.toFixed(1)}</strong><span>sensor input</span></div>
        <div><strong>{output.toFixed(1)}</strong><span>code output</span></div>
        <div><strong>{Math.abs(output - sensor).toFixed(1)}</strong><span>derived signal</span></div>
      </div>
    </DemoShell>
  )
}

function VehiclePhysicsDemo() {
  const [engine, setEngine] = useState(52)
  const [steering, setSteering] = useState(18)
  const speed = Math.max(0, engine - Math.abs(steering) * 0.35)
  const slip = Math.min(100, Math.abs(steering) * 1.4 + engine * 0.18)
  return (
    <DemoShell title="Vehicle feel comes from power, steering, friction, and suspension">
      <label className="wiki-label">Engine force<input type="range" min="0" max="100" value={engine} onChange={(e) => setEngine(Number(e.target.value))} className="wiki-range" /></label>
      <label className="wiki-label">Steering angle<input type="range" min="-45" max="45" value={steering} onChange={(e) => setSteering(Number(e.target.value))} className="wiki-range" /></label>
      <svg viewBox="0 0 120 80" className="wiki-svg-demo" role="img" aria-label="Vehicle turning diagram">
        <path d={`M20 55 C45 ${55 - steering / 1.8}, 75 ${25 + steering / 1.8}, 105 25`} fill="none" stroke="#84a9ff" strokeWidth="4" strokeLinecap="round" />
        <rect x="47" y="36" width="26" height="14" rx="4" fill="#d1bf8a" transform={`rotate(${steering / 2} 60 43)`} />
      </svg>
      <div className="wiki-metric-triplet">
        <div><strong>{speed.toFixed(0)}</strong><span>speed index</span></div>
        <div><strong>{Math.abs(steering)}°</strong><span>steering</span></div>
        <div><strong>{slip.toFixed(0)}</strong><span>slip risk</span></div>
      </div>
    </DemoShell>
  )
}
