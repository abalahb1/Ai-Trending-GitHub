import { NextRequest, NextResponse } from 'next/server'
import { normalizeTopicsInput } from '@/lib/topics'
import { fetchTrendingRepos } from '@/server/providers/github'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const topicsParam = url.searchParams.get('topics') ?? ''
    const topics = normalizeTopicsInput(topicsParam)
    const perPage = Math.min(50, parseInt(url.searchParams.get('pageSize') ?? '24', 10))

    const { repos } = await fetchTrendingRepos({ topics, perPage })
    return NextResponse.json({ ok: true, data: repos })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 })
  }
}
