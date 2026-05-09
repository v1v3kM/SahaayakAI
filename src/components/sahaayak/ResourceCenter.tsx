'use client'

import { motion } from 'framer-motion'
import { useSahaayakStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Truck, Ambulance, Shield, Droplets, Wrench, Users } from 'lucide-react'

interface Resource {
  id: string
  name: string
  icon: React.ReactNode
  total: number
  deployed: number
  color: string
}

const RESOURCES: Resource[] = [
  { id: 'ambulance', name: 'Ambulances', icon: <Ambulance className="w-5 h-5" />, total: 24, deployed: 8, color: '#ef4444' },
  { id: 'rescue', name: 'Rescue Teams', icon: <Shield className="w-5 h-5" />, total: 15, deployed: 6, color: '#f97316' },
  { id: 'fire', name: 'Fire Brigades', icon: <Droplets className="w-5 h-5" />, total: 12, deployed: 3, color: '#eab308' },
  { id: 'supply', name: 'Supply Trucks', icon: <Truck className="w-5 h-5" />, total: 20, deployed: 7, color: '#22c55e' },
  { id: 'engineer', name: 'Engg. Teams', icon: <Wrench className="w-5 h-5" />, total: 8, deployed: 2, color: '#3b82f6' },
  { id: 'volunteer', name: 'Volunteers', icon: <Users className="w-5 h-5" />, total: 200, deployed: 85, color: '#a855f7' },
]

const MUMBAI_AREAS = [
  { name: 'Andheri', x: 130, y: 200 },
  { name: 'Bandra', x: 155, y: 270 },
  { name: 'Dadar', x: 195, y: 300 },
  { name: 'Borivali', x: 75, y: 85 },
  { name: 'Thane', x: 250, y: 80 },
  { name: 'Mulund', x: 230, y: 140 },
  { name: 'Colaba', x: 195, y: 430 },
  { name: 'Worli', x: 175, y: 340 },
]

