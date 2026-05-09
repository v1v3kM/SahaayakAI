'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSahaayakStore, type PortalType, type IncidentData, type ReporterData } from '@/lib/store'
import Dashboard from '@/components/sahaayak/Dashboard'
import AgentNetwork from '@/components/sahaayak/AgentNetwork'
import ReportForm from '@/components/sahaayak/ReportForm'
import AlertsPanel from '@/components/sahaayak/AlertsPanel'
import ResourceCenter from '@/components/sahaayak/ResourceCenter'
import {
  Shield, Activity, FileText, Bell, Truck, Radio, Users, Search,
  Eye, UserCheck, BarChart3, ShieldCheck, AlertTriangle, CheckCircle2,
  XCircle, Clock, ArrowLeft, Star, TrendingUp, TrendingDown, Zap,
  ChevronRight, Globe, Trash2, ShieldAlert, BadgeCheck, UserX,
  MessageSquare, Send, Bot, Sparkles, RefreshCw, Database,
  AlertCircle, Loader2, Crown, Target, Brain, Layers, GitBranch
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// ============= LANDING PAGE =============
function LandingPage() {
  const { setCurrentPortal } = useSahaayakStore()

  const portals = [
    { id: 'citizen' as PortalType, icon: <Users className="w-8 h-8" />, title: 'Citizen Portal', desc: 'Report incidents, track credibility, earn badges', color: '#22c55e', gradient: 'from-green-600 to-emerald-600' },
    { id: 'factchecker' as PortalType, icon: <Search className="w-8 h-8" />, title: 'Fact-Checker Portal', desc: 'Verify reports, flag misinformation, protect the truth', color: '#f43f5e', gradient: 'from-rose-600 to-pink-600' },
    { id: 'admin' as PortalType, icon: <ShieldCheck className="w-8 h-8" />, title: 'Admin Portal', desc: 'System analytics, manage users, oversee operations', color: '#a855f7', gradient: 'from-purple-600 to-violet-600' },
  ]

  const agentDetails = [
    { name: 'Report Intake', emoji: '🟢', desc: 'Classifies & validates incoming reports' },
    { name: 'Fake Detector', emoji: '🔍', desc: 'AI-powered misinformation detection' },
    { name: 'Situation Assessment', emoji: '🟡', desc: 'Evaluates severity & cascading risks' },
    { name: 'Resource Allocation', emoji: '🔴', desc: 'Deploys emergency resources' },
    { name: 'Communication', emoji: '🔵', desc: 'Multilingual alert generation' },
    { name: 'Coordination', emoji: '🟣', desc: 'Orchestrates multi-agent response' },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <motion.div
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6"
          animate={{ boxShadow: ['0 0 20px rgba(59,130,246,0.3)', '0 0 40px rgba(59,130,246,0.5)', '0 0 20px rgba(59,130,246,0.3)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Shield className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">Sahaayak AI</h1>
        <p className="text-lg text-muted-foreground mb-1">सहायक · India&apos;s AI-Powered Citizen Safety Platform</p>
        <p className="text-sm text-muted-foreground/60 mb-2">6 Autonomous AI Agents · Credibility Scoring · Fake News Detection</p>
        <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
          <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">HackArena 2.0</Badge>
          <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">Generative & Agentic AI</Badge>
          <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400">28 States + 8 UTs</Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-8">
        {portals.map((portal, i) => (
          <motion.button
            key={portal.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            onClick={() => setCurrentPortal(portal.id)}
            className="glass-card rounded-2xl p-8 text-left hover:scale-[1.02] transition-all duration-300 group border border-border hover:border-transparent"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
              {portal.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{portal.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{portal.desc}</p>
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: portal.color }}>
              Enter Portal <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Agent Architecture Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="w-full max-w-4xl">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> 6-Agent Agentic Architecture
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {agentDetails.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30 border border-border/50"
              >
                <span className="text-lg">{agent.emoji}</span>
                <div>
                  <p className="text-xs font-semibold">{agent.name}</p>
                  <p className="text-[10px] text-muted-foreground">{agent.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 text-center">
        <div className="flex justify-center gap-3 mb-3">
          {['🟢', '🔍', '🟡', '🔴', '🔵', '🟣'].map((emoji, i) => (
            <motion.span key={i} className="text-xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}>
              {emoji}
            </motion.span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">6 AI Agents Active · Monitoring All India · 28 States + 8 Union Territories</p>
      </motion.div>
    </div>
  )
}

// ============= CREDIBILITY SCORE CIRCLE =============
function CredibilityCircle({ score, size = 120 }: { score: number; size?: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'
  const isSmall = size <= 50
  const strokeW = isSmall ? 3 : 6
  const radius = (size - strokeW * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(148,163,184,0.15)" strokeWidth={strokeW} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeW} fill="none"
          strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${isSmall ? 'text-xs' : 'text-2xl'} font-bold leading-none`} style={{ color }}>{score}</span>
        {!isSmall && <span className="text-[10px] text-muted-foreground">CREDIBILITY</span>}
      </div>
    </div>
  )
}

// ============= AI CHAT ASSISTANT =============
function AIChatAssistant({ incidentContext }: { incidentContext?: string }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hello! I am the Sahaayak AI Assistant. I can help you understand reports, verify information, or answer questions about the platform. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isThinking) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsThinking(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context: incidentContext }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'I apologize, I could not process that request. Please try again.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered a technical issue. The AI service may be temporarily unavailable. Please try again in a moment.' }])
    }
    setIsThinking(false)
  }, [input, isThinking, incidentContext])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="glass-card rounded-xl flex flex-col h-[500px]">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold">Sahaayak AI Assistant</p>
          <p className="text-[10px] text-muted-foreground">Powered by Generative AI</p>
        </div>
        <Badge variant="outline" className="ml-auto text-[10px] border-blue-500/30 text-blue-400">
          <Sparkles className="w-3 h-3 mr-1" /> GEN AI
        </Badge>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user'
              ? 'bg-blue-600/20 border border-blue-500/20 text-foreground'
              : 'bg-secondary/50 border border-border text-foreground'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1 mb-1">
                  <Bot className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-medium">Sahaayak AI</span>
                </div>
              )}
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-secondary/50 border border-border p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about reports, fact-checking, credibility..." className="bg-secondary/50 text-sm" />
          <Button onClick={sendMessage} disabled={!input.trim() || isThinking} size="icon"
            className="bg-gradient-to-r from-blue-600 to-purple-600 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============= LIVE FACT-CHECK FEED =============
function LiveFactCheckFeed({ incidents }: { incidents: IncidentData[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sortedIncidents = [...incidents].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
  })

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
        <Activity className="w-4 h-4" /> Live Fact-Check Feed
      </h3>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {sortedIncidents.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No reports yet. Submit a report to see live fact-checking in action.
          </div>
        ) : (
          sortedIncidents.map(incident => {
            const fakeScore = incident.aiFakeScore || 0
            const fakeColor = fakeScore > 0.7 ? '#ef4444' : fakeScore > 0.4 ? '#f97316' : '#22c55e'
            const isExpanded = expandedId === incident.id
            return (
              <motion.div key={incident.id} layout
                className={`p-3 rounded-lg border bg-secondary/20 cursor-pointer transition-all ${fakeScore > 0.7 ? 'border-red-500/20' : 'border-border'}`}
                onClick={() => setExpandedId(isExpanded ? null : incident.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: fakeColor }} />
                    <span className="text-xs font-medium truncate">{incident.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Badge variant="outline" className="text-[9px]" style={{ borderColor: fakeColor, color: fakeColor }}>
                      {(fakeScore * 100).toFixed(0)}% fake
                    </Badge>
                    <Badge variant="outline" className="text-[9px]"
                      style={{ borderColor: incident.verificationStatus === 'genuine' ? '#22c55e' : incident.verificationStatus === 'fake' ? '#ef4444' : '#eab308',
                        color: incident.verificationStatus === 'genuine' ? '#22c55e' : incident.verificationStatus === 'fake' ? '#ef4444' : '#eab308' }}>
                      {incident.verificationStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                    <p className="text-xs text-muted-foreground mb-2">{incident.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>{incident.area}</span>
                      <span>·</span>
                      <span>Severity: {incident.severity}</span>
                      <span>·</span>
                      <span>{new Date(incident.createdAt).toLocaleString()}</span>
                    </div>
                    {incident.agentAnalysis && (() => {
                      try {
                        const analysis = JSON.parse(incident.agentAnalysis)
                        return (
                          <div className="mt-2 p-2 rounded-lg bg-secondary/30 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground/70 mb-1">AI Fake Detector Analysis:</p>
                            <p className="line-clamp-3">{analysis.fake_detector || 'No analysis available'}</p>
                          </div>
                        )
                      } catch { return null }
                    })()}
                  </motion.div>
                )}
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ============= CITIZEN PORTAL =============
function CitizenPortal() {
  const { currentTab, setCurrentTab, currentReporter, incidents, setCurrentPortal } = useSahaayakStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const store = useSahaayakStore()

  const citizenTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'report', label: 'Submit Report', icon: <FileText className="w-4 h-4" /> },
    { id: 'agents', label: 'Agent Network', icon: <Radio className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <Truck className="w-4 h-4" /> },
    { id: 'feed', label: 'Live Feed', icon: <Eye className="w-4 h-4" /> },
    { id: 'ai-chat', label: 'AI Assistant', icon: <Bot className="w-4 h-4" /> },
    { id: 'profile', label: 'My Profile', icon: <Users className="w-4 h-4" /> },
  ]

  const handleLogin = async () => {
    if (!phone) return
    setLoggingIn(true)
    try {
      const res = await fetch('/api/reporters', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'Citizen', phone, role: 'citizen' }),
      })
      const data = await res.json()
      if (data.reporter) {
        const badges = typeof data.reporter.badges === 'string' ? JSON.parse(data.reporter.badges) : data.reporter.badges || []
        store.setCurrentReporter({ ...data.reporter, badges })
      }
    } catch (e) { console.error(e) }
    setLoggingIn(false)
  }

  if (!currentReporter) {
    const demoAccounts = [
      { name: 'Rajesh Kumar', phone: '9876543210', score: 95, badge: '🛡️', role: 'Trusted Reporter' },
      { name: 'Priya Sharma', phone: '9876543211', score: 78, badge: '⭐', role: 'Active Citizen' },
      { name: 'Amit Patel', phone: '9876543212', score: 45, badge: '⚠️', role: 'Rate Limited' },
      { name: 'Kavitha Nair', phone: '9876543214', score: 88, badge: '🏆', role: 'Community Hero' },
    ]

    const handleQuickLogin = async (demoName: string, demoPhone: string) => {
      setName(demoName)
      setPhone(demoPhone)
      setLoggingIn(true)
      try {
        const res = await fetch('/api/reporters', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: demoName, phone: demoPhone, role: 'citizen' }),
        })
        const data = await res.json()
        if (data.reporter) {
          const badges = typeof data.reporter.badges === 'string' ? JSON.parse(data.reporter.badges) : data.reporter.badges || []
          store.setCurrentReporter({ ...data.reporter, badges })
        }
      } catch (e) { console.error(e) }
      setLoggingIn(false)
    }

    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mx-auto mb-4 text-white">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">Citizen Login</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter your details or pick a demo account</p>
          </div>

          {/* Quick Demo Login Buttons */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">One-Click Demo Login</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <motion.button
                  key={acc.phone}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickLogin(acc.name, acc.phone)}
                  disabled={loggingIn}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/50 hover:border-green-500/40 transition-all text-left group disabled:opacity-50"
                >
                  <span className="text-xl">{acc.badge}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{acc.name}</div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: acc.score >= 80 ? '#22c55e' : acc.score >= 60 ? '#eab308' : '#ef4444' }}
                      />
                      <span className="text-[10px] text-muted-foreground truncate">{acc.score} · {acc.role}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </motion.button>
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
              <label className="text-sm text-muted-foreground mb-1 block">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="bg-secondary/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Phone Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" className="bg-secondary/50" />
            </div>
            <Button onClick={handleLogin} disabled={!phone || loggingIn} className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
              {loggingIn ? 'Logging in...' : 'Enter Portal'}
            </Button>
          </div>
        </div>
        <Button variant="ghost" onClick={() => setCurrentPortal('landing')} className="mt-4 mx-auto flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Portal Selection
        </Button>
      </div>
    )
  }

  const myReports = incidents.filter(i => i.reporterId === currentReporter.id)

  return (
    <div>
      <div className="glass-card rounded-xl p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { store.setCurrentReporter(null); setCurrentPortal('landing') }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
              {currentReporter.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{currentReporter.name}</p>
              <p className="text-[10px] text-muted-foreground">Credibility: {currentReporter.credibilityScore}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CredibilityCircle score={currentReporter.credibilityScore} size={40} />
          {currentReporter.isRateLimited && <Badge variant="outline" className="text-[10px] border-yellow-500/30 text-yellow-400">RATE LIMITED</Badge>}
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto pb-2 mb-4">
        {citizenTabs.map(tab => (
          <button key={tab.id} onClick={() => setCurrentTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              currentTab === tab.id ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div key={currentTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {currentTab === 'dashboard' && <CitizenDashboard reports={myReports} reporter={currentReporter} />}
          {currentTab === 'report' && <ReportForm reporterId={currentReporter.id} />}
          {currentTab === 'agents' && <AgentNetwork />}
          {currentTab === 'alerts' && <AlertsPanel />}
          {currentTab === 'resources' && <ResourceCenter />}
          {currentTab === 'feed' && <LiveFactCheckFeed incidents={incidents} />}
          {currentTab === 'ai-chat' && <AIChatAssistant incidentContext={`Current reporter: ${currentReporter.name}, Credibility: ${currentReporter.credibilityScore}, Total Reports: ${currentReporter.totalReports}`} />}
          {currentTab === 'profile' && <CitizenProfile reporter={currentReporter} reports={myReports} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function CitizenDashboard({ reports, reporter }: { reports: IncidentData[]; reporter: ReporterData }) {
  const { incidents } = useSahaayakStore()
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-6 flex flex-col items-center">
          <CredibilityCircle score={reporter.credibilityScore} size={120} />
          <p className="text-sm font-semibold mt-3">
            {reporter.credibilityScore >= 80 ? 'Trusted Reporter' : reporter.credibilityScore >= 50 ? 'Active Reporter' : 'Under Review'}
          </p>
          <div className="flex gap-1 mt-2 flex-wrap justify-center">
            {reporter.badges.map((badge: string) => (
              <Badge key={badge} variant="outline" className="text-[10px] border-green-500/30 text-green-400">
                <Star className="w-3 h-3 mr-1" />{badge}
              </Badge>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Reports', value: reporter.totalReports, icon: <FileText className="w-4 h-4" />, color: '#3b82f6' },
            { label: 'Verified', value: reporter.verifiedReports, icon: <CheckCircle2 className="w-4 h-4" />, color: '#22c55e' },
            { label: 'Fake', value: reporter.fakeReports, icon: <XCircle className="w-4 h-4" />, color: '#ef4444' },
            { label: 'Pending', value: reporter.pendingReports, icon: <Clock className="w-4 h-4" />, color: '#eab308' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1" style={{ color: stat.color }}>{stat.icon}</div>
              <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Credibility Rules</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-green-500" /> Verified genuine: +5 points</div>
            <div className="flex items-center gap-2"><TrendingDown className="w-3 h-3 text-red-500" /> Flagged fake: -15 points</div>
            <div className="flex items-center gap-2"><ShieldAlert className="w-3 h-3 text-yellow-500" /> Below 50: Rate limited</div>
            <div className="flex items-center gap-2"><UserX className="w-3 h-3 text-orange-500" /> Below 25: Reports need approval</div>
            <div className="flex items-center gap-2"><BadgeCheck className="w-3 h-3 text-blue-500" /> 80+: Trusted Reporter badge</div>
          </div>
        </div>
      </div>
      <Dashboard />
      {incidents.length > 0 && <LiveFactCheckFeed incidents={incidents} />}
    </div>
  )
}

function CitizenProfile({ reporter, reports }: { reporter: ReporterData; reports: IncidentData[] }) {
  const verified = reports.filter(r => r.verificationStatus === 'genuine').length
  const fake = reports.filter(r => r.verificationStatus === 'fake').length
  const chartData = [
    { name: 'Verified', value: verified, fill: '#22c55e' },
    { name: 'Fake', value: fake, fill: '#ef4444' },
    { name: 'Pending', value: Math.max(0, reporter.totalReports - verified - fake), fill: '#eab308' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card rounded-xl p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
          {reporter.name.charAt(0)}
        </div>
        <h2 className="text-xl font-bold">{reporter.name}</h2>
        <p className="text-sm text-muted-foreground">{reporter.phone}</p>
        <div className="flex justify-center mt-3">
          <CredibilityCircle score={reporter.credibilityScore} size={100} />
        </div>
        <div className="flex gap-2 justify-center mt-3 flex-wrap">
          {reporter.badges.map((badge: string) => (
            <Badge key={badge} variant="outline" className="border-green-500/30 text-green-400">
              <Star className="w-3 h-3 mr-1" />{badge}
            </Badge>
          ))}
          {reporter.badges.length === 0 && <span className="text-xs text-muted-foreground">No badges yet. Keep reporting accurately!</span>}
        </div>
      </div>

      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Report Outcomes</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {reporter.isRateLimited && (
        <div className="glass-card rounded-xl p-4 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-yellow-500">Rate Limited</h3>
          </div>
          <p className="text-sm text-muted-foreground">Your credibility score is below 50. You can only submit 1 report per hour. Submit verified, accurate reports to restore your credibility.</p>
        </div>
      )}
    </div>
  )
}

// ============= FACT-CHECKER PORTAL =============
function FactCheckerPortal() {
  const { currentTab, setCurrentTab, incidents, setCurrentPortal, updateIncident, currentReporter } = useSahaayakStore()
  const [verifying, setVerifying] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('pending')
  const [searchQuery, setSearchQuery] = useState('')

  const fcTabs = [
    { id: 'queue', label: 'Review Queue', icon: <Eye className="w-4 h-4" /> },
    { id: 'feed', label: 'Live Feed', icon: <Activity className="w-4 h-4" /> },
    { id: 'agents', label: 'Agent Network', icon: <Radio className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'ai-chat', label: 'AI Assistant', icon: <Bot className="w-4 h-4" /> },
    { id: 'verified', label: 'All Reports', icon: <CheckCircle2 className="w-4 h-4" /> },
  ]

  const handleVerify = async (incidentId: string, verdict: 'genuine' | 'fake') => {
    setVerifying(incidentId)
    try {
      const res = await fetch(`/api/incidents/${incidentId}/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verdict, verifierId: currentReporter?.id || 'fc-demo', verifierRole: 'authority', notes: `Verified by fact-checker as ${verdict}` }),
      })
      const data = await res.json()
      if (data.success) {
        updateIncident(incidentId, {
          verificationStatus: verdict === 'genuine' ? 'genuine' : 'fake',
          status: verdict === 'genuine' ? 'verified' : 'fake',
        })
        // Refresh incidents from DB
        const incRes = await fetch('/api/incidents')
        const incData = await incRes.json()
        if (incData.incidents) {
          useSahaayakStore.getState().setIncidents(incData.incidents)
        }
        // Refresh reporter data if logged in
        if (currentReporter?.id) {
          const repRes = await fetch(`/api/reporters/${currentReporter.id}`)
          const repData = await repRes.json()
          if (repData.reporter) {
            const badges = typeof repData.reporter.badges === 'string' ? JSON.parse(repData.reporter.badges) : repData.reporter.badges || []
            useSahaayakStore.getState().setCurrentReporter({ ...repData.reporter, badges })
          }
        }
      }
    } catch (e) { console.error(e) }
    setVerifying(null)
  }

  const filteredIncidents = incidents.filter(i => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'pending') return i.verificationStatus === 'pending' || i.verificationStatus === 'under_review'
    return i.verificationStatus === filterStatus
  }).filter(i => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return i.title.toLowerCase().includes(q) || i.area.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
  })

  const pendingCount = incidents.filter(i => i.verificationStatus === 'pending' || i.verificationStatus === 'under_review').length

  return (
    <div>
      <div className="glass-card rounded-xl p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPortal('landing')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Fact-Checker Portal</p>
            <p className="text-[10px] text-muted-foreground">{pendingCount} reports pending review</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-rose-500/30 text-rose-400">
            <ShieldCheck className="w-3 h-3 mr-1" /> AUTHORITY
          </Badge>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto pb-2 mb-4">
        {fcTabs.map(tab => (
          <button key={tab.id} onClick={() => setCurrentTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              currentTab === tab.id ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent'
            }`}>
            {tab.icon} {tab.label}
            {tab.id === 'queue' && pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px]">{pendingCount}</span>
            )}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div key={currentTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {currentTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap items-center">
                <div className="flex gap-2 flex-1 min-w-[200px]">
                  <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search reports by title, area, description..." className="bg-secondary/50 text-sm" />
                </div>
                {['all', 'pending', 'under_review', 'genuine', 'fake'].map(s => (
                  <Button key={s} variant={filterStatus === s ? 'default' : 'outline'} size="sm"
                    onClick={() => setFilterStatus(s)} className="text-xs">
                    {s === 'under_review' ? 'Under Review' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </Button>
                ))}
              </div>

              {filteredIncidents.length === 0 ? (
                <div className="glass-card rounded-xl p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold">All Clear!</h3>
                  <p className="text-sm text-muted-foreground">No reports matching this filter.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredIncidents.map(incident => {
                    const fakeScore = incident.aiFakeScore || 0
                    const fakeColor = fakeScore > 0.7 ? '#ef4444' : fakeScore > 0.4 ? '#f97316' : '#22c55e'
                    const isUnderReview = incident.verificationStatus === 'under_review'
                    return (
                      <motion.div key={incident.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`glass-card rounded-xl p-4 ${isUnderReview ? 'border border-rose-500/30' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-[10px]"
                                style={{ borderColor: fakeColor, color: fakeColor }}>
                                AI Score: {(fakeScore * 100).toFixed(0)}%
                              </Badge>
                              {isUnderReview && <Badge variant="outline" className="text-[10px] border-rose-500/30 text-rose-400">HIGH RISK</Badge>}
                              <Badge variant="outline" className="text-[10px]"
                                style={{ borderColor: incident.severity === 'critical' ? '#ef4444' : incident.severity === 'high' ? '#f97316' : '#eab308', color: incident.severity === 'critical' ? '#ef4444' : incident.severity === 'high' ? '#f97316' : '#eab308' }}>
                                {incident.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <h4 className="text-sm font-semibold">{incident.title}</h4>
                            <p className="text-xs text-muted-foreground">{incident.location || incident.area} · Reporter: {incident.reporterName || 'Unknown'} · Credibility: {incident.credibilityAtReport}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px]"
                            style={{ borderColor: incident.verificationStatus === 'genuine' ? '#22c55e' : incident.verificationStatus === 'fake' ? '#ef4444' : '#eab308', color: incident.verificationStatus === 'genuine' ? '#22c55e' : incident.verificationStatus === 'fake' ? '#ef4444' : '#eab308' }}>
                            {incident.verificationStatus.toUpperCase().replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{incident.description}</p>

                        {incident.agentAnalysis && (
                          <div className="mb-3 p-2 rounded-lg bg-secondary/20 text-xs">
                            <p className="font-medium text-foreground/60 mb-1 flex items-center gap-1"><Brain className="w-3 h-3" /> AI Analysis:</p>
                            <p className="text-muted-foreground line-clamp-3">
                              {(() => {
                                try {
                                  const analysis = JSON.parse(incident.agentAnalysis)
                                  return analysis.fake_detector || 'No fake detection analysis available.'
                                } catch { return incident.agentAnalysis?.substring(0, 200) }
                              })()}
                            </p>
                          </div>
                        )}

                        <div className="mb-3">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground">AI Fake Score</span>
                            <span style={{ color: fakeColor }}>{(fakeScore * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${fakeScore * 100}%`, backgroundColor: fakeColor }} />
                          </div>
                        </div>

                        {(incident.verificationStatus === 'pending' || incident.verificationStatus === 'under_review') && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleVerify(incident.id, 'genuine')} disabled={verifying === incident.id}
                              className="bg-green-600 hover:bg-green-500 text-white flex-1">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Verify Genuine (+5 cred)
                            </Button>
                            <Button size="sm" onClick={() => handleVerify(incident.id, 'fake')} disabled={verifying === incident.id}
                              className="bg-red-600 hover:bg-red-500 text-white flex-1">
                              <XCircle className="w-3 h-3 mr-1" /> Flag Fake (-15 cred)
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
          {currentTab === 'feed' && <LiveFactCheckFeed incidents={incidents} />}
          {currentTab === 'agents' && <AgentNetwork />}
          {currentTab === 'alerts' && <AlertsPanel />}
          {currentTab === 'ai-chat' && <AIChatAssistant incidentContext={`Fact-checker reviewing ${incidents.length} incidents. ${pendingCount} pending review.`} />}
          {currentTab === 'verified' && (
            <div className="space-y-3">
              {incidents.map(i => (
                <div key={i.id} className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold">{i.title}</h4>
                      <p className="text-xs text-muted-foreground">{i.location || i.area} · {new Date(i.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]"
                      style={{ borderColor: i.verificationStatus === 'genuine' ? '#22c55e' : i.verificationStatus === 'fake' ? '#ef4444' : '#eab308', color: i.verificationStatus === 'genuine' ? '#22c55e' : i.verificationStatus === 'fake' ? '#ef4444' : '#eab308' }}>
                      {i.verificationStatus.toUpperCase().replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ============= ADMIN PORTAL =============
function AdminPortal() {
  const { currentTab, setCurrentTab, incidents, setCurrentPortal, allReporters, setAllReporters, analyticsData, setAnalyticsData } = useSahaayakStore()

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'agents', label: 'Agent Network', icon: <Radio className="w-4 h-4" /> },
    { id: 'reports', label: 'All Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'ai-chat', label: 'AI Assistant', icon: <Bot className="w-4 h-4" /> },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, reportersRes] = await Promise.all([fetch('/api/analytics'), fetch('/api/reporters')])
        const analyticsDataRes = await analyticsRes.json()
        const reportersDataRes = await reportersRes.json()
        if (analyticsDataRes.analytics) setAnalyticsData(analyticsDataRes.analytics)
        if (reportersDataRes.reporters) {
          setAllReporters(reportersDataRes.reporters.map((r: any) => ({
            ...r, badges: typeof r.badges === 'string' ? JSON.parse(r.badges) : r.badges || []
          })))
        }
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [setAnalyticsData, setAllReporters])

  const analytics = analyticsData

  return (
    <div>
      <div className="glass-card rounded-xl p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPortal('landing')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Admin Portal</p>
            <p className="text-[10px] text-muted-foreground">System Management & Analytics</p>
          </div>
        </div>
        <Badge variant="outline" className="border-purple-500/30 text-purple-400">
          <Crown className="w-3 h-3 mr-1" /> ADMIN
        </Badge>
      </div>

      <nav className="flex gap-1 overflow-x-auto pb-2 mb-4">
        {adminTabs.map(tab => (
          <button key={tab.id} onClick={() => setCurrentTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              currentTab === tab.id ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div key={currentTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {currentTab === 'overview' && analytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total Reports', value: analytics.totalIncidents, color: '#3b82f6', icon: <FileText className="w-5 h-5" /> },
                  { label: 'Verification Rate', value: `${analytics.verificationRate}%`, color: '#22c55e', icon: <CheckCircle2 className="w-5 h-5" /> },
                  { label: 'Fake Detection Rate', value: `${analytics.fakeDetectionRate}%`, color: '#ef4444', icon: <ShieldAlert className="w-5 h-5" /> },
                  { label: 'Avg Credibility', value: analytics.avgCredibility, color: '#eab308', icon: <Star className="w-5 h-5" /> },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                      <span style={{ color: stat.color }}>{stat.icon}</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Incident Types</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(analytics.typeBreakdown).map(([name, value]) => ({ name: name.replace('_', ' '), value }))}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Credibility Distribution</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'High (80+)', value: analytics.credibilityDistribution.high, fill: '#22c55e' },
                            { name: 'Medium (50-79)', value: analytics.credibilityDistribution.medium, fill: '#eab308' },
                            { name: 'Low (<50)', value: analytics.credibilityDistribution.low, fill: '#ef4444' },
                          ]}
                          dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {[
                            { fill: '#22c55e' },
                            { fill: '#eab308' },
                            { fill: '#ef4444' },
                          ].map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Verification Status</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Pending', value: analytics.pendingIncidents, color: '#eab308' },
                    { label: 'Genuine', value: analytics.verifiedIncidents, color: '#22c55e' },
                    { label: 'Fake', value: analytics.fakeIncidents, color: '#ef4444' },
                    { label: 'Under Review', value: analytics.underReviewIncidents, color: '#f97316' },
                  ].map(s => (
                    <div key={s.label} className="text-center p-3 rounded-lg bg-secondary/20">
                      <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'agents' && <AgentNetwork />}

          {currentTab === 'reports' && (
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">All Reports</h3>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-xs text-muted-foreground">Title</th>
                      <th className="text-left py-2 text-xs text-muted-foreground">Location</th>
                      <th className="text-left py-2 text-xs text-muted-foreground">Severity</th>
                      <th className="text-left py-2 text-xs text-muted-foreground">AI Fake</th>
                      <th className="text-left py-2 text-xs text-muted-foreground">Status</th>
                      <th className="text-left py-2 text-xs text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map(i => (
                      <tr key={i.id} className="border-b border-border/50">
                        <td className="py-2 text-xs max-w-[200px] truncate">{i.title}</td>
                        <td className="py-2 text-xs text-muted-foreground max-w-[150px] truncate">{i.location || i.area}</td>
                        <td className="py-2 text-xs"><Badge variant="outline" className="text-[9px]"
                          style={{ borderColor: i.severity === 'critical' ? '#ef4444' : i.severity === 'high' ? '#f97316' : '#eab308', color: i.severity === 'critical' ? '#ef4444' : i.severity === 'high' ? '#f97316' : '#eab308' }}>
                          {i.severity.toUpperCase()}</Badge></td>
                        <td className="py-2 text-xs" style={{ color: i.aiFakeScore > 0.7 ? '#ef4444' : i.aiFakeScore > 0.4 ? '#f97316' : '#22c55e' }}>
                          {(i.aiFakeScore * 100).toFixed(0)}%
                        </td>
                        <td className="py-2 text-xs">
                          <Badge variant="outline" className="text-[9px]"
                            style={{ borderColor: i.verificationStatus === 'genuine' ? '#22c55e' : i.verificationStatus === 'fake' ? '#ef4444' : '#eab308', color: i.verificationStatus === 'genuine' ? '#22c55e' : i.verificationStatus === 'fake' ? '#ef4444' : '#eab308' }}>
                            {i.verificationStatus.toUpperCase().replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-2">
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                            onClick={async () => {
                              try {
                                await fetch(`/api/incidents/${i.id}`, { method: 'DELETE' })
                                useSahaayakStore.getState().setIncidents(incidents.filter(inc => inc.id !== i.id))
                              } catch (e) { console.error(e) }
                            }}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentTab === 'users' && (
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">User Management</h3>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {allReporters.map((reporter) => (
                  <div key={reporter.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {reporter.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{reporter.name}</p>
                        <p className="text-[10px] text-muted-foreground">{reporter.phone} · {reporter.role}</p>
                        <div className="flex gap-1 mt-1">
                          {reporter.badges.map((badge: string) => (
                            <Badge key={badge} variant="outline" className="text-[8px] py-0 border-green-500/20 text-green-400">
                              <Star className="w-2 h-2 mr-0.5" />{badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: reporter.credibilityScore >= 80 ? '#22c55e' : reporter.credibilityScore >= 50 ? '#eab308' : '#ef4444' }}>
                          {reporter.credibilityScore}
                        </div>
                        <div className="text-[9px] text-muted-foreground">CREDIBILITY</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-foreground">{reporter.totalReports}</div>
                        <div className="text-[9px] text-muted-foreground">REPORTS</div>
                      </div>
                      {reporter.isRateLimited && <Badge variant="outline" className="text-[9px] border-yellow-500/30 text-yellow-400">RATE LIMITED</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'ai-chat' && <AIChatAssistant incidentContext={`Admin viewing system with ${analytics?.totalIncidents || 0} incidents, ${analytics?.totalReporters || 0} reporters.`} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ============= MAIN PAGE =============
export default function HomePage() {
  const { currentPortal, setIncidents, setAlerts } = useSahaayakStore()
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load data from DB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Seed if needed
        await fetch('/api/seed', { method: 'POST' })

        // Load incidents
        const incRes = await fetch('/api/incidents')
        const incData = await incRes.json()
        if (incData.incidents) {
          setIncidents(incData.incidents)
          // Sync stats with loaded data
          const active = incData.incidents.filter((i: any) => i.status === 'active' || i.status === 'monitoring').length
          const totalResources = incData.incidents.reduce((sum: number, i: any) => sum + (i.resourcesAllocated || 0), 0)
          const totalAlerts = incData.incidents.reduce((sum: number, i: any) => sum + (i.alertsGenerated || 0), 0)
          useSahaayakStore.getState().setStats({
            activeIncidents: active,
            resourcesDeployed: totalResources,
            alertsSent: totalAlerts,
          })
        }

        // Load alerts
        const alertRes = await fetch('/api/alerts')
        const alertData = await alertRes.json()
        if (alertData.alerts) setAlerts(alertData.alerts)

        setInitialized(true)
      } catch (e) {
        console.error('Data load error:', e)
        setInitialized(true)
      }
      setLoading(false)
    }
    loadData()
  }, [setIncidents, setAlerts])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center mb-4"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>
        <p className="text-sm text-muted-foreground">Initializing Sahaayak AI...</p>
        <div className="flex gap-2 mt-3">
          {['🟢', '🔍', '🟡', '🔴', '🔵', '🟣'].map((emoji, i) => (
            <motion.span key={i} className="text-sm" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}>
              {emoji}
            </motion.span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        {currentPortal === 'landing' && <LandingPage key="landing" />}
        {currentPortal === 'citizen' && <CitizenPortal key="citizen" />}
        {currentPortal === 'factchecker' && <FactCheckerPortal key="factchecker" />}
        {currentPortal === 'admin' && <AdminPortal key="admin" />}
      </AnimatePresence>
    </div>
  )
}
