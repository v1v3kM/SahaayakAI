'use client'

import { motion } from 'framer-motion'
import { useSahaayakStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import dynamic from 'next/dynamic'
const IndiaMap = dynamic(() => import('./IndiaMap'), { ssr: false, loading: () => <div className="w-full h-[420px] rounded-xl bg-secondary/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">Loading Map...</div> })
import { AlertTriangle, Activity, Send, Truck, Clock, MapPin } from 'lucide-react'

const severityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  moderate: '#eab308',
  low: '#22c55e',
}

const typeEmojis: Record<string, string> = {
  flood: '🌊',
  building_collapse: '🏗️',
  fire: '🔥',
  landslide: '⛰️',
  waterlogging: '💧',
  traffic_disaster: '🚗',
  cyclone: '🌀',
  earthquake: '🫨',
  tsunami: '🌊',
  heatwave: '🌡️',
  cold_wave: '🥶',
  drought: '🏜️',
  storm: '⛈️',
  industrial_accident: '🏭',
  pandemic: '🦠',
  other: '⚠️',
}

export default function Dashboard() {
  const { incidents, agents, stats, alerts } = useSahaayakStore()

  const statCards = [
    { label: 'Active Incidents', value: stats.activeIncidents, icon: <AlertTriangle className="w-5 h-5" />, color: '#ef4444' },
    { label: 'Agents Active', value: `${agents.filter(a => a.status !== 'idle').length}/${agents.length}`, icon: <Activity className="w-5 h-5" />, color: '#22c55e' },
    { label: 'Resources Deployed', value: stats.resourcesDeployed, icon: <Truck className="w-5 h-5" />, color: '#f97316' },
    { label: 'Alerts Sent', value: stats.alertsSent, icon: <Send className="w-5 h-5" />, color: '#3b82f6' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Map */}
        <div className="lg:col-span-2 glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            India Incident Map
          </h3>
          <IndiaMap incidents={incidents} />
        </div>

        {/* Agent Status Panel */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Agent Status
          </h3>
          <div className="space-y-3">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg border border-border bg-secondary/20 ${agent.status !== 'idle' ? agent.glowClass : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{agent.emoji}</span>
                    <span className="text-sm font-semibold" style={{ color: agent.color }}>
                      {agent.name}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px]"
                    style={{
                      borderColor: agent.status === 'idle' ? '#64748b' : agent.color,
                      color: agent.status === 'idle' ? '#64748b' : agent.color,
                    }}
                  >
                    {agent.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{agent.currentAction}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-xs text-muted-foreground font-semibold mb-2">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <div className="text-lg font-bold text-red-400">
                  {incidents.filter(i => i.severity === 'critical').length}
                </div>
                <div className="text-[10px] text-muted-foreground">Critical</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <div className="text-lg font-bold text-orange-400">
                  {incidents.filter(i => i.severity === 'high').length}
                </div>
                <div className="text-[10px] text-muted-foreground">High</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <div className="text-lg font-bold text-yellow-400">
                  {incidents.filter(i => i.severity === 'moderate').length}
                </div>
                <div className="text-[10px] text-muted-foreground">Moderate</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <div className="text-lg font-bold text-blue-400">{alerts.length}</div>
                <div className="text-[10px] text-muted-foreground">Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Incidents List */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Active Incidents
        </h3>
        <div className="max-h-64 overflow-y-auto">
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No active incidents. Submit a report to see incidents here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {incidents.map((incident, i) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-lg border border-border bg-secondary/20 hover:border-blue-500/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{typeEmojis[incident.type] || '⚠️'}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold"
                        style={{
                          borderColor: severityColors[incident.severity],
                          color: severityColors[incident.severity],
                        }}
                      >
                        {incident.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {incident.status}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold mb-1">{incident.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <MapPin className="w-3 h-3" />
                    {incident.location || incident.area}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{incident.description}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-2">
                    <Clock className="w-3 h-3" />
                    {new Date(incident.createdAt).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
