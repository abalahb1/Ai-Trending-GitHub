import { NextRequest, NextResponse } from 'next/server'
import { fetchRepos } from '@/server/providers/github'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const topics = url.searchParams.getAll('topics') ?? undefined
  const languages = url.searchParams.getAll('languages') ?? undefined
  const period = (url.searchParams.get('period') ?? '30d') as any
  const min_stars = parseInt(url.searchParams.get('min_stars') ?? '100', 10)
  const page = parseInt(url.searchParams.get('page') ?? '1', 10)
  const pageSize = Math.min(50, parseInt(url.searchParams.get('pageSize') ?? '30', 10))

  const res = await fetchRepos({ topics, languages, period, min_stars, page, pageSize })
  return NextResponse.json({ ok: true, data: res.repos })
}