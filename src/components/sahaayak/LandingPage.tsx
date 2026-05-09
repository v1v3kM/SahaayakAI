'use client'

import { motion } from 'framer-motion'
import { Shield, Users, CheckCircle, Settings, ArrowRight, Sparkles } from 'lucide-react'
import { useSahaayakStore } from '@/lib/store'

const portals = [
  {
    id: 'citizen' as const,
    title: 'Citizen Portal',
    subtitle: 'Report incidents & track credibility',
    description: 'Submit disaster reports, track your credibility score, earn badges, and help India stay safe with verified information.',
    icon: <Users className="w-8 h-8" />,
    color: '#22c55e',
    gradient: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    hoverBorder: 'hover:border-green-400/50',
    features: ['Submit Reports', 'Track Credibility Score', 'Earn Badges', 'View AI Analysis'],
  },
  {
    id: 'factchecker' as const,
    title: 'Fact-Checker Portal',
    subtitle: 'Verify reports & fight misinformation',
    description: 'Review pending reports, verify genuine incidents, flag fake news, and help maintain the integrity of our information ecosystem.',
    icon: <CheckCircle className="w-8 h-8" />,
    color: '#f97316',
    gradient: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/30',
    hoverBorder: 'hover:border-orange-400/50',
    features: ['Review Queue', 'AI Analysis', 'Verify/Flag Reports', 'Impact Credibility'],
  },
  {
    id: 'admin' as const,
    title: 'Admin Portal',
    subtitle: 'System analytics & management',
    description: 'Monitor system-wide analytics, manage reports and users, oversee credibility scores, and ensure platform integrity.',
    icon: <Settings className="w-8 h-8" />,
    color: '#a855f7',
    gradient: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30',
    hoverBorder: 'hover:border-purple-400/50',
    features: ['System Analytics', 'Reports Management', 'User Management', 'Override Controls'],
  },
]

export default function LandingPage() {
  const { setCurrentPortal } = useSahaayakStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }}
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-muted-foreground">HackArena 2.0</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-semibold gradient-text">Generative & Agentic AI</span>
          </motion.div>

          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
              animate={{ boxShadow: ['0 0 20px rgba(59,130,246,0.3)', '0 0 40px rgba(59,130,246,0.5)', '0 0 20px rgba(59,130,246,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3">
            <span className="gradient-text">Sahaayak AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-2">सहायक · India&apos;s AI-Powered Citizen Safety Platform</p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-powered multi-agent system for disaster response & fake news detection across India. 
            6 autonomous AI agents collaborate to verify reports, detect misinformation, and protect communities.
          </p>

          {/* Agent badges */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {['🟢', '🔴', '🟡', '🔴', '🔵', '🟣'].map((emoji, i) => (
              <motion.span
                key={i}
                className="text-lg"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              >
                {emoji}
              </motion.span>
            ))}
            <span className="text-xs text-muted-foreground ml-2">6 AI Agents Active</span>
          </div>
        </motion.div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map((portal, i) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
            >
              <button
                onClick={() => setCurrentPortal(portal.id)}
                className={`w-full text-left glass-card rounded-2xl p-6 border ${portal.borderColor} ${portal.hoverBorder} transition-all duration-300 hover:shadow-lg group h-full flex flex-col`}
                style={{ '--hover-shadow': `0 0 30px ${portal.color}20` } as React.CSSProperties}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center mb-4`}
                  style={{ color: portal.color }}
                >
                  {portal.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-1" style={{ color: portal.color }}>
                  {portal.title}
                </h3>
                <p className="text-xs text-muted-foreground font-medium mb-3">{portal.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {portal.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {portal.features.map((feat) => (
                    <span
                      key={feat}
                      className="px-2 py-1 rounded-md text-[10px] font-medium border border-border bg-secondary/30"
                      style={{ color: portal.color }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Enter button */}
                <div className="flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3" style={{ color: portal.color }}>
                  Enter Portal
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>System Online</span>
            </div>
            <span>•</span>
            <span>All India · 28 States + 8 UTs</span>
            <span>•</span>
            <span>6 AI Agents</span>
            <span>•</span>
            <span>12 Languages</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
