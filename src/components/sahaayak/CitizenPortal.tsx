'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSahaayakStore, type AgentType } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, AlertTriangle, Loader2, CheckCircle2, Shield, Award, TrendingUp, Clock, MapPin, Phone, User, ArrowLeft, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const INCIDENT_TYPES = [
  { value: 'flood', label: 'Flood', emoji: '🌊' },
  { value: 'building_collapse', label: 'Building Collapse', emoji: '🏗️' },
  { value: 'fire', label: 'Fire', emoji: '🔥' },
  { value: 'landslide', label: 'Landslide', emoji: '⛰️' },
  { value: 'waterlogging', label: 'Waterlogging', emoji: '💧' },
  { value: 'traffic_disaster', label: 'Traffic Disaster', emoji: '🚗' },
  { value: 'cyclone', label: 'Cyclone', emoji: '🌀' },
  { value: 'other', label: 'Other', emoji: '⚠️' },
]

const MUMBAI_AREAS = [
  'Andheri', 'Bandra', 'Borivali', 'Colaba', 'Dadar', 'Goregaon',
  'Kurla', 'Lower Parel', 'Mulund', 'Thane', 'Worli', 'BKC',
  'Juhu', 'Versova', 'Malad', 'Kandivali', 'Vikhroli', 'Ghatkopar',
  'Chembur', 'Govandi', 'Mankhurd', 'Byculla', 'Parel', 'Matunga',
]

const SEVERITY_LABELS = ['Low', 'Moderate', 'High', 'Critical']
const SEVERITY_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444']

const typeEmojis: Record<string, string> = {
  flood: '🌊', building_collapse: '🏗️', fire: '🔥', landslide: '⛰️',
  waterlogging: '💧', traffic_disaster: '🚗', cyclone: '🌀', other: '⚠️',
}

const severityColors: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', moderate: '#eab308', low: '#22c55e',
}

interface ProcessingStep {
  agent: AgentType
  name: string
  emoji: string
  color: string
  action: string
  status: 'pending' | 'active' | 'complete'
  result?: string
}