export default function ResourceCenter() {
  const { incidents } = useSahaayakStore()

  // Calculate deployed resources from incidents
  const totalDeployed = incidents.reduce((acc, inc) => acc + inc.resourcesAllocated, 0)

  return (
    <div className="space-y-6">
      {/* Resource Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {RESOURCES.map((resource, i) => {
          const deployed = Math.min(resource.deployed + Math.floor(totalDeployed * (resource.total / 80)), resource.total)
          const available = resource.total - deployed
          const percentage = Math.round((deployed / resource.total) * 100)

          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-4 text-center"
            >
              <div className="flex justify-center mb-2" style={{ color: resource.color }}>
                {resource.icon}
              </div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">{resource.name}</h4>
              <div className="text-2xl font-bold" style={{ color: resource.color }}>{deployed}</div>
              <div className="text-[10px] text-muted-foreground">of {resource.total} deployed</div>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: resource.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">{available} available</div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Allocation Table */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Resource Allocation by Incident</h3>
          <div className="max-h-96 overflow-y-auto">
            {incidents.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No active incidents to show resource allocation.
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.map((incident) => {
                  const severityColors: Record<string, string> = {
                    critical: '#ef4444',
                    high: '#f97316',
                    moderate: '#eab308',
                    low: '#22c55e',
                  }
                  return (
                    <div key={incident.id} className="p-3 rounded-lg border border-border bg-secondary/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-semibold"
                            style={{ borderColor: severityColors[incident.severity], color: severityColors[incident.severity] }}
                          >
                            {incident.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{incident.area}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {incident.resourcesAllocated} units
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{incident.type.replace('_', ' ')} - {incident.title}</p>
                      <div className="flex gap-2 mt-2">
                        {incident.severity === 'critical' || incident.severity === 'high' ? (
                          <>
                            <Badge variant="secondary" className="text-[10px]"><Ambulance className="w-3 h-3 mr-1" />2 Ambulances</Badge>
                            <Badge variant="secondary" className="text-[10px]"><Shield className="w-3 h-3 mr-1" />1 Rescue Team</Badge>
                            <Badge variant="secondary" className="text-[10px]"><Truck className="w-3 h-3 mr-1" />1 Supply</Badge>
                          </>
                        ) : (
                          <>
                            <Badge variant="secondary" className="text-[10px]"><Ambulance className="w-3 h-3 mr-1" />1 Ambulance</Badge>
                            <Badge variant="secondary" className="text-[10px]"><Users className="w-3 h-3 mr-1" />Volunteers</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Deployment Map */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Resource Deployment Map</h3>
          <div className="relative w-full min-h-[300px]">
            <svg viewBox="0 0 400 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Background */}
              <rect x="0" y="0" width="400" height="500" fill="#0c1529" />
              <pattern id="resWater" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 Q10 15 20 20 Q30 25 40 20" stroke="rgba(59,130,246,0.05)" fill="none" strokeWidth="0.5" />
              </pattern>
              <rect x="0" y="0" width="400" height="500" fill="url(#resWater)" />
              
              {/* India outline */}
              <path
                d="M50 60 Q60 40 100 30 Q140 20 180 35 Q220 50 260 40 Q290 32 310 50 Q330 70 320 100 Q310 130 320 160 Q330 200 320 240 Q310 270 325 300 Q340 340 320 370 Q300 400 310 430 Q320 460 300 480 Q260 490 220 470 Q180 450 160 460 Q130 470 100 450 Q70 430 60 400 Q50 360 65 320 Q80 280 60 240 Q40 200 55 160 Q70 120 55 80 Z"
                fill="#1a2744"
                stroke="rgba(59,130,246,0.15)"
                strokeWidth="1"
              />

              {/* Resource icons at incident locations */}
              {incidents.map((incident, i) => {
                const areaData = MUMBAI_AREAS.find((a) => a.name === incident.area)
                if (!areaData) return null

                const offsets = [
                  { dx: -8, dy: -8 },
                  { dx: 8, dy: -8 },
                  { dx: -8, dy: 8 },
                  { dx: 8, dy: 8 },
                ]

                return (
                  <g key={`res-${incident.id}`}>
                    {/* Incident circle */}
                    <circle
                      cx={areaData.x}
                      cy={areaData.y}
                      r={6}
                      fill={incident.severity === 'critical' ? '#ef4444' : incident.severity === 'high' ? '#f97316' : '#eab308'}
                      opacity={0.2}
                    />
                    <circle
                      cx={areaData.x}
                      cy={areaData.y}
                      r={3}
                      fill={incident.severity === 'critical' ? '#ef4444' : incident.severity === 'high' ? '#f97316' : '#eab308'}
                    />
                    
                    {/* Resource markers around the incident */}
                    {offsets.slice(0, Math.min(incident.resourcesAllocated, 4)).map((off, j) => (
                      <g key={`r-${j}`} transform={`translate(${areaData.x + off.dx}, ${areaData.y + off.dy})`}>
                        <rect x="-3" y="-3" width="6" height="6" rx="1" fill="#22c55e" opacity={0.8} />
                        <text x="0" y="1" textAnchor="middle" fill="white" fontSize="4" fontWeight="700">
                          {j === 0 ? 'A' : j === 1 ? 'R' : j === 2 ? 'F' : 'S'}
                        </text>
                      </g>
                    ))}
                    
                    {/* Area label */}
                    <text
                      x={areaData.x}
                      y={areaData.y - 12}
                      textAnchor="middle"
                      fill="rgba(226,232,240,0.6)"
                      fontSize="7"
                      fontFamily="var(--font-geist-sans)"
                      fontWeight="500"
                    >
                      {areaData.name}
                    </text>
                  </g>
                )
              })}

              {/* Legend */}
              <g transform="translate(10, 480)">
                <text x="0" y="0" fill="rgba(148,163,184,0.6)" fontSize="7" fontWeight="500">RESOURCES:</text>
                <rect x="60" y="-5" width="6" height="6" rx="1" fill="#22c55e" opacity={0.8} />
                <text x="70" y="0" fill="rgba(148,163,184,0.5)" fontSize="6">A=Ambulance R=Rescue F=Fire S=Supply</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
