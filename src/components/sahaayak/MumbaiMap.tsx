'use client'

import { motion } from 'framer-motion'

const MUMBAI_AREAS = [
  { name: 'Borivali', x: 75, y: 85, incidents: 0 },
  { name: 'Thane', x: 250, y: 80, incidents: 0 },
  { name: 'Mulund', x: 230, y: 140, incidents: 0 },
  { name: 'Goregaon', x: 100, y: 145, incidents: 0 },
  { name: 'Andheri', x: 130, y: 200, incidents: 0 },
  { name: 'Kurla', x: 240, y: 210, incidents: 0 },
  { name: 'Bandra', x: 155, y: 270, incidents: 0 },
  { name: 'Dadar', x: 195, y: 300, incidents: 0 },
  { name: 'Worli', x: 175, y: 340, incidents: 0 },
  { name: 'Lower Parel', x: 215, y: 345, incidents: 0 },
  { name: 'Colaba', x: 195, y: 430, incidents: 0 },
]

interface MumbaiMapProps {
  incidents: Array<{
    area: string
    severity: string
    type: string
  }>
}

const severityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  moderate: '#eab308',
  low: '#22c55e',
}

export default function MumbaiMap({ incidents }: MumbaiMapProps) {
  // Count incidents per area
  const areaIncidentMap: Record<string, Array<{ severity: string; type: string }>> = {}
  incidents.forEach((inc) => {
    if (!areaIncidentMap[inc.area]) areaIncidentMap[inc.area] = []
    areaIncidentMap[inc.area].push({ severity: inc.severity, type: inc.type })
  })

  // Get highest severity for each area
  const severityOrder = ['critical', 'high', 'moderate', 'low']
  const areaHighestSeverity: Record<string, string> = {}
  Object.entries(areaIncidentMap).forEach(([area, incs]) => {
    const highest = incs.sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity))[0]
    areaHighestSeverity[area] = highest.severity
  })

  return (
    <div className="relative w-full h-full min-h-[350px]">
      <svg viewBox="0 0 400 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Background water */}
        <rect x="0" y="0" width="400" height="500" fill="#0c1529" />
        
        {/* Water texture */}
        <pattern id="water" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20 Q10 15 20 20 Q30 25 40 20" stroke="rgba(59,130,246,0.08)" fill="none" strokeWidth="0.5" />
        </pattern>
        <rect x="0" y="0" width="400" height="500" fill="url(#water)" />
        
        {/* Mumbai landmass - simplified outline */}
        <path
          d="M50 60 Q60 40 100 30 Q140 20 180 35 Q220 50 260 40 Q290 32 310 50 Q330 70 320 100 Q310 130 320 160 Q330 200 320 240 Q310 270 325 300 Q340 340 320 370 Q300 400 310 430 Q320 460 300 480 Q260 490 220 470 Q180 450 160 460 Q130 470 100 450 Q70 430 60 400 Q50 360 65 320 Q80 280 60 240 Q40 200 55 160 Q70 120 55 80 Z"
          fill="#1a2744"
          stroke="rgba(59,130,246,0.2)"
          strokeWidth="1"
        />
        
        {/* Inner land detail */}
        <path
          d="M80 100 Q120 80 180 90 Q220 95 260 80 Q280 85 290 110 Q295 150 290 190 Q280 230 290 270 Q300 310 290 350 Q275 390 280 420 Q270 450 240 440 Q200 430 170 440 Q140 445 110 430 Q85 410 80 380 Q75 340 85 300 Q95 260 80 220 Q65 180 75 140 Q85 110 80 100 Z"
          fill="#1e3054"
          stroke="rgba(59,130,246,0.1)"
          strokeWidth="0.5"
        />

        {/* Railway line */}
        <path
          d="M90 90 Q130 100 170 105 Q210 110 250 95 Q275 88 285 110"
          stroke="rgba(234,179,8,0.3)"
          strokeWidth="1"
          strokeDasharray="4,3"
          fill="none"
        />
        <path
          d="M100 300 Q140 310 180 315 Q220 320 260 310"
          stroke="rgba(234,179,8,0.3)"
          strokeWidth="1"
          strokeDasharray="4,3"
          fill="none"
        />

        {/* Area labels and markers */}
        {MUMBAI_AREAS.map((area) => {
          const hasIncident = areaHighestSeverity[area.name]
          const color = hasIncident ? severityColors[hasIncident] : 'rgba(148,163,184,0.3)'
          const incCount = areaIncidentMap[area.name]?.length || 0
          const markerClass = hasIncident ? `marker-${hasIncident}` : ''

          return (
            <g key={area.name}>
              {/* Area marker */}
              {hasIncident && (
                <motion.circle
                  cx={area.x}
                  cy={area.y}
                  r={8 + incCount * 2}
                  fill={color}
                  opacity={0.15}
                  animate={{ r: [8 + incCount * 2, 12 + incCount * 2, 8 + incCount * 2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <circle
                cx={area.x}
                cy={area.y}
                r={4}
                fill={hasIncident ? color : 'rgba(148,163,184,0.4)'}
                className={markerClass}
              />
              {hasIncident && (
                <circle cx={area.x} cy={area.y} r={6} fill="none" stroke={color} strokeWidth={1} opacity={0.5} />
              )}
              {/* Area name */}
              <text
                x={area.x}
                y={area.y - 12}
                textAnchor="middle"
                fill={hasIncident ? color : 'rgba(148,163,184,0.5)'}
                fontSize="7"
                fontFamily="var(--font-geist-sans)"
                fontWeight={hasIncident ? '600' : '400'}
              >
                {area.name}
              </text>
              {/* Incident count badge */}
              {incCount > 0 && (
                <>
                  <circle cx={area.x + 10} cy={area.y - 6} r={5} fill={color} />
                  <text
                    x={area.x + 10}
                    y={area.y - 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="6"
                    fontWeight="700"
                  >
                    {incCount}
                  </text>
                </>
              )}
            </g>
          )
        })}

        {/* Legend */}
        <g transform="translate(10, 460)">
          <text x="0" y="0" fill="rgba(148,163,184,0.6)" fontSize="7" fontWeight="500">SEVERITY:</text>
          <circle cx="55" cy="-2" r="3" fill="#ef4444" />
          <text x="62" y="0" fill="rgba(148,163,184,0.5)" fontSize="6">Critical</text>
          <circle cx="100" cy="-2" r="3" fill="#f97316" />
          <text x="107" y="0" fill="rgba(148,163,184,0.5)" fontSize="6">High</text>
          <circle cx="135" cy="-2" r="3" fill="#eab308" />
          <text x="142" y="0" fill="rgba(148,163,184,0.5)" fontSize="6">Moderate</text>
          <circle cx="180" cy="-2" r="3" fill="#22c55e" />
          <text x="187" y="0" fill="rgba(148,163,184,0.5)" fontSize="6">Low</text>
        </g>

        {/* Title */}
        <text x="200" y="20" textAnchor="middle" fill="rgba(59,130,246,0.6)" fontSize="9" fontWeight="600" letterSpacing="2">
          INDIA INCIDENT MAP
        </text>
      </svg>
    </div>
  )
}
