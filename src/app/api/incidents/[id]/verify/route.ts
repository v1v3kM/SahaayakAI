import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { verdict, verifierId, verifierRole, notes } = await request.json()

    if (!verdict || !verifierId) {
      return NextResponse.json({ error: 'Missing verdict or verifierId' }, { status: 400 })
    }

    // Get the incident
    const incident = await db.incident.findUnique({ where: { id } })
    if (!incident) return NextResponse.json({ error: 'Incident not found' }, { status: 404 })

    // Create verification record only if verifier exists in DB
    let verification = null
    const verifierExists = await db.reporter.findUnique({ where: { id: verifierId } })
    if (verifierExists) {
      verification = await db.verification.create({
        data: {
          incidentId: id,
          verifierId,
          verifierRole: verifierRole || 'authority',
          status: verdict, // genuine or fake
          notes,
        },
      })
    }

    // Update incident status
    const newVerificationStatus = verdict === 'genuine' ? 'genuine' : 'fake'
    const newStatus = verdict === 'genuine' ? 'verified' : 'fake'
    await db.incident.update({
      where: { id },
      data: {
        verificationStatus: newVerificationStatus,
        status: newStatus,
        resolvedAt: new Date(),
      },
    })

    // Update reporter credibility
    if (incident.reporterId) {
      const reporter = await db.reporter.findUnique({ where: { id: incident.reporterId } })
      if (reporter) {
        let credibilityChange = 0
        if (verdict === 'genuine') {
          credibilityChange = 5
        } else if (verdict === 'fake') {
          credibilityChange = -15
        }

        const newScore = Math.max(0, Math.min(100, reporter.credibilityScore + credibilityChange))
        const newBadges = [...JSON.parse(reporter.badges as string || '[]')]
        if (newScore >= 95 && !newBadges.includes('Verified Source')) newBadges.push('Verified Source')
        if (newScore >= 90 && !newBadges.includes('Community Hero')) newBadges.push('Community Hero')
        if (newScore >= 80 && !newBadges.includes('Trusted Reporter')) newBadges.push('Trusted Reporter')

        await db.reporter.update({
          where: { id: reporter.id },
          data: {
            credibilityScore: newScore,
            verifiedReports: reporter.verifiedReports + (verdict === 'genuine' ? 1 : 0),
            fakeReports: reporter.fakeReports + (verdict === 'fake' ? 1 : 0),
            badges: JSON.stringify(newBadges),
            isRateLimited: newScore < 50,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      verification: verification ? {
        ...verification,
        createdAt: verification.createdAt.toISOString(),
      } : null,
    })
  } catch (error) {
    console.error('Verify incident error:', error)
    return NextResponse.json({ error: 'Failed to verify incident' }, { status: 500 })
  }
}
