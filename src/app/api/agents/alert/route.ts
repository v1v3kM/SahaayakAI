import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { incidentId, incidentType, location, severity, description } = body

    if (!incidentId || !incidentType || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: incidentId, incidentType, location' },
        { status: 400 }
      )
    }

    const alertsData: Array<{ id: string; incidentId: string; language: string; type: string; content: string; createdAt: string }> = []

    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      const zai = await ZAI.create()

      // Generate alerts in all 3 languages
      const languages = [
        { code: 'en', name: 'English', type: 'emergency_alert' },
        { code: 'hi', name: 'Hindi', type: 'public_advisory' },
        { code: 'mr', name: 'Marathi', type: 'public_advisory' },
      ]

      for (const lang of languages) {
        const result = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `Generate a ${lang.type === 'emergency_alert' ? 'critical emergency alert' : 'public advisory'} in ${lang.name}${lang.code === 'hi' || lang.code === 'mr' ? ' (Devanagari script)' : ''} for a disaster in India. Be urgent, clear, and under 100 words. Include safety instructions.`,
            },
            {
              role: 'user',
              content: `Incident Type: ${incidentType}\nLocation: ${location}\nSeverity: ${severity}\nDescription: ${description || 'No additional details'}`,
            },
          ],
          temperature: 0.3,
        })

        const content = result.choices?.[0]?.message?.content || `⚠️ ${severity?.toUpperCase() || 'EMERGENCY'}: ${incidentType} at ${location}. Follow safety protocols. Emergency services responding.`

        const alertRecord = await db.alert.create({
          data: {
            incidentId,
            language: lang.code,
            type: lang.type,
            content,
          },
        })

        alertsData.push({
          id: alertRecord.id,
          incidentId,
          language: lang.code,
          type: lang.type,
          content: alertRecord.content,
          createdAt: alertRecord.createdAt.toISOString(),
        })
      }
    } catch (aiError) {
      console.error('AI alert generation error:', aiError)
      
      // Fallback alerts
      const fallbackAlerts = [
        {
          language: 'en',
          type: 'emergency_alert',
          content: `⚠️ EMERGENCY ALERT: ${severity?.toUpperCase() || 'EMERGENCY'} ${incidentType?.replace(/_/g, ' ')} at ${location}. Residents advised to stay indoors. Emergency services deployed. Avoid affected area. Stay tuned for updates.`,
        },
        {
          language: 'hi',
          type: 'public_advisory',
          content: `⚠️ आपातकालीन अलर्ट: ${location} में ${incidentType?.replace(/_/g, ' ')} की सूचना। निवासियों से घर में रहने का अनुरोध। आपातकालीन सेवाएं तैनात। प्रभावित क्षेत्र से बचें।`,
        },
      ]

      for (const fa of fallbackAlerts) {
        const alertRecord = await db.alert.create({
          data: {
            incidentId,
            language: fa.language,
            type: fa.type,
            content: fa.content,
          },
        })

        alertsData.push({
          id: alertRecord.id,
          incidentId,
          language: alertRecord.language,
          type: alertRecord.type,
          content: alertRecord.content,
          createdAt: alertRecord.createdAt.toISOString(),
        })
      }
    }

    return NextResponse.json({
      success: true,
      alerts: alertsData,
    })
  } catch (error) {
    console.error('Alert generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error generating alerts' },
      { status: 500 }
    )
  }
}
