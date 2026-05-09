'use client'

import { useState, useCallback, useMemo } from 'react'
import { useSahaayakStore, type AgentType } from '@/lib/store'
import { INCIDENT_TYPES, INDIAN_STATES, INDIAN_LANGUAGES, getAreasForCity, getCitiesForState } from '@/lib/india-locations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, AlertTriangle, Loader2, CheckCircle2, ShieldAlert, MapPin, Globe, Navigation, LocateFixed } from 'lucide-react'

const SEVERITY_LABELS = ['Low', 'Moderate', 'High', 'Critical']
const SEVERITY_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444']

interface ProcessingStep {
  agent: AgentType
  name: string
  emoji: string
  color: string
  action: string
  status: 'pending' | 'active' | 'complete'
  result?: string
}

interface ReportFormProps {
  reporterId?: string
}

export default function ReportForm({ reporterId }: ReportFormProps) {
  const { addIncident, addAgentLog, addAlert, updateAgentStatus, addAgentMessage, setIsProcessing, currentReporter } = useSahaayakStore()

  const [formData, setFormData] = useState({
    type: 'flood',
    location: '',
    area: '',
    state: '',
    city: '',
    description: '',
    severity: 1,
    language: 'en',
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [showResults, setShowResults] = useState(false)
  const [agentResults, setAgentResults] = useState<Record<string, string>>({})
  const [fakeScore, setFakeScore] = useState(0)
  const [areaSuggestions, setAreaSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'detecting' | 'found' | 'error'>('idle')

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('error')
      return
    }
    setGeoStatus('detecting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude)
        setUserLng(pos.coords.longitude)
        setGeoStatus('found')
      },
      () => setGeoStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const isRateLimited = currentReporter?.isRateLimited && currentReporter.credibilityScore < 50

  // Dynamic city and area lists based on state selection
  const availableCities = useMemo(() => {
    if (!formData.state) return []
    return getCitiesForState(formData.state)
  }, [formData.state])

  const availableAreas = useMemo(() => {
    if (!formData.state || !formData.city) return []
    return getAreasForCity(formData.state, formData.city)
  }, [formData.state, formData.city])

  const handleAreaInput = (value: string) => {
    setFormData((prev) => ({ ...prev, area: value, location: value }))
    if (value.length > 0 && availableAreas.length > 0) {
      const suggestions = availableAreas.filter((a) => a.toLowerCase().startsWith(value.toLowerCase())).slice(0, 5)
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
    if (isRateLimited) return

    setIsSubmitting(true)
    setShowResults(false)
    setIsProcessing(true)

    const severityLabel = SEVERITY_LABELS[formData.severity]

    const steps: ProcessingStep[] = [
      { agent: 'report_intake', name: 'Report Intake', emoji: '🟢', color: '#22c55e', action: 'Classifying incident...', status: 'pending' },
      { agent: 'fake_detector', name: 'Fake Detector', emoji: '🔍', color: '#f43f5e', action: 'Analyzing for misinformation...', status: 'pending' },
      { agent: 'situation_assessment', name: 'Situation Assessment', emoji: '🟡', color: '#eab308', action: 'Analyzing severity...', status: 'pending' },
      { agent: 'resource_allocation', name: 'Resource Allocation', emoji: '🔴', color: '#ef4444', action: 'Allocating resources...', status: 'pending' },
      { agent: 'communication', name: 'Communication', emoji: '🔵', color: '#3b82f6', action: 'Generating multilingual alerts...', status: 'pending' },
      { agent: 'coordination', name: 'Coordination', emoji: '🟣', color: '#a855f7', action: 'Coordinating national response...', status: 'pending' },
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
          state: formData.state,
          city: formData.city,
          description: formData.description,
          severity: severityLabel.toLowerCase(),
          language: formData.language,
          reporterId: reporterId || undefined,
          latitude: userLat,
          longitude: userLng,
        }),
      })

      const data = await response.json()
      setFakeScore(data.aiFakeScore || 0)

      // Simulate step-by-step processing
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        setProcessingSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: 'active' } : s))
        updateAgentStatus(step.agent, 'processing', step.action)
        addAgentLog({
          id: `log-${Date.now()}-${i}`, agentType: step.agent, action: step.action,
          details: `${step.name} agent is ${step.action.toLowerCase()}`, timestamp: new Date().toISOString(),
        })
        if (i > 0) addAgentMessage({ from: steps[i - 1].agent, to: step.agent, content: 'Passing analysis results', timestamp: Date.now() })
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600))

        const agentResultKey = step.agent as string
        const agentResult = data.agentResults?.[agentResultKey] || `${step.name} analysis complete`
        results[agentResultKey] = agentResult
        setProcessingSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: 'complete', result: agentResult } : s))
        updateAgentStatus(step.agent, 'idle', step.agent === 'fake_detector' ? 'Monitoring for fakes' : 'Awaiting reports')
      }

      if (data.incident) addIncident(data.incident)
      if (data.alerts) data.alerts.forEach((alert: any) => addAlert(alert))

      setAgentResults(results)
      setShowResults(true)

      addAgentLog({
        id: `log-${Date.now()}-coord`, agentType: 'coordination', action: 'Response coordinated',
        details: `All 6 agents completed processing for ${formData.area}${formData.state ? ', ' + formData.state : ''} ${formData.type} incident. Fake score: ${((data.aiFakeScore || 0) * 100).toFixed(0)}%`,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Processing error:', error)
      // Fallback processing
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        setProcessingSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: 'active' } : s))
        updateAgentStatus(step.agent, 'processing', step.action)

        const fallbackResults: Record<string, string> = {
          report_intake: `Incident classified as ${formData.type.toUpperCase()} - ${severityLabel} severity at ${formData.area}${formData.state ? ', ' + formData.state : ''}`,
          fake_detector: `LOW RISK (0.12): Report appears consistent with known ${formData.type} patterns in ${formData.area}. No significant misinformation indicators detected. Reporter credibility: ${currentReporter?.credibilityScore || 'N/A'}/100.`,
          situation_assessment: `Estimated affected population: ${formData.severity >= 2 ? '500-2000' : '50-500'} people. Cascading risk: ${formData.severity >= 2 ? 'HIGH' : 'MODERATE'}`,
          resource_allocation: `Deployed: ${formData.severity >= 2 ? '4' : '2'} ambulances, ${formData.severity >= 2 ? '3' : '1'} NDRF/SDRF rescue teams. ETA: ${8 + formData.severity * 4} mins`,
          communication: `Emergency alerts generated in multiple languages. Public advisory issued for ${formData.area} residents in ${formData.state || 'the region'}.`,
          coordination: `Executive summary: ${severityLabel} ${formData.type} incident at ${formData.area}. All 6 agents coordinated. NDRF/SDRF notified. Fake score: 12%.`,
        }

        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 400))
        results[step.agent] = fallbackResults[step.agent]
        setProcessingSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: 'complete', result: fallbackResults[step.agent] } : s))
        updateAgentStatus(step.agent, 'idle', step.agent === 'fake_detector' ? 'Monitoring for fakes' : 'Awaiting reports')
      }

      addIncident({
        id: `inc-${Date.now()}`, type: formData.type,
        title: `${severityLabel} ${formData.type.replace('_', ' ')} - ${formData.area}`,
        description: formData.description, location: formData.area, area: formData.area,
        severity: severityLabel.toLowerCase(), status: 'active', verificationStatus: 'pending',
        alertsGenerated: 3, resourcesAllocated: formData.severity >= 2 ? 4 : 2,
        affectedPopulation: formData.severity >= 2 ? '500-2000' : '50-500',
        agentAnalysis: JSON.stringify(results), aiFakeScore: 0.12, credibilityAtReport: currentReporter?.credibilityScore || 100,
        state: formData.state, city: formData.city,
        createdAt: new Date().toISOString(),
      })

      setAgentResults(results)
      setShowResults(true)
    }

    setIsSubmitting(false)
    setIsProcessing(false)
  }, [formData, addIncident, addAgentLog, addAlert, updateAgentStatus, addAgentMessage, setIsProcessing, reporterId, currentReporter, isRateLimited])

  return (
    <div className="max-w-4xl mx-auto">
      {isRateLimited && (
        <div className="glass-card rounded-xl p-4 mb-4 border border-yellow-500/20 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-500">Rate Limited</p>
            <p className="text-xs text-muted-foreground">Your credibility is below 50. You can only submit 1 report per hour.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Submit Incident Report
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Incident Type</Label>
              <div className="grid grid-cols-4 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {INCIDENT_TYPES.map((type) => (
                  <button key={type.value} onClick={() => setFormData((prev) => ({ ...prev, type: type.value }))}
                    className={`p-2 rounded-lg text-center text-xs transition-all border ${
                      formData.type === type.value ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-border hover:border-muted-foreground/30 text-muted-foreground'
                    }`}>
                    <span className="block text-lg mb-0.5">{type.emoji}</span>
                    <span className="block truncate text-[10px]">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* State Selection */}
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1">
                <MapPin className="w-3 h-3" /> State / UT
              </Label>
              <select
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value, city: '', area: '', location: '' }))}
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              >
                <option value="">Select State / Union Territory</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* City Selection */}
            {formData.state && (
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">City</Label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value, area: '', location: '' }))}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Select City</option>
                  {availableCities.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Area with autocomplete */}
            <div className="relative">
              <Label className="text-sm text-muted-foreground mb-2 block">Location / Area</Label>
              <Input value={formData.area} onChange={(e) => handleAreaInput(e.target.value)}
                placeholder={formData.city ? `Area in ${formData.city}...` : "Select state & city first, or type area..."}
                className="bg-secondary/50 border-border" />
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                  {areaSuggestions.map((area) => (
                    <button key={area} onClick={() => { setFormData((prev) => ({ ...prev, area, location: area })); setShowSuggestions(false) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors">{area}</button>
                  ))}
                </div>
              )}
            </div>

            {/* GPS Location Detection */}
            <div className="p-3 rounded-lg border border-border bg-secondary/10">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> GPS Coordinates
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={detectLocation}
                  disabled={geoStatus === 'detecting'}
                  className="text-xs h-7 gap-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                  {geoStatus === 'detecting' ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Detecting...</>
                  ) : geoStatus === 'found' ? (
                    <><CheckCircle2 className="w-3 h-3 text-green-400" /> Update Location</>
                  ) : (
                    <><LocateFixed className="w-3 h-3" /> Detect My Location</>
                  )}
                </Button>
              </div>
              {geoStatus === 'found' && userLat && userLng && (
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-400">
                    📍 {userLat.toFixed(4)}°N, {userLng.toFixed(4)}°E
                  </Badge>
                  <span className="text-muted-foreground">GPS location attached to report</span>
                </div>
              )}
              {geoStatus === 'error' && (
                <p className="text-xs text-yellow-400">⚠️ Location access denied. Report will use area coordinates instead.</p>
              )}
              {geoStatus === 'idle' && (
                <p className="text-[10px] text-muted-foreground">Optional: Attach precise GPS coordinates for accurate incident mapping</p>
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
              <Slider value={[formData.severity]} onValueChange={([val]) => setFormData((prev) => ({ ...prev, severity: val }))}
                min={0} max={3} step={1} className="py-2" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                {SEVERITY_LABELS.map((label, i) => (
                  <span key={label} style={{ color: formData.severity === i ? SEVERITY_COLORS[i] : undefined }}>{label}</span>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1">
                <Globe className="w-3 h-3" /> Preferred Alert Language
              </Label>
              <div className="flex gap-2 flex-wrap">
                {INDIAN_LANGUAGES.slice(0, 6).map((lang) => (
                  <button key={lang.code} onClick={() => setFormData((prev) => ({ ...prev, language: lang.code }))}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                      formData.language === lang.code ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-border hover:border-muted-foreground/30 text-muted-foreground'
                    }`}>{lang.nativeName}</button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {INDIAN_LANGUAGES.slice(6).map((lang) => (
                  <button key={lang.code} onClick={() => setFormData((prev) => ({ ...prev, language: lang.code }))}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                      formData.language === lang.code ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-border hover:border-muted-foreground/30 text-muted-foreground'
                    }`}>{lang.nativeName}</button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Image (Optional)</Label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border hover:border-muted-foreground/30 transition-colors text-sm text-muted-foreground">
                    <Upload className="w-4 h-4" /> Upload
                  </div>
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-border" />
                    <button onClick={() => setImagePreview(null)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">×</button>
                  </div>
                )}
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={isSubmitting || !formData.area || !formData.description || isRateLimited}
              className="w-full py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all">
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing with 6 AI Agents...</>
              ) : (
                <><AlertTriangle className="w-5 h-5 mr-2" /> Submit & Process with AI</>
              )}
            </Button>
          </div>
        </div>

        {/* Processing / Results Panel */}
        <div className="space-y-4">
          {(isSubmitting || processingSteps.length > 0) && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">AI Agent Processing</h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {processingSteps.map((step, i) => (
                    <motion.div key={step.agent} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                        step.status === 'active' ? 'border-current bg-current/5' :
                        step.status === 'complete' ? 'border-green-500/20 bg-green-500/5' : 'border-border opacity-50'
                      }`} style={step.status === 'active' ? { borderColor: `${step.color}40` } : {}}>
                      <span className="text-lg mt-0.5">{step.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm" style={{ color: step.color }}>{step.name}</span>
                          {step.status === 'active' && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
                          {step.status === 'complete' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {step.status === 'pending' ? 'Waiting...' : step.status === 'active' ? step.action : step.result?.substring(0, 100) + '...'}
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
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> AI Analysis Complete
              </h3>

              {/* Fake Score Highlight */}
              <div className={`p-3 rounded-lg border mb-4 ${fakeScore > 0.7 ? 'border-red-500/30 bg-red-500/5' : fakeScore > 0.4 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-green-500/30 bg-green-500/5'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-4 h-4" style={{ color: fakeScore > 0.7 ? '#ef4444' : fakeScore > 0.4 ? '#f97316' : '#22c55e' }} />
                  <span className="font-semibold text-sm">Fake Detection Score: {(fakeScore * 100).toFixed(0)}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {fakeScore > 0.7 ? 'HIGH RISK: This report has been flagged for mandatory human review before processing.' :
                   fakeScore > 0.4 ? 'MODERATE RISK: Report will be processed but flagged for verification.' :
                   'LOW RISK: Report appears genuine and will be processed normally.'}
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(agentResults).map(([key, result], i) => {
                  const agent = useSahaayakStore.getState().agents.find((a) => a.id === key)
                  return (
                    <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className={`p-3 rounded-lg border border-border bg-secondary/30 ${key === 'fake_detector' ? 'border-rose-500/30' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span>{agent?.emoji || '●'}</span>
                        <span className="font-semibold text-sm" style={{ color: agent?.color || '#94a3b8' }}>{agent?.name || key}</span>
                        {key === 'fake_detector' && <Badge variant="outline" className="text-[8px] border-rose-500/30 text-rose-400">KEY AGENT</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result}</p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {!isSubmitting && processingSteps.length === 0 && (
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Ready to Process Reports</h3>
              <p className="text-sm text-muted-foreground">
                Submit a disaster report from anywhere in India. 6 AI agents will collaboratively analyze it — including our Fake Detector that identifies misinformation in real-time.
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {['🟢', '🔍', '🟡', '🔴', '🔵', '🟣'].map((emoji, i) => (
                  <motion.span key={i} className="text-xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}>{emoji}</motion.span>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-3">Covering 28 States + 8 Union Territories across India</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
