import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * إرجاع العناصر المحفوظة للمستخدم الحالي.
 * نعتمد على session.user.email ثم نستخرج userId من قاعدة البيانات.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  })
  if (!user) {
    return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
  }

  const items = await prisma.savedItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  return NextResponse.json({ ok: true, data: items })
}
