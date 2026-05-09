import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status, verificationStatus } = await request.json()
    const incident = await db.incident.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(verificationStatus && { verificationStatus }),
        ...(verificationStatus === 'genuine' && { status: 'verified' }),
        ...(verificationStatus === 'fake' && { status: 'fake' }),
      },
    })
    return NextResponse.json({
      incident: {
        ...incident,
        createdAt: incident.createdAt.toISOString(),
        updatedAt: incident.updatedAt.toISOString(),
        resolvedAt: incident.resolvedAt?.toISOString(),
      },
    })
  } catch (error) {
    console.error('Update incident error:', error)
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.incident.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete incident error:', error)
    return NextResponse.json({ error: 'Failed to delete incident' }, { status: 500 })
  }
}
