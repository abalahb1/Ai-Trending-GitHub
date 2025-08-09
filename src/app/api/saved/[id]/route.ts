import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(req: NextRequest, ctx: any) {
  const p = (ctx && ctx.params) ? await ctx.params : {}
  const id = p?.id as string | undefined

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // احصل على userId من الإيميل
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // احذف السجل الخاص بهذا المستخدم فقط
  await prisma.savedItem.deleteMany({
    where: { id, userId: user.id }   // ✅ استخدم userId بدل userEmail
  })

  return new NextResponse(null, { status: 204 })
}
