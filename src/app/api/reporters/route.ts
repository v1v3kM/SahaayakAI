import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, phone, role } = await request.json()
    if (!phone) return NextResponse.json({ error: 'Phone is required' }, { status: 400 })

    let reporter = await db.reporter.findUnique({ where: { phone } })
    if (!reporter) {
      reporter = await db.reporter.create({
        data: { name: name || 'Anonymous', phone, role: role || 'citizen' },
      })
    }
    return NextResponse.json({ reporter })
  } catch (error) {
    console.error('Create reporter error:', error)
    return NextResponse.json({ error: 'Failed to create reporter' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const reporters = await db.reporter.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { incidents: true } } },
    })
    return NextResponse.json({ reporters })
  } catch (error) {
    console.error('Fetch reporters error:', error)
    return NextResponse.json({ error: 'Failed to fetch reporters' }, { status: 500 })
  }
}
