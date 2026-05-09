import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const incidents = await db.incident.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            credibilityScore: true,
          },
        },
      },
    })

    return NextResponse.json({
      incidents: incidents.map((inc) => ({
        ...inc,
        reporterName: inc.reporter?.name || 'Anonymous',
        reporterCredibility: inc.reporter?.credibilityScore || null,
        createdAt: inc.createdAt.toISOString(),
        updatedAt: inc.updatedAt.toISOString(),
        resolvedAt: inc.resolvedAt?.toISOString() || null,
      })),
    })
  } catch (error) {
    console.error('Fetch incidents error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}
