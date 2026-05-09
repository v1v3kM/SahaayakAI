import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const totalIncidents = await db.incident.count()
    const verifiedIncidents = await db.incident.count({ where: { verificationStatus: 'genuine' } })
    const fakeIncidents = await db.incident.count({ where: { verificationStatus: 'fake' } })
    const pendingIncidents = await db.incident.count({ where: { verificationStatus: 'pending' } })
    const underReviewIncidents = await db.incident.count({ where: { verificationStatus: 'under_review' } })

    const reporters = await db.reporter.findMany()
    const avgCredibility = reporters.length > 0
      ? Math.round(reporters.reduce((acc, r) => acc + r.credibilityScore, 0) / reporters.length)
      : 100

    const credibilityDistribution = {
      high: reporters.filter(r => r.credibilityScore >= 80).length,
      medium: reporters.filter(r => r.credibilityScore >= 50 && r.credibilityScore < 80).length,
      low: reporters.filter(r => r.credibilityScore < 50).length,
    }

    const recentIncidents = await db.incident.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { reporter: { select: { name: true, credibilityScore: true } } },
    })

    const typeBreakdown: Record<string, number> = {}
    const incidents = await db.incident.findMany()
    incidents.forEach(i => {
      typeBreakdown[i.type] = (typeBreakdown[i.type] || 0) + 1
    })

    return NextResponse.json({
      analytics: {
        totalIncidents,
        verifiedIncidents,
        fakeIncidents,
        pendingIncidents,
        underReviewIncidents,
        totalReporters: reporters.length,
        avgCredibility,
        verificationRate: totalIncidents > 0 ? Math.round((verifiedIncidents / totalIncidents) * 100) : 0,
        fakeDetectionRate: totalIncidents > 0 ? Math.round((fakeIncidents / totalIncidents) * 100) : 0,
        credibilityDistribution,
        typeBreakdown,
        recentIncidents: recentIncidents.map(i => ({
          ...i,
          createdAt: i.createdAt.toISOString(),
          updatedAt: i.updatedAt.toISOString(),
          reporterName: i.reporter?.name,
          reporterCredibility: i.reporter?.credibilityScore,
        })),
      },
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
