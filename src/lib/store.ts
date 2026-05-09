import { create } from 'zustand'

export type AgentType = 'report_intake' | 'fake_detector' | 'situation_assessment' | 'resource_allocation' | 'communication' | 'coordination'

export type AgentStatus = 'idle' | 'processing' | 'collaborating'

export type PortalType = 'landing' | 'citizen' | 'factchecker' | 'admin'

export interface AgentInfo {
  id: AgentType
  name: string
  emoji: string
  color: string
  glowClass: string
  status: AgentStatus
  currentAction: string
}

export interface ReporterData {
  id: string
  name: string
  phone: string
  avatar?: string
  credibilityScore: number
  totalReports: number
  verifiedReports: number
  fakeReports: number
  pendingReports: number
  role: string
  department?: string
  badges: string[]
  isRateLimited: boolean
}

export interface IncidentData {
  id: string
  type: string
  title: string
  description: string
  location: string
  area: string
  state?: string
  city?: string
  severity: string
  status: string
  verificationStatus: string
  alertsGenerated: number
  resourcesAllocated: number
  affectedPopulation?: string
  agentAnalysis?: string
  aiFakeScore: number
  credibilityAtReport: number
  priorityScore?: number
  reporterId?: string
  reporterName?: string
  reporterCredibility?: number
  latitude?: number | null
  longitude?: number | null
  createdAt: string
}

export interface AgentLogEntry {
  id: string
  agentType: AgentType
  action: string
  details: string
  incidentId?: string
  timestamp: string
}

export interface AlertData {
  id: string
  incidentId: string
  language: string
  type: string
  content: string
  createdAt: string
}

export interface AgentMessage {
  from: AgentType
  to: AgentType
  content: string
  timestamp: number
}

export interface AnalyticsData {
  totalIncidents: number
  verifiedIncidents: number
  fakeIncidents: number
  pendingIncidents: number
  underReviewIncidents: number
  totalReporters: number
  avgCredibility: number
  verificationRate: number
  fakeDetectionRate: number
  credibilityDistribution: { high: number; medium: number; low: number }
  typeBreakdown: Record<string, number>
  recentIncidents: IncidentData[]
  [key: string]: unknown
}

interface SahaayakState {
  agents: AgentInfo[]
  incidents: IncidentData[]
  agentLogs: AgentLogEntry[]
  alerts: AlertData[]
  agentMessages: AgentMessage[]
  isProcessing: boolean
  currentPortal: PortalType
  currentTab: string
  currentReporter: ReporterData | null
  allReporters: ReporterData[]
  analyticsData: AnalyticsData | null
  reporterReports: IncidentData[]
  // Location state for pan-India
  selectedState: string
  selectedCity: string
  stats: {
    activeIncidents: number
    agentsActive: number
    resourcesDeployed: number
    alertsSent: number
  }

  setCurrentPortal: (portal: PortalType) => void
  setCurrentTab: (tab: string) => void
  setAgents: (agents: AgentInfo[]) => void
  updateAgentStatus: (id: AgentType, status: AgentStatus, action: string) => void
  setIncidents: (incidents: IncidentData[]) => void
  addIncident: (incident: IncidentData) => void
  updateIncident: (id: string, updates: Partial<IncidentData>) => void
  updateIncidentInList: (id: string, updates: Partial<IncidentData>) => void
  addAgentLog: (log: AgentLogEntry) => void
  setAlerts: (alerts: AlertData[]) => void
  addAlert: (alert: AlertData) => void
  addAgentMessage: (message: AgentMessage) => void
  setIsProcessing: (val: boolean) => void
  setStats: (stats: Partial<SahaayakState['stats']>) => void
  setCurrentReporter: (reporter: ReporterData | null) => void
  setAllReporters: (reporters: ReporterData[]) => void
  updateReporterInList: (id: string, updates: Partial<ReporterData>) => void
  setAnalyticsData: (data: AnalyticsData | null) => void
  addReporterReport: (report: IncidentData) => void
  setReporterReports: (reports: IncidentData[]) => void
  setSelectedState: (state: string) => void
  setSelectedCity: (city: string) => void
}

