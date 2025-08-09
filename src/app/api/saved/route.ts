import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 })

  const items = await prisma.savedItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json({ ok: true, data: items })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 })

  const body = await req.json()
  const { type, title, url, source, data } = body || {}
  if (!type || !title || !url) return NextResponse.json({ ok: false, error: 'VALIDATION_ERROR' }, { status: 400 })

  const item = await prisma.savedItem.create({
    data: {
      userId: session.user.id,
      type,
      title,
      url,
      source,
      data
    }
  })
  return NextResponse.json({ ok: true, data: item }, { status: 201 })
}
