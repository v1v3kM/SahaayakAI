'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useSahaayakStore, type AgentType } from '@/lib/store'
import { useEffect, useState, useRef } from 'react'

const AGENT_POSITIONS: Record<AgentType, { x: number; y: number }> = {
  report_intake: { x: 50, y: 8 },
  fake_detector: { x: 15, y: 35 },
  situation_assessment: { x: 85, y: 35 },
  resource_allocation: { x: 75, y: 75 },
  communication: { x: 25, y: 75 },
  coordination: { x: 50, y: 92 },
}

const AGENT_CONNECTIONS: Array<[AgentType, AgentType]> = [
  ['report_intake', 'fake_detector'],
  ['fake_detector', 'situation_assessment'],
  ['situation_assessment', 'resource_allocation'],
  ['resource_allocation', 'communication'],
  ['communication', 'coordination'],
  ['coordination', 'report_intake'],
  ['fake_detector', 'coordination'],
  ['situation_assessment', 'coordination'],
]

export default function AgentNetwork() {
  const { agents, agentMessages, agentLogs } = useSahaayakStore()
  const [activeFlows, setActiveFlows] = useState<Array<{ id: string; from: AgentType; to: AgentType; progress: number }>>([])
  const processedMessagesRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (agentMessages.length === 0) return
    const latestMsg = agentMessages[agentMessages.length - 1]
    const flowId = `${latestMsg.from}-${latestMsg.to}-${latestMsg.timestamp}`
    if (processedMessagesRef.current.has(flowId)) return
    processedMessagesRef.current.add(flowId)

    let frame = -2
    let cancelled = false
    const interval = setInterval(() => {
      if (cancelled) return
      frame += 2
      if (frame < 0) {
        setActiveFlows((prev) => [...prev, { id: flowId, from: latestMsg.from, to: latestMsg.to, progress: 0 }])
      } else if (frame >= 100) {
        setActiveFlows((prev) => prev.filter((f) => f.id !== flowId))
        clearInterval(interval)
      } else {
        setActiveFlows((prev) => prev.map((f) => (f.id === flowId ? { ...f, progress: frame } : f)))
      }
    }, 30)

    return () => { cancelled = true; clearInterval(interval) }
  }, [agentMessages])

  const getLineCoords = (from: AgentType, to: AgentType) => {
    const fromPos = AGENT_POSITIONS[from]
    const toPos = AGENT_POSITIONS[to]
    return { x1: fromPos.x, y1: fromPos.y, x2: toPos.x, y2: toPos.y }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div className="flex-1 relative">
        <div className="glass-card rounded-xl p-4 h-full min-h-[450px]">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">6-Agent Collaboration Network</h3>
          <svg viewBox="0 0 100 100" className="w-full h-full max-h-[500px]" xmlns="http://www.w3.org/2000/svg">
            <pattern id="agentGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="0.15" fill="rgba(59,130,246,0.1)" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#agentGrid)" />

            {AGENT_CONNECTIONS.map(([from, to], i) => {
              const { x1, y1, x2, y2 } = getLineCoords(from, to)
              const hasActiveFlow = activeFlows.some((f) => (f.from === from && f.to === to) || (f.from === to && f.to === from))
              return (
                <g key={`line-${i}`}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={hasActiveFlow ? 'rgba(59,130,246,0.4)' : 'rgba(148,163,184,0.1)'}
                    strokeWidth={hasActiveFlow ? 0.4 : 0.2} className={hasActiveFlow ? 'agent-line' : ''} />
                </g>
              )
            })}

            {activeFlows.map((flow) => {
              const { x1, y1, x2, y2 } = getLineCoords(flow.from, flow.to)
              const progress = flow.progress / 100
              const cx = x1 + (x2 - x1) * progress
              const cy = y1 + (y2 - y1) * progress
              const fromAgent = agents.find((a) => a.id === flow.from)
              return (
                <g key={flow.id}>
                  <line x1={x1 + (x2 - x1) * Math.max(0, progress - 0.15)} y1={y1 + (y2 - y1) * Math.max(0, progress - 0.15)}
                    x2={cx} y2={cy} stroke={fromAgent?.color || '#3b82f6'} strokeWidth={0.3} opacity={0.6} />
                  <motion.circle cx={cx} cy={cy} r={1} fill={fromAgent?.color || '#3b82f6'}
                    animate={{ r: [0.8, 1.2, 0.8] }} transition={{ duration: 0.5, repeat: Infinity }} />
                  <circle cx={cx} cy={cy} r={2.5} fill={fromAgent?.color || '#3b82f6'} opacity={0.15} />
                </g>
              )
            })}

            {agents.map((agent) => {
              const pos = AGENT_POSITIONS[agent.id]
              if (!pos) return null
              const isActive = agent.status !== 'idle'
              return (
                <g key={agent.id}>
                  {isActive && (
                    <motion.circle cx={pos.x} cy={pos.y} r={7} fill="none" stroke={agent.color} strokeWidth={0.2}
                      animate={{ r: [7, 9, 7], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
                  )}
                  <circle cx={pos.x} cy={pos.y} r={5} fill={agent.color} opacity={0.08} />
                  <motion.circle cx={pos.x} cy={pos.y} r={4} fill={isActive ? agent.color : '#1e293b'}
                    stroke={agent.color} strokeWidth={isActive ? 0.6 : 0.3}
                    animate={isActive ? { fill: [agent.color, '#1e293b', agent.color] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
                  <text x={pos.x} y={pos.y + 1.2} textAnchor="middle" fontSize="3.5" dominantBaseline="middle">{agent.emoji}</text>
                  <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill="rgba(226,232,240,0.7)" fontSize="2.2" fontWeight="500" fontFamily="var(--font-geist-sans)">{agent.name}</text>
                  <text x={pos.x} y={pos.y + 11} textAnchor="middle" fill={agent.status === 'idle' ? 'rgba(148,163,184,0.4)' : agent.color} fontSize="1.8" fontFamily="var(--font-geist-sans)">
                    {agent.status === 'idle' ? '● IDLE' : agent.status === 'processing' ? '● PROCESSING' : '● COLLABORATING'}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      <div className="lg:w-[380px] flex flex-col gap-4">
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Current Task</h3>
          <div className="space-y-2">
            {agents.filter((a) => a.status !== 'idle').length > 0 ? (
              agents.filter((a) => a.status !== 'idle').map((agent) => (
                <div key={agent.id} className="flex items-center gap-2">
                  <span className="text-sm">{agent.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: agent.color }}>{agent.name}</span>
                      <motion.span className="text-xs text-muted-foreground" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        {agent.status === 'processing' ? '⟳' : '⇄'}
                      </motion.span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{agent.currentAction}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground text-center py-4">
                <span className="text-lg block mb-1">✓</span>All 6 agents standing by. Awaiting new reports.
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex-1">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Agent Activity Log</h3>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
            <AnimatePresence>
              {agentLogs.slice(0, 30).map((log) => {
                const agent = agents.find((a) => a.id === log.agentType)
                return (
                  <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                    className="flex items-start gap-2 text-xs">
                    <span className="mt-0.5 shrink-0">{agent?.emoji || '●'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold" style={{ color: agent?.color || '#94a3b8' }}>{agent?.name || log.agentType}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-muted-foreground/60 font-mono text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 break-words">{log.details}</p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {agentLogs.length === 0 && <div className="text-xs text-muted-foreground text-center py-8">No activity yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
