import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 })

  await prisma.savedItem.delete({
    where: { id: params.id }
  })
  return NextResponse.json({ ok: true })
}