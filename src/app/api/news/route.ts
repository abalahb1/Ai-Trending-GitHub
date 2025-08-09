import { NextRequest, NextResponse } from 'next/server'
import { fetchNews } from '@/server/providers/news'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') ?? undefined
  const from = url.searchParams.get('from') ?? undefined
  const to = url.searchParams.get('to') ?? undefined
  const sort = (url.searchParams.get('sort') ?? 'publishedAt') as any
  const page = parseInt(url.searchParams.get('page') ?? '1', 10)
  const pageSize = Math.min(50, parseInt(url.searchParams.get('pageSize') ?? '20', 10))
  const language = url.searchParams.get('language') ?? 'en'

  const res = await fetchNews({ q, from, to, sort, page, pageSize, language })
  return NextResponse.json({ ok: true, data: res.articles })
}
