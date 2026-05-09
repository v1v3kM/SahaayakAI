import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const reporter = await db.reporter.findUnique({ where: { id } })
    if (!reporter) return NextResponse.json({ error: 'Reporter not found' }, { status: 404 })
    return NextResponse.json({ reporter })
  } catch (error) {
    console.error('Fetch reporter error:', error)
    return NextResponse.json({ error: 'Failed to fetch reporter' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const reporter = await db.reporter.update({ where: { id }, data })
    return NextResponse.json({ reporter })
  } catch (error) {
    console.error('Update reporter error:', error)
    return NextResponse.json({ error: 'Failed to update reporter' }, { status: 500 })
  }
}
