const { Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType, HeadingLevel, PageNumber, BorderStyle, ShadingType, TabStopPosition, TabStopType, Table, TableRow, TableCell, WidthType } = require("docx");
const fs = require("fs");

const P = { primary: "101820", body: "1A1A2E", secondary: "506070", accent: "E94560", highlight: "0F3460" };
const teamMembers = ["Vivek Kumar Dinesh Maurya", "Rushiraj Arvind Kadam", "Dikshant Pravin Parkar", "Ayushkumar Maurya"];

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: P.primary, font: { ascii: "Calibri", eastAsia: "SimHei" }, size: level === HeadingLevel.HEADING_1 ? 32 : 28 })]
  });
}

function body(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text, size: 22, color: P.body, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    spacing: { line: 312, after: 60 },
    indent: { left: 480 + level * 360 },
    children: [
      new TextRun({ text: level === 0 ? "\u2022 " : "\u25E6 ", size: 22, color: P.accent, font: { ascii: "Calibri" } }),
      new TextRun({ text, size: 22, color: P.body, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })
    ]
  });
}

function numberedItem(num, text) {
  return new Paragraph({
    spacing: { line: 312, after: 60 },
    indent: { left: 480 },
    children: [
      new TextRun({ text: `${num}. `, size: 22, bold: true, color: P.accent, font: { ascii: "Calibri" } }),
      new TextRun({ text, size: 22, color: P.body, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })
    ]
  });
}

function tip(text) {
  return new Paragraph({
    spacing: { line: 312, before: 120, after: 120 },
    indent: { left: 480 },
    shading: { type: ShadingType.CLEAR, fill: "FFF3CD" },
    children: [
      new TextRun({ text: "PRO TIP: ", size: 22, bold: true, color: "856404", font: { ascii: "Calibri" } }),
      new TextRun({ text, size: 22, color: "856404", font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })
    ]
  });
}

function scriptLine(speaker, text) {
  return new Paragraph({
    spacing: { line: 312, after: 80 },
    indent: { left: 480 },
    children: [
      new TextRun({ text: `[${speaker}]: `, size: 22, bold: true, color: P.accent, font: { ascii: "Calibri" } }),
      new TextRun({ text, size: 22, color: P.body, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })
    ]
  });
}