export default function CitizenPortal() {
  const {
    currentReporter,
    setCurrentReporter,
    reporterReports,
    addIncident,
    addAgentLog,
    addAlert,
    updateAgentStatus,
    addAgentMessage,
    setIsProcessing,
    addReporterReport,
    updateReporterInList,
    setCurrentPortal,
  } = useSahaayakStore()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [formData, setFormData] = useState({
    type: 'flood', location: '', area: '', description: '', severity: 1, language: 'en',
  })
  const [reporterPhone, setReporterPhone] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [showResults, setShowResults] = useState(false)
  const [agentResults, setAgentResults] = useState<Record<string, string>>({})
  const [aiFakeScore, setAiFakeScore] = useState(0)
  const [areaSuggestions, setAreaSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Register/login reporter
  const handleRegister = useCallback(async () => {
    if (!reporterPhone) return
    setIsRegistering(true)
    try {
      const res = await fetch('/api/reporters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: reporterPhone, name: reporterName || undefined }),
      })
      const data = await res.json()
      if (data.reporter) {
        setCurrentReporter(data.reporter)
      }
    } catch (error) {
      console.error('Register error:', error)
    }
    setIsRegistering(false)
  }, [reporterPhone, reporterName, setCurrentReporter])

  // Load reporter reports
  useEffect(() => {
    if (currentReporter) {
      fetch(`/api/reporters/${currentReporter.id}/reports`)
        .then(res => res.json())
        .then(data => {
          if (data.incidents) {
            data.incidents.forEach((inc: Parameters<typeof addReporterReport>[0]) => addReporterReport(inc))
          }
        })
        .catch(console.error)
    }
  }, [currentReporter, addReporterReport])

  const handleAreaInput = (value: string) => {
    setFormData((prev) => ({ ...prev, area: value, location: value }))
    if (value.length > 0) {
      const suggestions = MUMBAI_AREAS.filter((a) => a.toLowerCase().startsWith(value.toLowerCase())).slice(0, 5)
      setAreaSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!formData.area || !formData.description) return
    setIsSubmitting(true)
    setShowResults(false)
    setIsProcessing(true)

    const severityLabel = SEVERITY_LABELS[formData.severity]
    const steps: ProcessingStep[] = [
      { agent: 'report_intake', name: 'Report Intake', emoji: '🟢', color: '#22c55e', action: 'Classifying incident...', status: 'pending' },
      { agent: 'fake_detector', name: 'Fake Detector', emoji: '🔴', color: '#f43f5e', action: 'Scanning for misinformation...', status: 'pending' },
      { agent: 'situation_assessment', name: 'Situation Assessment', emoji: '🟡', color: '#eab308', action: 'Analyzing severity...', status: 'pending' },
      { agent: 'resource_allocation', name: 'Resource Allocation', emoji: '🔴', color: '#ef4444', action: 'Allocating resources...', status: 'pending' },
      { agent: 'communication', name: 'Communication', emoji: '🔵', color: '#3b82f6', action: 'Generating alerts...', status: 'pending' },
      { agent: 'coordination', name: 'Coordination', emoji: '🟣', color: '#a855f7', action: 'Coordinating response...', status: 'pending' },
    ]
    setProcessingSteps(steps)
    const results: Record<string, string> = {}

    try {
      const response = await fetch('/api/agents/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          location: formData.area,
          area: formData.area,
          description: formData.description,
          severity: severityLabel.toLowerCase(),
          language: formData.language,
          reporterId: currentReporter?.id || null,
        }),
      })

      const data = await response.json()

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        setProcessingSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: 'active' } : s))
        updateAgentStatus(step.agent, 'processing', step.action)
        addAgentLog({
          id: `log-${Date.now()}-${i}`,
          agentType: step.agent,
          action: step.action,
          details: `${step.name} agent is ${step.action.toLowerCase()}`,
          timestamp: new Date().toISOString(),
        })
        if (i > 0) {
          addAgentMessage({ from: steps[i - 1].agent, to: step.agent, content: 'Passing analysis results', timestamp: Date.now() })
        }
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600))
        const agentResultKey = step.agent as string
        const agentResult = data.agentResults?.[agentResultKey] || `${step.name} analysis complete`
        results[agentResultKey] = agentResult
        setProcessingSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: 'complete', result: agentResult } : s))
        updateAgentStatus(step.agent, 'idle', step.agent === 'fake_detector' ? 'Scanning for misinformation' : 'Awaiting reports')
      }

      if (data.incident) {
        addIncident(data.incident)
        addReporterReport(data.incident)
      }
      if (data.alerts) {
        data.alerts.forEach((alert: { id: string; incidentId: string; language: string; type: string; content: string; createdAt: string }) => addAlert(alert))
      }

      setAgentResults(results)
      setAiFakeScore(data.aiFakeScore || 0)
      setShowResults(true)

      // Update reporter credibility in local state if returned
      if (currentReporter) {
        // Refresh reporter data from backend
        const reporterRes = await fetch(`/api/reporters/${currentReporter.id}/reports`)
        if (reporterRes.ok) {
          // Just update the current reporter state with latest
          setCurrentReporter({ ...currentReporter, pendingReports: currentReporter.pendingReports + 1, totalReports: currentReporter.totalReports + 1 })
        }
      }

      addAgentLog({
        id: `log-${Date.now()}-coord`,
        agentType: 'coordination',
        action: 'Response coordinated',
        details: `All 6 agents completed processing for ${formData.area} ${formData.type} incident. Fake score: ${(data.aiFakeScore || 0).toFixed(2)}`,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Processing error:', error)
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        setProcessingSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: 'complete', result: `${step.name} completed (fallback)` } : s))
      }
      setAgentResults(results)
      setShowResults(true)
    }

    setIsSubmitting(false)
    setIsProcessing(false)
  }, [formData, currentReporter, addIncident, addAgentLog, addAlert, updateAgentStatus, addAgentMessage, setIsProcessing, addReporterReport, setCurrentReporter])

  // Credibility color
  const getCredibilityColor = (score: number) => {
    if (score >= 80) return '#22c55e'
    if (score >= 50) return '#eab308'
    if (score >= 25) return '#f97316'
    return '#ef4444'
  }

  // Badge icons
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Trusted Reporter': return '🛡️'
      case 'Community Hero': return '🏆'
      case 'Verified Source': return '✅'
      default: return '🎖️'
    }
  }

  // If not logged in, show registration
  if (!currentReporter) {
    const demoAccounts = [
      { name: 'Rajesh Kumar', phone: '9876543210', score: 95, badge: '🛡️', role: 'Trusted Reporter' },
      { name: 'Priya Sharma', phone: '9876543211', score: 78, badge: '⭐', role: 'Active Citizen' },
      { name: 'Amit Patel', phone: '9876543212', score: 45, badge: '⚠️', role: 'Rate Limited' },
      { name: 'Kavitha Nair', phone: '9876543214', score: 88, badge: '🏆', role: 'Community Hero' },
    ]

    const handleQuickLogin = async (name: string, phone: string) => {
      setReporterName(name)
      setReporterPhone(phone)
      setIsRegistering(true)
      try {
        const res = await fetch('/api/reporters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, name }),
        })
        const data = await res.json()
        if (data.reporter) setCurrentReporter(data.reporter)
      } catch (error) {
        console.error('Quick login error:', error)
      }
      setIsRegistering(false)
    }

    return (
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1">Welcome, Citizen</h2>
            <p className="text-sm text-muted-foreground">Register or login to start reporting incidents</p>
          </div>

          {/* Quick Demo Login */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quick Demo Login</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.phone}
                  onClick={() => handleQuickLogin(acc.name, acc.phone)}
                  disabled={isRegistering}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-green-500/40 transition-all text-left group disabled:opacity-50"
                >
                  <span className="text-lg">{acc.badge}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{acc.name}</div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: acc.score >= 80 ? '#22c55e' : acc.score >= 60 ? '#eab308' : '#ef4444' }}
                      />
                      <span className="text-[10px] text-muted-foreground">{acc.score} · {acc.role}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] text-muted-foreground">or enter manually</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="bg-secondary/50 border-border pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Name (Optional)</Label>
              <Input
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Enter your name"
                className="bg-secondary/50 border-border"
              />
            </div>
            <Button
              onClick={handleRegister}
              disabled={isRegistering || !reporterPhone}
              className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
            >
              {isRegistering ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Shield className="w-5 h-5 mr-2" />}
              {isRegistering ? 'Logging in...' : 'Enter Citizen Portal'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Your credibility starts at 100. Report genuine incidents to build trust.
          </p>
        </motion.div>
      </div>
    )
  }

  const verifiedCount = reporterReports.filter(r => r.verificationStatus === 'genuine').length
  const fakeCount = reporterReports.filter(r => r.verificationStatus === 'fake').length
  const pendingCount = reporterReports.filter(r => r.verificationStatus === 'pending' || r.verificationStatus === 'under_review').length
  const credibilityColor = getCredibilityColor(currentReporter.credibilityScore)

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
              <span className="text-2xl">{currentReporter.avatar || '👤'}</span>
              {currentReporter.name}
            </h2>
            <p className="text-xs text-muted-foreground">Citizen Portal · {currentReporter.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" style={{ borderColor: credibilityColor, color: credibilityColor }}>
            Credibility: {currentReporter.credibilityScore}
          </Badge>
          {currentReporter.isRateLimited && (
            <Badge variant="destructive" className="text-xs">Rate Limited</Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 w-full grid grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="report">Submit Report</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        {/* CITIZEN DASHBOARD */}
        <TabsContent value="dashboard" className="space-y-6 mt-4">
          {/* Credibility + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Credibility Score */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-xl p-6 text-center">
              <h4 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-4">Credibility Score</h4>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={credibilityColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(currentReporter.credibilityScore / 100) * 251.3} 251.3`}
                    initial={{ strokeDasharray: '0 251.3' }}
                    animate={{ strokeDasharray: `${(currentReporter.credibilityScore / 100) * 251.3} 251.3` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: credibilityColor }}>{currentReporter.credibilityScore}</span>
                  <span className="text-[10px] text-muted-foreground">/ 100</span>
                </div>
              </div>
              {currentReporter.credibilityScore < 50 && (
                <p className="text-xs text-orange-400">⚠️ Below 50: Rate limited (1 report/hr)</p>
              )}
              {currentReporter.credibilityScore < 25 && (
                <p className="text-xs text-red-400">🔴 Below 25: Reports need pre-approval</p>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6">
              <h4 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-4">Report Statistics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Reports</span>
                  <span className="text-lg font-bold">{currentReporter.totalReports}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Verified</span>
                  <span className="text-lg font-bold text-green-400">{verifiedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500" /> Flagged Fake</span>
                  <span className="text-lg font-bold text-red-400">{fakeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3 text-yellow-500" /> Pending</span>
                  <span className="text-lg font-bold text-yellow-400">{pendingCount}</span>
                </div>
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-6">
              <h4 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-4 flex items-center gap-1"><Award className="w-3 h-3" /> Badges</h4>
              {currentReporter.badges.length > 0 ? (
                <div className="space-y-3">
                  {currentReporter.badges.map((badge) => (
                    <div key={badge} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                      <span className="text-2xl">{getBadgeIcon(badge)}</span>
                      <div>
                        <p className="text-sm font-semibold">{badge}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {badge === 'Verified Source' ? 'Credibility 95+' : badge === 'Community Hero' ? 'Credibility 90+' : 'Credibility 80+'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No badges yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Reach 80+ credibility for Trusted Reporter badge</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* My Reports */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> My Reports
            </h3>
            <div className="max-h-72 overflow-y-auto">
              {reporterReports.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No reports yet. Submit your first report!
                </div>
              ) : (
                <div className="space-y-2">
                  {reporterReports.slice(0, 10).map((report, i) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/20"
                    >
                      <span className="text-lg">{typeEmojis[report.type] || '⚠️'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{report.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />{report.area}
                          <Clock className="w-3 h-3 ml-1" />{new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px]"
                        style={{
                          borderColor: report.verificationStatus === 'genuine' ? '#22c55e' : report.verificationStatus === 'fake' ? '#ef4444' : '#eab308',
                          color: report.verificationStatus === 'genuine' ? '#22c55e' : report.verificationStatus === 'fake' ? '#ef4444' : '#eab308',
                        }}
                      >
                        {report.verificationStatus === 'genuine' ? '✓ Verified' : report.verificationStatus === 'fake' ? '✗ Fake' : report.verificationStatus === 'under_review' ? '🔍 Review' : '⏳ Pending'}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* SUBMIT REPORT */}
        <TabsContent value="report" className="mt-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Submit Incident Report
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Incident Type</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {INCIDENT_TYPES.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setFormData((prev) => ({ ...prev, type: type.value }))}
                          className={`p-2 rounded-lg text-center text-xs transition-all border ${formData.type === type.value ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-border hover:border-muted-foreground/30 text-muted-foreground'}`}
                        >
                          <span className="block text-lg mb-0.5">{type.emoji}</span>
                          <span className="block truncate">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <Label className="text-sm text-muted-foreground mb-2 block">Location / Area</Label>
                    <Input value={formData.area} onChange={(e) => handleAreaInput(e.target.value)} placeholder="e.g., Andheri, Bandra..." className="bg-secondary/50 border-border" />
                    {showSuggestions && (
                      <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                        {areaSuggestions.map((area) => (
                          <button key={area} onClick={() => { setFormData((prev) => ({ ...prev, area, location: area })); setShowSuggestions(false) }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors">{area}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Description</Label>
                    <Textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the incident in detail..." className="bg-secondary/50 border-border min-h-[100px]" />
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Severity: <span style={{ color: SEVERITY_COLORS[formData.severity] }}>{SEVERITY_LABELS[formData.severity]}</span>
                    </Label>
                    <Slider value={[formData.severity]} onValueChange={([val]) => setFormData((prev) => ({ ...prev, severity: val }))} min={0} max={3} step={1} className="py-2" />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      {SEVERITY_LABELS.map((label, i) => (
                        <span key={label} style={{ color: formData.severity === i ? SEVERITY_COLORS[i] : undefined }}>{label}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Alert Language</Label>
                    <div className="flex gap-2">
                      {[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिन्दी' }, { value: 'mr', label: 'मराठी' }].map((lang) => (
                        <button key={lang.value} onClick={() => setFormData((prev) => ({ ...prev, language: lang.value }))}
                          className={`px-4 py-2 rounded-lg text-sm transition-all border ${formData.language === lang.value ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-border hover:border-muted-foreground/30 text-muted-foreground'}`}>
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Image (Optional)</Label>
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border hover:border-muted-foreground/30 text-sm text-muted-foreground">
                        <Upload className="w-4 h-4" /> Upload
                      </div>
                    </label>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover mt-2 border border-border" />}
                  </div>

                  <Button onClick={handleSubmit} disabled={isSubmitting || !formData.area || !formData.description}
                    className="w-full py-6 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all">
                    {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing with AI Agents...</> :
                      <><AlertTriangle className="w-5 h-5 mr-2" />Submit & Process with AI</>}
                  </Button>
                </div>
              </div>

              {/* Processing / Results */}
              <div className="space-y-4">
                {(isSubmitting || processingSteps.length > 0) && (
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">AI Agent Processing</h3>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {processingSteps.map((step, i) => (
                          <motion.div key={step.agent} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${step.status === 'active' ? 'border-current bg-current/5' : step.status === 'complete' ? 'border-green-500/20 bg-green-500/5' : 'border-border opacity-50'}`}
                            style={step.status === 'active' ? { borderColor: `${step.color}40` } : {}}>
                            <span className="text-lg mt-0.5">{step.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm" style={{ color: step.color }}>{step.name}</span>
                                {step.status === 'active' && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
                                {step.status === 'complete' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {step.status === 'pending' ? 'Waiting...' : step.status === 'active' ? step.action : step.result?.substring(0, 80) + '...'}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {showResults && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" /> AI Analysis Complete
                    </h3>

                    {/* Fake Score Indicator */}
                    <div className="mb-4 p-3 rounded-lg border border-border bg-secondary/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">AI Fake Detection Score</span>
                        <span className="text-lg font-bold" style={{ color: aiFakeScore > 0.7 ? '#ef4444' : aiFakeScore > 0.4 ? '#eab308' : '#22c55e' }}>
                          {(aiFakeScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: aiFakeScore > 0.7 ? '#ef4444' : aiFakeScore > 0.4 ? '#eab308' : '#22c55e' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${aiFakeScore * 100}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {aiFakeScore > 0.7 ? '🔴 High risk - Flagged for human review' : aiFakeScore > 0.4 ? '🟡 Moderate risk - Needs review' : '🟢 Low risk - Appears genuine'}
                      </p>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {Object.entries(agentResults).map(([key, result], i) => {
                        const agent = useSahaayakStore.getState().agents.find((a) => a.id === key)
                        return (
                          <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            className="p-3 rounded-lg border border-border bg-secondary/30">
                            <div className="flex items-center gap-2 mb-1">
                              <span>{agent?.emoji}</span>
                              <span className="font-semibold text-sm" style={{ color: agent?.color }}>{agent?.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{result}</p>
                          </motion.div>
                        )
                      })}
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-xs text-green-400 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Your report is being verified by AI agents. Your credibility score may change based on the outcome.
                      </p>
                    </div>
                  </motion.div>
                )}

                {!isSubmitting && processingSteps.length === 0 && (
                  <div className="glass-card rounded-xl p-8 text-center">
                    <div className="text-4xl mb-3">🛡️</div>
                    <h3 className="text-lg font-semibold mb-2">Ready to Process Reports</h3>
                    <p className="text-sm text-muted-foreground">
                      Submit a disaster report and watch as 6 AI agents collaborate to analyze, detect fakes, assess situations, allocate resources, generate alerts, and coordinate response.
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                      {['🟢', '🔴', '🟡', '🔴', '🔵', '🟣'].map((emoji, i) => (
                        <motion.span key={i} className="text-xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}>{emoji}</motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* MY PROFILE */}
        <TabsContent value="profile" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Credibility History Chart */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Credibility History
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reporterReports.slice(0, 10).reverse().map((r, i) => ({
                    name: r.type.substring(0, 8),
                    credibility: r.credibilityAtReport || currentReporter.credibilityScore,
                    color: r.verificationStatus === 'genuine' ? '#22c55e' : r.verificationStatus === 'fake' ? '#ef4444' : '#eab308',
                  }))}>
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '8px', fontSize: '12px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="credibility" radius={[4, 4, 0, 0]}>
                      {reporterReports.slice(0, 10).reverse().map((r, i) => (
                        <Cell key={i} fill={r.verificationStatus === 'genuine' ? '#22c55e' : r.verificationStatus === 'fake' ? '#ef4444' : '#eab308'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">Credibility at time of each report</p>
            </div>

            {/* Report Outcomes */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Report Outcomes</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Genuine', count: verifiedCount, fill: '#22c55e' },
                    { name: 'Fake', count: fakeCount, fill: '#ef4444' },
                    { name: 'Pending', count: pendingCount, fill: '#eab308' },
                  ]}>
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {[
                        { name: 'Genuine', count: verifiedCount, fill: '#22c55e' },
                        { name: 'Fake', count: fakeCount, fill: '#ef4444' },
                        { name: 'Pending', count: pendingCount, fill: '#eab308' },
                      ].map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Report History */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Report History</h3>
            <div className="max-h-96 overflow-y-auto">
              {reporterReports.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">No reports yet.</div>
              ) : (
                <div className="space-y-2">
                  {reporterReports.map((report, i) => (
                    <div key={report.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/20">
                      <span className="text-lg">{typeEmojis[report.type] || '⚠️'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{report.title}</p>
                        <p className="text-xs text-muted-foreground">{report.area} · {new Date(report.createdAt).toLocaleString()}</p>
                        {report.aiFakeScore !== undefined && (
                          <p className="text-xs text-muted-foreground">AI Fake Score: {(report.aiFakeScore * 100).toFixed(0)}%</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-[10px]"
                          style={{ borderColor: report.verificationStatus === 'genuine' ? '#22c55e' : report.verificationStatus === 'fake' ? '#ef4444' : '#eab308', color: report.verificationStatus === 'genuine' ? '#22c55e' : report.verificationStatus === 'fake' ? '#ef4444' : '#eab308' }}>
                          {report.verificationStatus || 'pending'}
                        </Badge>
                        {report.credibilityAtReport !== undefined && (
                          <span className="text-[10px] text-muted-foreground">Cred: {report.credibilityAtReport}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Low credibility warning */}
          {currentReporter.credibilityScore < 50 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 border-orange-500/30 bg-orange-500/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-400">Credibility Warning</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your credibility score is {currentReporter.credibilityScore}. {currentReporter.credibilityScore < 25
                      ? 'Your reports now require pre-approval before being processed. Build trust by providing accurate information.'
                      : 'You are rate-limited to 1 report per hour. Submit verified, accurate reports to increase your score.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
