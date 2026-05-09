import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const alerts = await db.alert.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      alerts: alerts.map((alert) => ({
        ...alert,
        createdAt: alert.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Fetch alerts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}
