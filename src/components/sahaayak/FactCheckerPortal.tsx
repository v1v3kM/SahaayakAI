'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSahaayakStore, type IncidentData } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle, Shield, Clock, MapPin, AlertTriangle, Eye, Filter, ArrowLeft, Search, Loader2 } from 'lucide-react'

const severityColors: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', moderate: '#eab308', low: '#22c55e',
}

const typeEmojis: Record<string, string> = {
  flood: '🌊', building_collapse: '🏗️', fire: '🔥', landslide: '⛰️',
  waterlogging: '💧', traffic_disaster: '🚗', cyclone: '🌀', other: '⚠️',
}

export default function FactCheckerPortal() {
  const {
    incidents,
    setCurrentPortal,
    updateIncidentInList,
    updateReporterInList,
    setIncidents,
  } = useSahaayakStore()

  const [activeTab, setActiveTab] = useState('review-queue')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(null)
  const [localIncidents, setLocalIncidents] = useState<IncidentData[]>([])

  // Load fresh incidents
  useEffect(() => {
    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => {
        if (data.incidents) {
          setIncidents(data.incidents)
          setLocalIncidents(data.incidents)
        }
      })
      .catch(console.error)
  }, [setIncidents])

  // Refresh local incidents when store changes
  useEffect(() => {
    setLocalIncidents(incidents)
  }, [incidents])

  const pendingReports = localIncidents.filter(inc =>
    inc.verificationStatus === 'pending' || inc.verificationStatus === 'under_review'
  )

  const verifiedReports = localIncidents.filter(inc =>
    filterStatus === 'all' ? true : inc.verificationStatus === filterStatus
  ).filter(inc =>
    !searchQuery || inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || inc.area.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVerify = async (incidentId: string, status: 'genuine' | 'fake') => {
    setVerifyingId(incidentId)
    try {
      // Use admin reporter ID for verification (hardcoded for demo)
      const res = await fetch(`/api/incidents/${incidentId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          verifierId: 'admin',
          notes: `Verified as ${status} by fact-checker`,
        }),
      })
      const data = await res.json()

      if (data.incident) {
        updateIncidentInList(incidentId, {
          verificationStatus: status,
          status: status === 'genuine' ? 'verified' : 'fake',
        })
      }

      if (data.reporter) {
        updateReporterInList(data.reporter.id, {
          credibilityScore: data.reporter.credibilityScore,
          verifiedReports: data.reporter.verifiedReports,
          fakeReports: data.reporter.fakeReports,
          badges: data.reporter.badges,
          isRateLimited: data.reporter.isRateLimited,
        })
      }

      // Refresh incidents from server
      const freshRes = await fetch('/api/incidents')
      const freshData = await freshRes.json()
      if (freshData.incidents) {
        setIncidents(freshData.incidents)
      }
    } catch (error) {
      console.error('Verify error:', error)
    }
    setVerifyingId(null)
  }

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return '#22c55e'
    if (score >= 50) return '#eab308'
    return '#ef4444'
  }

  const getFakeScoreColor = (score: number) => {
    if (score > 0.7) return '#ef4444'
    if (score > 0.4) return '#eab308'
    return '#22c55e'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPortal('landing')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              Fact-Checker Portal
            </h2>
            <p className="text-xs text-muted-foreground">Verify reports & fight misinformation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-orange-500/30 text-orange-400">
            {pendingReports.length} Pending Review
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 w-full grid grid-cols-3">
          <TabsTrigger value="review-queue">Review Queue</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="verified-reports">Verified Reports</TabsTrigger>
        </TabsList>

        {/* REVIEW QUEUE */}
        <TabsContent value="review-queue" className="space-y-4 mt-4">
          {pendingReports.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-sm text-muted-foreground">No reports pending review. Great work!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingReports.map((incident, i) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-4 hover:border-orange-500/20 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{typeEmojis[incident.type] || '⚠️'}</span>
                      <Badge variant="outline" className="text-[10px] font-semibold"
                        style={{ borderColor: severityColors[incident.severity], color: severityColors[incident.severity] }}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                      {incident.verificationStatus === 'under_review' && (
                        <Badge className="text-[10px] bg-orange-500/20 text-orange-400 border-orange-500/30">🔍 UNDER REVIEW</Badge>
                      )}
                    </div>
                  </div>

                  {/* Title & Location */}
                  <h4 className="text-sm font-semibold mb-1">{incident.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />{incident.area}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{incident.description}</p>

                  {/* AI Fake Score */}
                  <div className="mb-3 p-2 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground font-semibold">AI FAKE SCORE</span>
                      <span className="text-sm font-bold" style={{ color: getFakeScoreColor(incident.aiFakeScore || 0) }}>
                        {((incident.aiFakeScore || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${(incident.aiFakeScore || 0) * 100}%`,
                        backgroundColor: getFakeScoreColor(incident.aiFakeScore || 0),
                      }} />
                    </div>
                  </div>

                  {/* Credibility at report */}
                  <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    Reporter credibility: <span style={{ color: getCredibilityColor(incident.credibilityAtReport || 100) }}>{incident.credibilityAtReport || 100}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleVerify(incident.id, 'genuine')}
                      disabled={verifyingId === incident.id}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2"
                    >
                      {verifyingId === incident.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                      Verify Genuine
                    </Button>
                    <Button
                      onClick={() => handleVerify(incident.id, 'fake')}
                      disabled={verifyingId === incident.id}
                      variant="destructive"
                      className="flex-1 text-xs py-2"
                    >
                      {verifyingId === incident.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <XCircle className="w-3 h-3 mr-1" />}
                      Flag as Fake
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* AI ANALYSIS */}
        <TabsContent value="ai-analysis" className="space-y-4 mt-4">
          {/* Incident selector */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Select Incident for AI Analysis</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {localIncidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${selectedIncident?.id === incident.id ? 'border-orange-500/50 bg-orange-500/5' : 'border-border bg-secondary/20 hover:border-orange-500/20'}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{typeEmojis[incident.type]}</span>
                    <span className="text-sm font-medium flex-1 truncate">{incident.title}</span>
                    <Badge variant="outline" className="text-[10px]"
                      style={{ borderColor: severityColors[incident.severity], color: severityColors[incident.severity] }}>
                      {incident.severity}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Analysis Details */}
          {selectedIncident ? (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-500" /> AI Agent Analysis
              </h3>

              {/* Fake Score Highlight */}
              <div className="mb-4 p-4 rounded-lg border border-border bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">AI Fake Detection Score</span>
                  <span className="text-2xl font-bold" style={{ color: getFakeScoreColor(selectedIncident.aiFakeScore || 0) }}>
                    {((selectedIncident.aiFakeScore || 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{ backgroundColor: getFakeScoreColor(selectedIncident.aiFakeScore || 0) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(selectedIncident.aiFakeScore || 0) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {(selectedIncident.aiFakeScore || 0) > 0.7
                    ? '🔴 HIGH RISK: This report is likely fake or misleading. Human review required.'
                    : (selectedIncident.aiFakeScore || 0) > 0.4
                    ? '🟡 MODERATE RISK: Some suspicious indicators detected. Recommend human verification.'
                    : '🟢 LOW RISK: Report appears genuine based on AI analysis.'}
                </p>
              </div>

              {/* 6 Agent Outputs */}
              {selectedIncident.agentAnalysis ? (
                <div className="space-y-3">
                  {(() => {
                    try {
                      const analysis = JSON.parse(selectedIncident.agentAnalysis)
                      return Object.entries(analysis).map(([key, result], i) => {
                        const agent = useSahaayakStore.getState().agents.find(a => a.id === key)
                        return (
                          <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            className="p-3 rounded-lg border border-border bg-secondary/30">
                            <div className="flex items-center gap-2 mb-2">
                              <span>{agent?.emoji || '●'}</span>
                              <span className="font-semibold text-sm" style={{ color: agent?.color || '#94a3b8' }}>{agent?.name || key}</span>
                              <Badge variant="outline" className="text-[10px]">
                                {key === 'fake_detector' ? '🔴 Misinfo Detection' : key === 'report_intake' ? '📋 Classification' : key === 'situation_assessment' ? '📊 Assessment' : key === 'resource_allocation' ? '📦 Resources' : key === 'communication' ? '📢 Alerts' : '🎯 Summary'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{result as string}</p>
                          </motion.div>
                        )
                      })
                    } catch {
                      return <p className="text-sm text-muted-foreground">Analysis data not available</p>
                    }
                  })()}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No AI analysis available for this incident</p>
              )}

              {/* Priority Score */}
              <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">PRIORITY SCORE</span>
                  <span className="text-sm font-bold" style={{ color: (selectedIncident.priorityScore || 0.5) > 0.7 ? '#22c55e' : '#eab308' }}>
                    {((selectedIncident.priorityScore || 0.5) * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Based on severity × (1 - fakeScore×0.5) × (credibility/100)</p>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 text-center">
              <Eye className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Select an Incident</h3>
              <p className="text-sm text-muted-foreground">Choose an incident above to view detailed AI agent analysis</p>
            </div>
          )}
        </TabsContent>

        {/* VERIFIED REPORTS */}
        <TabsContent value="verified-reports" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or area..."
                className="bg-secondary/50 border-border pl-10"
              />
            </div>
            <div className="flex gap-1">
              {['all', 'genuine', 'fake', 'under_review', 'pending'].map((status) => (
                <Button key={status} variant={filterStatus === status ? 'default' : 'outline'} size="sm"
                  onClick={() => setFilterStatus(status)} className="text-xs">
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Reports list */}
          <div className="space-y-3">
            {verifiedReports.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              verifiedReports.map((incident, i) => (
                <motion.div key={incident.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{typeEmojis[incident.type] || '⚠️'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold truncate">{incident.title}</h4>
                        <Badge variant="outline" className="text-[10px] shrink-0"
                          style={{ borderColor: severityColors[incident.severity], color: severityColors[incident.severity] }}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{incident.area}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(incident.createdAt).toLocaleDateString()}</span>
                        {incident.aiFakeScore !== undefined && (
                          <span style={{ color: getFakeScoreColor(incident.aiFakeScore) }}>
                            AI: {(incident.aiFakeScore * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className="text-xs shrink-0"
                      style={{
                        backgroundColor: incident.verificationStatus === 'genuine' ? 'rgba(34,197,94,0.15)' : incident.verificationStatus === 'fake' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)',
                        color: incident.verificationStatus === 'genuine' ? '#22c55e' : incident.verificationStatus === 'fake' ? '#ef4444' : '#eab308',
                      }}>
                      {incident.verificationStatus === 'genuine' ? '✓ Genuine' : incident.verificationStatus === 'fake' ? '✗ Fake' : incident.verificationStatus === 'under_review' ? '🔍 Under Review' : '⏳ Pending'}
                    </Badge>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