const defaultAgents: AgentInfo[] = [
  { id: 'report_intake', name: 'Report Intake', emoji: '🟢', color: '#22c55e', glowClass: 'agent-glow-green', status: 'idle', currentAction: 'Awaiting reports' },
  { id: 'fake_detector', name: 'Fake Detector', emoji: '🔍', color: '#f43f5e', glowClass: 'agent-glow-rose', status: 'idle', currentAction: 'Monitoring for fakes' },
  { id: 'situation_assessment', name: 'Situation Assessment', emoji: '🟡', color: '#eab308', glowClass: 'agent-glow-yellow', status: 'idle', currentAction: 'Monitoring' },
  { id: 'resource_allocation', name: 'Resource Allocation', emoji: '🔴', color: '#ef4444', glowClass: 'agent-glow-red', status: 'idle', currentAction: 'Standing by' },
  { id: 'communication', name: 'Communication', emoji: '🔵', color: '#3b82f6', glowClass: 'agent-glow-blue', status: 'idle', currentAction: 'Ready' },
  { id: 'coordination', name: 'Coordination', emoji: '🟣', color: '#a855f7', glowClass: 'agent-glow-purple', status: 'idle', currentAction: 'Orchestrating' },
]

export const useSahaayakStore = create<SahaayakState>((set) => ({
  agents: defaultAgents,
  incidents: [],
  agentLogs: [],
  alerts: [],
  agentMessages: [],
  isProcessing: false,
  currentPortal: 'landing',
  currentTab: 'dashboard',
  currentReporter: null,
  allReporters: [],
  analyticsData: null,
  reporterReports: [],
  selectedState: '',
  selectedCity: '',
  stats: {
    activeIncidents: 0,
    agentsActive: 6,
    resourcesDeployed: 0,
    alertsSent: 0,
  },

  setCurrentPortal: (portal) => set({ currentPortal: portal, currentTab: portal === 'landing' ? 'dashboard' : portal === 'citizen' ? 'dashboard' : portal === 'factchecker' ? 'queue' : 'overview' }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setAgents: (agents) => set({ agents }),
  updateAgentStatus: (id, status, action) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, status, currentAction: action } : a)),
    })),
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) =>
    set((state) => ({
      incidents: [incident, ...state.incidents],
      stats: { ...state.stats, activeIncidents: state.stats.activeIncidents + 1 },
    })),
  updateIncident: (id, updates) =>
    set((state) => ({
      incidents: state.incidents.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
  // Alias for components that use this name
  updateIncidentInList: (id, updates) =>
    set((state) => ({
      incidents: state.incidents.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
  addAgentLog: (log) =>
    set((state) => ({ agentLogs: [log, ...state.agentLogs].slice(0, 100) })),
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      stats: { ...state.stats, alertsSent: state.stats.alertsSent + 1 },
    })),
  addAgentMessage: (message) =>
    set((state) => ({ agentMessages: [...state.agentMessages, message].slice(-50) })),
  setIsProcessing: (val) => set({ isProcessing: val }),
  setStats: (stats) =>
    set((state) => ({ stats: { ...state.stats, ...stats } })),
  setCurrentReporter: (reporter) => set({ currentReporter: reporter }),
  setAllReporters: (reporters) => set({ allReporters: reporters }),
  updateReporterInList: (id, updates) =>
    set((state) => ({
      allReporters: state.allReporters.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      // Also update currentReporter if it matches
      currentReporter: state.currentReporter?.id === id ? { ...state.currentReporter, ...updates } : state.currentReporter,
    })),
  setAnalyticsData: (data) => set({ analyticsData: data }),
  addReporterReport: (report) =>
    set((state) => ({
      reporterReports: state.reporterReports.some(r => r.id === report.id)
        ? state.reporterReports
        : [report, ...state.reporterReports],
    })),
  setReporterReports: (reports) => set({ reporterReports: reports }),
  setSelectedState: (selectedState) => set({ selectedState, selectedCity: '' }),
  setSelectedCity: (selectedCity) => set({ selectedCity }),
}))
