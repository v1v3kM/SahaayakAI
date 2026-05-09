import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      const zai = await ZAI.create()

      const result = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are the Sahaayak AI Assistant - an intelligent chatbot for the Sahaayak AI Citizen Safety Platform, India's AI-powered disaster response and fact-checking system. You help citizens, fact-checkers, and administrators across India.

Key platform features you can explain:
- 6 Agentic AI system: Report Intake, Fake Detector, Situation Assessment, Resource Allocation, Communication, Coordination
- Credibility scoring system: Starts at 100, +5 for genuine reports, -15 for fake reports
- Rate limiting below 50 credibility score
- Badges: Trusted Reporter (80+), Community Hero (90+), Verified Source (95+)
- Multilingual alerts in 12 Indian languages (English, Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Punjabi, Malayalam, Odia, Assamese)
- Pan-India coverage: 28 States + 8 Union Territories
- Real-time fake detection with AI-powered misinformation analysis
- NDRF/SDRF coordination for disaster response

Context: ${context || 'General inquiry about the platform'}

Be helpful, concise, and specific. If asked about disaster information, remind users to verify through official channels like IMD, NDMA, or their state SDMA.`
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
      })

      return NextResponse.json({ response: result.choices?.[0]?.message?.content || 'I apologize, I could not process that request.' })
    } catch (aiError) {
      console.error('AI chat error:', aiError)
      // Fallback responses
      const fallbackResponses: Record<string, string> = {
        'fake': 'The Fake Detector agent uses AI to analyze reports for signs of misinformation. It checks language patterns, specificity of details, reporter credibility, and consistency with known patterns. Reports scoring above 70% fake risk are flagged for mandatory human review.',
        'credibility': 'The credibility system starts every user at 100 points. Verified genuine reports earn +5 points, while flagged fake reports cost -15 points. Below 50 points, users are rate-limited. Below 25, all reports need approval before processing.',
        'agent': 'Sahaayak AI deploys 6 autonomous agents: Report Intake (classifies reports), Fake Detector (identifies misinformation), Situation Assessment (evaluates severity), Resource Allocation (deploys resources), Communication (generates alerts), and Coordination (orchestrates response).',
        'alert': 'The Communication agent generates emergency alerts in 12 Indian languages including English, Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Punjabi, Malayalam, Odia, and Assamese. Regional language is automatically selected based on the state where the incident is reported.',
        'report': 'To submit a report, go to the Citizen Portal and click Submit Report. Select your state, city, and area, then fill in the incident type, description, and severity. The 6 AI agents will process your report in real-time, including fake detection analysis.',
      }

      let response = 'I am the Sahaayak AI Assistant. I can help you understand our fact-checking platform, credibility system, AI agents, and report verification process. What would you like to know?'
      const lowerMsg = message.toLowerCase()
      for (const [key, val] of Object.entries(fallbackResponses)) {
        if (lowerMsg.includes(key)) {
          response = val
          break
        }
      }

      return NextResponse.json({ response })
    }
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
