'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSahaayakStore, type IncidentData, type ReporterData } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Shield, Users, AlertTriangle, CheckCircle2, XCircle, BarChart3, TrendingUp, MapPin, Clock, Trash2, Eye, Search, RefreshCw, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line, CartesianGrid } from 'recharts'

const severityColors: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', moderate: '#eab308', low: '#22c55e',
}

const typeEmojis: Record<string, string> = {
  flood: '🌊', building_collapse: '🏗️', fire: '🔥', landslide: '⛰️',
  waterlogging: '💧', traffic_disaster: '🚗', cyclone: '🌀', other: '⚠️',
}

export default function AdminPortal() {
  const {
    setCurrentPortal,
    analyticsData,
    setAnalyticsData,
    allReporters,
    setAllReporters,
    incidents,
    setIncidents,
    updateIncidentInList,
  } = useSahaayakStore()

  const [activeTab, setActiveTab] = useState('admin-overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [credFilter, setCredFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Load analytics and reporters
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [analyticsRes, reportersRes, incidentsRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/reporters'),
          fetch('/api/incidents'),
        ])

        const analyticsJson = await analyticsRes.json()
        const reportersJson = await reportersRes.json()
        const incidentsJson = await incidentsRes.json()

        if (analyticsJson.totalIncidents !== undefined) setAnalyticsData(analyticsJson)
        if (reportersJson.reporters) setAllReporters(reportersJson.reporters)
        if (incidentsJson.incidents) setIncidents(incidentsJson.incidents)
      } catch (error) {
        console.error('Admin data load error:', error)
      }
      setLoading(false)
    }
    loadData()
  }, [setAnalyticsData, setAllReporters, setIncidents])

  const refreshData = async () => {
    setLoading(true)
    try {
      const [analyticsRes, reportersRes, incidentsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/reporters'),
        fetch('/api/incidents'),
      ])
      const analyticsJson = await analyticsRes.json()
      const reportersJson = await reportersRes.json()
      const incidentsJson = await incidentsRes.json()

      if (analyticsJson.totalIncidents !== undefined) setAnalyticsData(analyticsJson)
      if (reportersJson.reporters) setAllReporters(reportersJson.reporters)
      if (incidentsJson.incidents) setIncidents(incidentsJson.incidents)
    } catch (error) {
      console.error('Refresh error:', error)
    }
    setLoading(false)
  }

  const handleDeleteIncident = async (id: string) => {
    setDeletingId(id)
    try {
      await fetch(`/api/incidents/${id}`, { method: 'DELETE' })
      // Refresh data
      await refreshData()
    } catch (error) {
      console.error('Delete error:', error)
    }
    setDeletingId(null)
  }

  const handleOverrideStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: status, status: status === 'genuine' ? 'verified' : status === 'fake' ? 'fake' : 'active' }),
      })
      updateIncidentInList(id, { verificationStatus: status, status: status === 'genuine' ? 'verified' : status === 'fake' ? 'fake' : 'active' })
      await refreshData()
    } catch (error) {
      console.error('Override error:', error)
    }
  }

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return '#22c55e'
    if (score >= 50) return '#eab308'
    if (score >= 25) return '#f97316'
    return '#ef4444'
  }

  const filteredReporters = allReporters.filter(r => {
    if (credFilter === 'high' && r.credibilityScore < 80) return false
    if (credFilter === 'medium' && (r.credibilityScore < 50 || r.credibilityScore >= 80)) return false
    if (credFilter === 'low' && (r.credibilityScore < 25 || r.credibilityScore >= 50)) return false
    if (credFilter === 'verylow' && r.credibilityScore >= 25) return false
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.phone.includes(searchQuery)) return false
    return true
  })

  const stats = analyticsData || {
    totalIncidents: 0, totalReporters: 0, totalAlerts: 0,
    verifiedIncidents: 0, fakeIncidents: 0, pendingIncidents: 0, underReviewIncidents: 0,
    verificationRate: '0', fakeDetectionRate: '0',
    severityDistribution: { critical: 0, high: 0, moderate: 0, low: 0 },
    avgCredibility: 0,
    credibilityDistribution: { high: 0, medium: 0, low: 0, veryLow: 0 },
    incidentsByDay: {},
    typeDistribution: [],
  }

  const severityChartData = [
    { name: 'Critical', count: stats.severityDistribution.critical, fill: '#ef4444' },
    { name: 'High', count: stats.severityDistribution.high, fill: '#f97316' },
    { name: 'Moderate', count: stats.severityDistribution.moderate, fill: '#eab308' },
    { name: 'Low', count: stats.severityDistribution.low, fill: '#22c55e' },
  ]

  const credibilityChartData = [
    { name: 'High (80+)', count: stats.credibilityDistribution.high, fill: '#22c55e' },
    { name: 'Medium (50-79)', count: stats.credibilityDistribution.medium, fill: '#eab308' },
    { name: 'Low (25-49)', count: stats.credibilityDistribution.low, fill: '#f97316' },
    { name: 'Very Low (<25)', count: stats.credibilityDistribution.veryLow, fill: '#ef4444' },
  ]

  const timelineData = Object.entries(stats.incidentsByDay).map(([day, data]) => ({
    date: day.substring(5), // MM-DD
    total: data.total,
    genuine: data.genuine,
    fake: data.fake,
    pending: data.pending,
  }))

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
              <Shield className="w-5 h-5 text-purple-500" />
              Admin Portal
            </h2>
            <p className="text-xs text-muted-foreground">System analytics & management</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 w-full grid grid-cols-3">
          <TabsTrigger value="admin-overview">Overview</TabsTrigger>
          <TabsTrigger value="admin-reports">Reports</TabsTrigger>
          <TabsTrigger value="admin-users">Users</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="admin-overview" className="space-y-6 mt-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Reports', value: stats.totalIncidents, icon: <AlertTriangle className="w-5 h-5" />, color: '#ef4444' },
              { label: 'Verification Rate', value: `${stats.verificationRate}%`, icon: <CheckCircle2 className="w-5 h-5" />, color: '#22c55e' },
              { label: 'Fake Detection Rate', value: `${stats.fakeDetectionRate}%`, icon: <XCircle className="w-5 h-5" />, color: '#f97316' },
              { label: 'Avg Credibility', value: stats.avgCredibility, icon: <Shield className="w-5 h-5" />, color: '#3b82f6' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Verification Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Verified', value: stats.verifiedIncidents, color: '#22c55e' },
              { label: 'Fake', value: stats.fakeIncidents, color: '#ef4444' },
              { label: 'Pending', value: stats.pendingIncidents, color: '#eab308' },
              { label: 'Under Review', value: stats.underReviewIncidents, color: '#f97316' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Severity Distribution */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Severity Distribution</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityChartData}>
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {severityChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Credibility Distribution */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Credibility Distribution</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={credibilityChartData}>
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {credibilityChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Reports over time */}
          {timelineData.length > 0 && (
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Reports Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Total" />
                    <Line type="monotone" dataKey="genuine" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Genuine" />
                    <Line type="monotone" dataKey="fake" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Fake" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Type Distribution */}
          {stats.typeDistribution.length > 0 && (
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Incident Types</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.typeDistribution.map(t => ({
                    name: t.type.replace(/_/g, ' ').substring(0, 12),
                    count: t.count,
                  }))}>
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#a855f7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </TabsContent>

        {/* REPORTS MANAGEMENT */}
        <TabsContent value="admin-reports" className="space-y-4 mt-4">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">All Incidents</h3>
              <span className="text-xs text-muted-foreground">{incidents.length} total</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-secondary/80 backdrop-blur-sm">
                  <tr className="text-xs text-muted-foreground">
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Title</th>
                    <th className="text-left p-3 font-semibold">Area</th>
                    <th className="text-left p-3 font-semibold">Severity</th>
                    <th className="text-left p-3 font-semibold">AI Score</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                      <td className="p-3"><span className="text-lg">{typeEmojis[incident.type] || '⚠️'}</span></td>
                      <td className="p-3">
                        <p className="text-sm font-medium truncate max-w-[200px]">{incident.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{incident.description}</p>
                      </td>
                      <td className="p-3 text-xs">{incident.area}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[10px]"
                          style={{ borderColor: severityColors[incident.severity], color: severityColors[incident.severity] }}>
                          {incident.severity}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className="text-xs font-semibold" style={{ color: (incident.aiFakeScore || 0) > 0.7 ? '#ef4444' : (incident.aiFakeScore || 0) > 0.4 ? '#eab308' : '#22c55e' }}>
                          {((incident.aiFakeScore || 0) * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge className="text-[10px]"
                          style={{
                            backgroundColor: incident.verificationStatus === 'genuine' ? 'rgba(34,197,94,0.15)' : incident.verificationStatus === 'fake' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)',
                            color: incident.verificationStatus === 'genuine' ? '#22c55e' : incident.verificationStatus === 'fake' ? '#ef4444' : '#eab308',
                          }}>
                          {incident.verificationStatus || 'pending'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                            onClick={() => handleOverrideStatus(incident.id, 'genuine')} title="Mark Genuine">
                            <CheckCircle2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => handleOverrideStatus(incident.id, 'fake')} title="Mark Fake">
                            <XCircle className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => handleDeleteIncident(incident.id)} disabled={deletingId === incident.id} title="Delete">
                            {deletingId === incident.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* USERS */}
        <TabsContent value="admin-users" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or phone..." className="bg-secondary/50 border-border pl-10" />
            </div>
            <div className="flex gap-1">
              {['all', 'high', 'medium', 'low', 'verylow'].map((filter) => (
                <Button key={filter} variant={credFilter === filter ? 'default' : 'outline'} size="sm"
                  onClick={() => setCredFilter(filter)} className="text-xs">
                  {filter === 'all' ? 'All' : filter === 'verylow' ? 'Very Low' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Users list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReporters.map((reporter, i) => (
              <motion.div key={reporter.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{reporter.avatar || '👤'}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">{reporter.name}</h4>
                    <p className="text-xs text-muted-foreground">{reporter.phone}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]"
                    style={{ borderColor: getCredibilityColor(reporter.credibilityScore), color: getCredibilityColor(reporter.credibilityScore) }}>
                    {reporter.credibilityScore}
                  </Badge>
                </div>

                {/* Credibility bar */}
                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${reporter.credibilityScore}%`,
                    backgroundColor: getCredibilityColor(reporter.credibilityScore),
                  }} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div>
                    <div className="text-sm font-bold text-green-400">{reporter.verifiedReports}</div>
                    <div className="text-[10px] text-muted-foreground">Verified</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-red-400">{reporter.fakeReports}</div>
                    <div className="text-[10px] text-muted-foreground">Fake</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-yellow-400">{reporter.pendingReports}</div>
                    <div className="text-[10px] text-muted-foreground">Pending</div>
                  </div>
                </div>

                {/* Badges */}
                {reporter.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {reporter.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-[10px]">{badge}</Badge>
                    ))}
                  </div>
                )}

                {/* Status flags */}
                <div className="flex items-center gap-2 mt-2">
                  {reporter.isRateLimited && <Badge variant="destructive" className="text-[10px]">Rate Limited</Badge>}
                  {reporter.role === 'restricted' && <Badge className="text-[10px] bg-red-500/20 text-red-400">Restricted</Badge>}
                  {reporter.role === 'admin' && <Badge className="text-[10px] bg-purple-500/20 text-purple-400">Admin</Badge>}
                  {reporter.role === 'authority' && <Badge className="text-[10px] bg-blue-500/20 text-blue-400">Authority</Badge>}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredReporters.length === 0 && (
            <div className="glass-card rounded-xl p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
