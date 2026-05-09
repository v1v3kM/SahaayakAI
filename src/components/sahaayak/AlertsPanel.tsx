'use client'

import { motion } from 'framer-motion'
import { useSahaayakStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Globe, FileText, Volume2 } from 'lucide-react'
import { useState } from 'react'

const LANG_FLAGS: Record<string, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇬🇧' },
  hi: { label: 'हिन्दी', flag: '🇮🇳' },
  mr: { label: 'मराठी', flag: '🏳️' },
}

const ALERT_TYPE_ICONS: Record<string, React.ReactNode> = {
  emergency_alert: <Bell className="w-4 h-4" />,
  public_advisory: <Volume2 className="w-4 h-4" />,
  media_brief: <FileText className="w-4 h-4" />,
}

export default function AlertsPanel() {
  const { alerts, incidents } = useSahaayakStore()
  const [generating, setGenerating] = useState(false)
  const [filterLang, setFilterLang] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const filteredAlerts = alerts.filter((alert) => {
    if (filterLang !== 'all' && alert.language !== filterLang) return false
    if (filterType !== 'all' && alert.type !== filterType) return false
    return true
  })

  const handleGenerateAlert = async () => {
    if (incidents.length === 0) return
    setGenerating(true)

    try {
      const latestIncident = incidents[0]
      const response = await fetch('/api/agents/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: latestIncident.id,
          incidentType: latestIncident.type,
          location: latestIncident.area,
          severity: latestIncident.severity,
          description: latestIncident.description,
        }),
      })

      const data = await response.json()
      if (data.alerts) {
        data.alerts.forEach((alert: { id: string; incidentId: string; language: string; type: string; content: string; createdAt: string }) => {
          useSahaayakStore.getState().addAlert(alert)
        })
      }
    } catch (error) {
      console.error('Alert generation error:', error)
      // Generate fallback alerts
      const latestIncident = incidents[0]
      const fallbackAlerts = [
        {
          id: `alert-${Date.now()}-en`,
          incidentId: latestIncident.id,
          language: 'en',
          type: 'emergency_alert',
          content: `⚠️ EMERGENCY ALERT: ${latestIncident.severity.toUpperCase()} ${latestIncident.type.replace('_', ' ')} reported at ${latestIncident.area}. Residents are advised to stay indoors and follow emergency protocols. Avoid the affected area. Emergency services have been deployed.`,
          createdAt: new Date().toISOString(),
        },
        {
          id: `alert-${Date.now()}-hi`,
          incidentId: latestIncident.id,
          language: 'hi',
          type: 'public_advisory',
          content: `⚠️ आपातकालीन अलर्ट: ${latestIncident.area} में ${latestIncident.type.replace('_', ' ')} की सूचना। निवासियों से अनुरोध है कि वे घर में रहें और आपातकालीन प्रोटोकॉल का पालन करें। प्रभावित क्षेत्र से बचें। आपातकालीन सेवाएं तैनात की गई हैं।`,
          createdAt: new Date().toISOString(),
        },
        {
          id: `alert-${Date.now()}-mr`,
          incidentId: latestIncident.id,
          language: 'mr',
          type: 'public_advisory',
          content: `⚠️ आपत्कालीन इशारा: ${latestIncident.area} मध्ये ${latestIncident.type.replace('_', ' ')} ची माहिती. रहिवाशांना घरात राहण्याचे आणि आपत्कालीन प्रोटोकॉल चालू ठेवण्याचे आवाहन. प्रभावित भागातून दूर राहा. आपत्कालीन सेवा तैनात केल्या आहेत.`,
          createdAt: new Date().toISOString(),
        },
      ]
      fallbackAlerts.forEach((alert) => useSahaayakStore.getState().addAlert(alert))
    }

    setGenerating(false)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleGenerateAlert}
          disabled={generating || incidents.length === 0}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
        >
          <Globe className="w-4 h-4 mr-2" />
          {generating ? 'Generating...' : 'Generate New Alerts'}
        </Button>

        {/* Language filter */}
        <div className="flex gap-1">
          <Button
            variant={filterLang === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterLang('all')}
          >
            All
          </Button>
          {Object.entries(LANG_FLAGS).map(([code, { label, flag }]) => (
            <Button
              key={code}
              variant={filterLang === code ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterLang(code)}
            >
              {flag} {label}
            </Button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex gap-1">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All Types
          </Button>
          <Button
            variant={filterType === 'emergency_alert' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('emergency_alert')}
          >
            <Bell className="w-3 h-3 mr-1" /> Emergency
          </Button>
          <Button
            variant={filterType === 'public_advisory' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('public_advisory')}
          >
            <Volume2 className="w-3 h-3 mr-1" /> Advisory
          </Button>
          <Button
            variant={filterType === 'media_brief' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('media_brief')}
          >
            <FileText className="w-3 h-3 mr-1" /> Media
          </Button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-full glass-card rounded-xl p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">No Alerts Yet</h3>
            <p className="text-sm text-muted-foreground">
              Submit a report to generate multilingual emergency alerts, or click &ldquo;Generate New Alerts&rdquo; to create alerts for existing incidents.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-4 hover:border-blue-500/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{ALERT_TYPE_ICONS[alert.type] || <Bell className="w-4 h-4" />}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px]"
                    style={{
                      borderColor: alert.language === 'en' ? '#3b82f6' : alert.language === 'hi' ? '#f97316' : '#22c55e',
                      color: alert.language === 'en' ? '#3b82f6' : alert.language === 'hi' ? '#f97316' : '#22c55e',
                    }}
                  >
                    {LANG_FLAGS[alert.language]?.flag} {LANG_FLAGS[alert.language]?.label}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {alert.type.replace('_', ' ')}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {new Date(alert.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{alert.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
