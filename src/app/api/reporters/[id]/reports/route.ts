import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const incidents = await db.incident.findMany({
      where: { reporterId: id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({
      incidents: incidents.map(i => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
        resolvedAt: i.resolvedAt?.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Fetch reporter reports error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}