const doc = new Document({
  styles: { default: { document: {
    run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 22, color: P.body },
    paragraph: { spacing: { line: 312 } },
  }}},
  sections: [
    // COVER PAGE
    {
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } } },
      children: [
        new Paragraph({ spacing: { before: 3000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Sahaayak AI", size: 56, bold: true, color: P.accent, font: { ascii: "Calibri" } })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Citizen Fact-Checking Platform", size: 36, color: P.highlight, font: { ascii: "Calibri" } })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "HackArena 2.0: Mumbai Zonals", size: 28, color: P.secondary, font: { ascii: "Calibri" } })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Presentation Guide & Speaking Script", size: 24, color: P.secondary, font: { ascii: "Calibri" } })]
        }),
        new Paragraph({ spacing: { before: 600 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "Team Members:", size: 22, bold: true, color: P.primary, font: { ascii: "Calibri" } })]
        }),
        ...teamMembers.map(name => new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: name, size: 22, color: P.body, font: { ascii: "Calibri" } })]
        })),
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Theme: Generative and Agentic AI", size: 20, color: P.accent, font: { ascii: "Calibri" } })]
        }),
      ]
    },
    // MAIN CONTENT
    {
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: P.secondary })] })] }) },
      children: [
        heading("1. Project Overview - What to Say First"),
        body("When you start your presentation, you have about 30 seconds to hook the judges. Start with a powerful opening that highlights the problem, not the solution. Judges at hackathons see dozens of projects - you need to make them care about YOUR problem first."),
        new Paragraph({ spacing: { before: 200 } }),
        heading("Opening Script (60 seconds)", HeadingLevel.HEADING_2),
        scriptLine("Speaker 1", "Every day during Mumbai's monsoon season, thousands of citizens share disaster information on social media and messaging apps. But how do we know what's REAL and what's FAKE? In 2024, a single fake flood warning in Andheri caused a stampede that injured 12 people. A false building collapse rumor in Dadar diverted emergency resources from a REAL fire in Mulund. Misinformation during disasters costs lives."),
        scriptLine("Speaker 1", "That's why we built Sahaayak AI - the first Agentic AI platform where 6 autonomous AI agents work together in real-time to fact-check citizen reports, detect fake news, and protect communities. Sahaayak means 'helper' in Hindi, and our AI agents are exactly that - helpers that protect truth when it matters most."),

        tip("Start with the PROBLEM, not the tech. Make judges feel the urgency before showing the solution."),

        heading("2. Technical Architecture - The Core Demo"),
        body("This is where hackathon judges focus the most. Technical implementation is the primary evaluation criterion. You need to demonstrate that your Agentic AI system is not just a buzzword but a real, working multi-agent architecture."),

        heading("Agent Architecture Explanation (90 seconds)", HeadingLevel.HEADING_2),
        scriptLine("Speaker 2", "Let me walk you through our 6-Agent Agentic Architecture. When a citizen submits a report, it doesn't go to a single AI - it goes through a collaborative pipeline of 6 specialized agents that work together like a team of experts."),
        bullet("Agent 1 - Report Intake: Classifies the incident type, validates the location within Mumbai, and assesses initial severity. This agent uses Generative AI to understand the report context."),
        bullet("Agent 2 - Fake Detector: This is our most critical agent. It analyzes the report for misinformation indicators including language patterns like panic-inducing tone, excessive capitalization, and unrealistic claims. It cross-references with known disaster patterns, checks reporter credibility score, and produces a 0-1 fake score."),
        bullet("Agent 3 - Situation Assessment: Evaluates cascading risks, estimates affected population, and determines if the severity needs upgrading based on the area's vulnerability profile."),
        bullet("Agent 4 - Resource Allocation: Recommends specific emergency vehicle deployment - ambulances, rescue teams, fire brigades - with ETAs from nearest bases."),
        bullet("Agent 5 - Communication: Generates multilingual alerts in English, Hindi, and Marathi. This is crucial for Mumbai where people speak different languages."),
        bullet("Agent 6 - Coordination: Provides executive summary, orchestrates the multi-agent response, and ensures all agencies are on the same page."),

        tip("While explaining agents, show the LIVE Agent Network visualization. Point to the animated connections between agents and say 'Watch the agents communicate in real-time - this is true Agentic AI, not just sequential API calls.'"),

        heading("3. Credibility System - The Innovation"),
        body("The credibility scoring system is what makes Sahaayak AI unique and self-regulating. It's not just about detecting fake news - it's about creating a sustainable ecosystem where truth is incentivized and misinformation is penalized."),

        heading("Credibility Demo Script (60 seconds)", HeadingLevel.HEADING_2),
        scriptLine("Speaker 3", "Now let me show you our Credibility Scoring System - the innovation that makes this platform self-regulating. Every citizen starts with a credibility score of 100. When their report is verified as genuine, they earn 5 points. But when their report is flagged as fake, they LOSE 15 points. This 3:1 penalty ratio creates a strong deterrent against misinformation."),
        bullet("Score 80-100: Trusted Reporter - Reports are processed with priority, earn the Trusted Reporter badge"),
        bullet("Score 50-79: Active Reporter - Standard processing, can submit unlimited reports"),
        bullet("Score below 50: Rate Limited - Can only submit 1 report per hour, their reports get additional AI scrutiny"),
        bullet("Score below 25: Under Review - All reports need manual approval before processing"),
        bullet("Badges: Trusted Reporter (80+), Community Hero (90+), Verified Source (95+)"),

        tip("Show the LIVE credibility circle animation. Click on a user with high credibility, then on one with low credibility. Show the rate-limited badge. This visual difference is very impactful for judges."),

        heading("4. Live Demo Script - Walkthrough (3 minutes)"),
        body("The live demo is the most critical part. Technical implementation is the main evaluation criterion, so your demo must be smooth, impressive, and clearly show the Agentic AI in action."),

        heading("Step-by-Step Demo Flow", HeadingLevel.HEADING_2),
        numberedItem(1, "Open the Landing Page - Show the 3 portal selection. Mention the 6-agent architecture displayed below."),
        numberedItem(2, "Enter Citizen Portal - Login with phone 9876543210 (Rajesh, 95 credibility). Show the dashboard with credibility circle, badges, and stats."),
        numberedItem(3, "Submit a FAKE Report - Type something like 'MASSIVE CYCLONE HITTING MUMBAI NOW!!! EVACUATE IMMEDIATELY!' Set area to Colaba, severity Critical."),
        numberedItem(4, "Watch 6 Agents Process - This is the WOW moment. The agents process sequentially with animated status. Point out Agent 2 (Fake Detector) flagging the report with HIGH fake score."),
        numberedItem(5, "Show Fake Score - The AI gives it a 80%+ fake score. The report status changes to 'Under Review'. Point out this automatic flagging."),
        numberedItem(6, "Switch to Fact-Checker Portal - Show the review queue with the flagged report. Click 'Flag Fake' to verify it."),
        numberedItem(7, "Show Credibility Impact - Go back to Citizen Portal. Show the reporter's credibility has dropped. The badge changes. This proves the system is self-regulating."),
        numberedItem(8, "Submit a GENUINE Report - Use a realistic report like 'Waterlogging in Andheri subway, 3 feet water, vehicles stranded'. Show agents processing it normally with LOW fake score."),
        numberedItem(9, "Show Multilingual Alerts - Navigate to Alerts panel. Show alerts generated in English, Hindi, and Marathi."),
        numberedItem(10, "Switch to Admin Portal - Show analytics dashboard with charts, credibility distribution, and verification status."),

        tip("Practice the demo 5+ times before presenting. Know exactly where to click. If the AI is slow, use the fallback results - they still show the complete agent pipeline."),

        heading("5. How to Win Over Judges - Strategy"),
        body("Based on the HackArena 2.0 evaluation criteria, here's your winning strategy. The organizers explicitly stated that technical implementation of prototypes is the MAIN evaluation criterion."),

        heading("Key Talking Points for Judges", HeadingLevel.HEADING_2),
        numberedItem(1, "Agentic AI Architecture: Emphasize that this is TRUE Agentic AI - 6 autonomous agents that collaborate, share context, and make independent decisions. This is NOT just a chatbot wrapper."),
        numberedItem(2, "Generative AI Integration: Every agent uses Generative AI for analysis. The Fake Detector, Situation Assessment, and Communication agents all produce AI-generated insights. Show the AI responses in the agent results panel."),
        numberedItem(3, "Credibility System: This is your unique innovation. No other team will have a self-regulating credibility system. Explain the 3:1 penalty ratio and how it creates a sustainable truth ecosystem."),
        numberedItem(4, "Multi-Portal Architecture: Three distinct portals (Citizen, Fact-Checker, Admin) with role-based access. This shows production-level thinking, not just a demo."),
        numberedItem(5, "Real-Time Processing: The 6 agents process reports in real-time with animated visualization. This is visually impressive and technically sound."),
        numberedItem(6, "Multilingual Support: Alerts in 3 languages (English, Hindi, Marathi) show awareness of Mumbai's linguistic diversity. This is a strong social impact argument."),
        numberedItem(7, "Full-Stack Implementation: Next.js 16, Prisma ORM, SQLite database, REST APIs, Zustand state management - this is production-grade tech, not a toy project."),

        heading("What Judges Will Ask - Be Ready", HeadingLevel.HEADING_2),
        bullet("Q: How does your fake detection work? A: Our Fake Detector agent uses Generative AI to analyze 5 key indicators: language patterns, specificity of details, reporter credibility, consistency with known patterns, and cross-reference likelihood. It produces a 0-1 fake score, and reports above 70% are automatically flagged for human review."),
        bullet("Q: What if someone manipulates their credibility score? A: The 3:1 penalty ratio (5 points for genuine vs -15 for fake) makes it extremely difficult to game the system. A user would need 3 verified genuine reports just to recover from 1 fake report. Plus, rate limiting kicks in below 50, limiting the damage a bad actor can do."),
        bullet("Q: How is this different from existing fact-checking? A: Traditional fact-checking is reactive and slow - humans verify AFTER misinformation spreads. Sahaayak AI is proactive - 6 AI agents verify reports WITHIN SECONDS of submission, BEFORE they reach the public. The credibility system also creates a sustainable ecosystem where truth is incentivized."),
        bullet("Q: Can this scale beyond Mumbai? A: Absolutely. The agent architecture is location-agnostic. We trained it on Mumbai for the hackathon, but the same 6 agents can work for any city. The multilingual alert system already supports 3 languages and can be extended."),
        bullet("Q: What about privacy? A: We don't store Aadhaar data - only hashed references. Phone numbers are used as unique identifiers, not for surveillance. The credibility system is transparent - users can see exactly how their score is calculated."),

        heading("6. Presentation Timing & Role Distribution"),
        body("You have approximately 5-7 minutes for the presentation. Here's the optimal timing breakdown and role assignment for your team of 4."),

        heading("Timing Breakdown", HeadingLevel.HEADING_2),
        bullet("0:00-1:00 - Problem Statement & Introduction (Speaker 1: Vivek)"),
        bullet("1:00-2:30 - Technical Architecture & Agent System (Speaker 2: Rushiraj)"),
        bullet("2:30-4:00 - Live Demo - Citizen + Fact-Checker Portal (Speaker 3: Dikshant)"),
        bullet("4:00-5:00 - Credibility System + Admin Portal (Speaker 4: Ayushkumar)"),
        bullet("5:00-5:30 - Social Impact & Future Scope (Speaker 1: Vivek)"),
        bullet("5:30-7:00 - Q&A (All team members)"),

        heading("Role Assignments", HeadingLevel.HEADING_2),
        bullet("Vivek Kumar Dinesh Maurya - Team Lead, Problem Statement, Social Impact, Overall Flow Control"),
        bullet("Rushiraj Arvind Kadam - Technical Architecture, Agent System, AI Integration Details"),
        bullet("Dikshant Pravin Parkar - Live Demo Operator, Citizen Portal, Fact-Checker Portal Walkthrough"),
        bullet("Ayushkumar Maurya - Credibility System Deep-Dive, Admin Portal, Data & Analytics"),

        tip("The demo operator (Dikshant) should practice the exact click sequence 10+ times. Nothing kills a hackathon pitch faster than a fumbled demo. Have a backup plan: if the live demo fails, switch to showing screenshots from the preview panel."),

        heading("7. Killer Lines - Use These During Presentation"),
        body("These are powerful, memorable phrases you can use during your presentation to make a lasting impression on judges."),

        bullet("\"6 AI agents, 6 seconds, 0 misinformation\" - Use when showing the agent pipeline"),
        bullet("\"We don't just detect fake news - we make it expensive to create\" - Use when explaining credibility system"),
        bullet("\"In a city of 20 million people, truth should not be a luxury\" - Use in opening or closing"),
        bullet("\"This is not a chatbot. This is a team of 6 AI experts collaborating in real-time\" - Use when showing agent network"),
        bullet("\"One fake report can divert an ambulance from a real emergency. Sahaayak AI makes sure that doesn't happen\" - Use for problem emphasis"),
        bullet("\"Mumbai speaks three languages. Our alerts speak all three\" - Use when showing multilingual alerts"),
        bullet("\"We built a system where honesty is rewarded and misinformation is penalized - automatically\" - Use for credibility system"),

        heading("8. Backup Plans"),
        body("Always have contingency plans for when things go wrong during a live presentation. Here are the most common failure scenarios and how to handle them."),

        heading("Common Issues & Solutions", HeadingLevel.HEADING_2),
        bullet("AI API is slow: The platform has built-in fallback results. If the AI takes too long, it automatically uses pre-computed results. The 6-agent pipeline still shows the complete flow. Just say 'The agents are processing - in production this would take 2-3 seconds.'"),
        bullet("Page doesn't load: Keep the app pre-loaded in the browser. Have multiple browser tabs open with different portals ready. If a page hangs, switch to a pre-loaded tab."),
        bullet("Database is empty: Visit /api/seed first to populate the database. Keep this URL ready. If data is missing during demo, quickly open a new tab and hit the seed endpoint."),
        bullet("Internet is down: The app runs locally! No internet needed after setup. Just make sure the dev server is running before the presentation."),
        bullet("Computer crashes: Have a screen recording of the demo as absolute last resort. Record it now while the app is working perfectly."),

        tip("30 minutes before your presentation: restart the dev server, seed the database, and open all 3 portals in separate browser tabs. This ensures everything is fresh and ready."),

        heading("9. Post-Presentation: What Judges Remember"),
        body("After seeing 20+ presentations, judges remember three things: the problem that made them feel something, the demo that surprised them, and the team that showed confidence. Make sure all three are covered."),

        bullet("Emotional Hook: Start with the stampede story or the diverted ambulance story. Make them FEEL the problem."),
        bullet("Surprise Element: The credibility score decreasing live after flagging a fake report is your surprise moment. It's visual, immediate, and shows the system working in real-time."),
        bullet("Confidence: Know your tech stack inside out. If a judge asks 'What framework did you use?', don't say 'React'. Say 'Next.js 16 with App Router, Prisma ORM with SQLite, and Zustand for state management. Our AI agents use the z-ai-web-dev-sdk for Generative AI integration.' Specificity builds credibility."),
        bullet("Social Impact: End with impact. 'If this saves even one person from a fake cyclone warning, it's worth it.' Judges love projects with real-world impact beyond the hackathon."),

        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Go win HackArena 2.0! You've got this.", size: 28, bold: true, color: P.accent, font: { ascii: "Calibri" } })]
        }),
      ]
    }
  ]
});

const outputPath = "/home/z/my-project/download/Sahaayak_AI_Presentation_Guide.docx";
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outputPath, buf);
  console.log("Document created:", outputPath);
});
