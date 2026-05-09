# Sahaayak AI - Citizen Fact-Checking Platform
## Agentic AI Powered Fake News Detection & Disaster Response System

**HackArena 2.0: Mumbai Zonals** | Theme: Generative and Agentic AI

**Team Members:** Vivek Kumar Dinesh Maurya, Rushiraj Arvind Kadam, Dikshant Pravin Parkar, Ayushkumar Maurya

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- **Node.js** 18+ installed
- **Bun** (recommended) or npm

### Setup Steps

```bash
# 1. Navigate to the project directory
cd sahaayak-ai

# 2. Install dependencies
bun install
# OR: npm install

# 3. Set up the database
bun run db:push
# OR: npx prisma db push

# 4. Start the development server
bun run dev
# OR: npm run dev

# 5. Open in browser
# Visit http://localhost:3000

# 6. Seed the database with demo data
# Visit http://localhost:3000/api/seed (POST or GET in browser)
# This happens automatically on first visit
```

### Demo Accounts

| Phone | Name | Credibility | Role | Notes |
|-------|------|------------|------|-------|
| 9876543210 | Rajesh Kumar | 95 | Citizen | Trusted Reporter with badges |
| 9876543211 | Priya Sharma | 78 | Citizen | Active Reporter |
| 9876543212 | Amit Patel | 45 | Citizen | Rate Limited (low credibility) |
| 9876543213 | Inspector Deshmukh | 100 | Authority | Fact-checker account |
| 9876543200 | Admin Control | 100 | Admin | Admin portal access |

---

## 🏗️ Architecture

### 6-Agent Agentic AI System

| Agent | Role | Description |
|-------|------|-------------|
| 🟢 Report Intake | Classification | Classifies incident type, validates location, assesses severity |
| 🔍 Fake Detector | Misinformation Detection | AI-powered analysis of language patterns, credibility, consistency |
| 🟡 Situation Assessment | Risk Evaluation | Estimates affected population, cascading risks |
| 🔴 Resource Allocation | Deployment | Recommends emergency vehicle deployment with ETAs |
| 🔵 Communication | Alerts | Generates multilingual alerts (English, Hindi, Marathi) |
| 🟣 Coordination | Orchestration | Executive summary, multi-agent coordination |

### Credibility Scoring System

- **Starting Score:** 100
- **Genuine Report Verified:** +5 points
- **Fake Report Flagged:** -15 points (3:1 penalty ratio)
- **Below 50:** Rate limited (1 report/hour)
- **Below 25:** All reports need approval
- **Badges:** Trusted Reporter (80+), Community Hero (90+), Verified Source (95+)

### Tech Stack

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM, SQLite
- **State Management:** Zustand
- **AI Integration:** z-ai-web-dev-sdk (Generative AI)
- **Visualizations:** Recharts, Framer Motion
- **Database:** SQLite via Prisma

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main page with all portals
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles + animations
│   └── api/
│       ├── agents/
│       │   ├── process/route.ts  # 6-agent processing pipeline
│       │   └── alert/route.ts    # Alert generation
│       ├── incidents/
│       │   ├── route.ts          # List incidents
│       │   └── [id]/
│       │       ├── route.ts      # Update/delete incident
│       │       └── verify/route.ts  # Verify incident + update credibility
│       ├── reporters/
│       │   ├── route.ts          # Create/list reporters
│       │   └── [id]/
│       │       ├── route.ts      # Get/update reporter
│       │       └── reports/route.ts  # Get reporter's reports
│       ├── analytics/route.ts    # System analytics
│       ├── chat/route.ts         # AI chat assistant
│       └── seed/route.ts         # Seed demo data
├── components/
│   ├── sahaayak/
│   │   ├── Dashboard.tsx     # Main dashboard with map
│   │   ├── ReportForm.tsx    # Submit incident report
│   │   ├── AgentNetwork.tsx  # 6-agent visualization
│   │   ├── AlertsPanel.tsx   # Multilingual alerts
│   │   ├── ResourceCenter.tsx # Resource deployment
│   │   └── MumbaiMap.tsx     # SVG Mumbai district map
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── store.ts              # Zustand store
│   └── utils.ts              # Utility functions
└── hooks/
    ├── use-mobile.ts
    └── use-toast.ts
prisma/
└── schema.prisma             # Database schema
```

---

## 🎯 Key Features for Demo

1. **Live Agent Processing** - Submit a report and watch 6 AI agents process it in real-time
2. **Fake Detection** - Submit a suspicious report and see the AI flag it with high fake score
3. **Credibility Impact** - Flag a report as fake and watch the reporter's credibility drop live
4. **Multilingual Alerts** - Show alerts generated in English, Hindi, and Marathi
5. **Agent Network Visualization** - Show the 6-agent collaboration network with animated connections
6. **AI Chat Assistant** - Ask the AI assistant questions about the platform
7. **Admin Analytics** - Show system-wide analytics with charts

---

## 💡 Demo Tips

1. Start by submitting a FAKE report (e.g., "MASSIVE CYCLONE HITTING MUMBAI!!!") to show fake detection
2. Then submit a REALISTIC report (e.g., "Waterlogging in Andheri subway") to show normal processing
3. Switch to Fact-Checker portal to verify/flag reports and show credibility changes
4. End with Admin portal to show the full analytics picture

Good luck at HackArena 2.0! 🏆
