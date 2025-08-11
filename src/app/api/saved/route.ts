import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * Returns the saved items for the current user.
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

  return NextResponse.json({ ok: true, data: items });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "User not found" },
      { status: 404 },
    );
  }

  const body = await req.json();
  const { type, title, url, source, data } = body;

  if (!type || !title || !url) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 },
    );
  }

  const newItem = await prisma.savedItem.create({
    data: {
      userId: user.id,
      type,
      title,
      url,
      source,
      data,
    },
  });

  return NextResponse.json({ ok: true, data: newItem });
}
