export type NewsQuery = {
  q?: string
  categories?: string[]
  from?: string
  to?: string
  sort?: 'publishedAt' | 'popularity' | 'relevancy'
  page?: number
  pageSize?: number
  language?: string
}

export type Article = {
  id: string
  title: string
  url: string
  source: string
  publishedAt: string
  summary?: string
  imageUrl?: string
  categories?: string[]
}

function hashId(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h).toString()
}

export async function fetchNews(query: NewsQuery = {}): Promise<{ articles: Article[] }> {
  const {
    q = '(AI OR "machine learning" OR LLM)',
    from,
    to,
    sort = 'publishedAt',
    page = 1,
    pageSize = 20,
    language = 'en'
  } = query

  // Primary: NewsAPI
  if (process.env.NEWSAPI_KEY) {
    const params = new URLSearchParams({
      q, language, sortBy: sort, page: String(page), pageSize: String(pageSize), apiKey: process.env.NEWSAPI_KEY!
    })
    if (from) params.set('from', from)
    if (to) params.set('to', to)

    const r = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`, { cache: 'no-store' })
    if (r.ok) {
      const data = await r.json()
      const articles: Article[] = (data.articles ?? []).map((a: any) => ({
        id: hashId(a.url),
        title: a.title,
        url: a.url,
        source: a.source?.name || 'Unknown',
        publishedAt: a.publishedAt,
        summary: a.description,
        imageUrl: a.urlToImage || undefined,
        categories: []
      }))
      return { articles }
    }
  }

  // Fallback: GNews (note apikey/sortby parameter names)
  if (process.env.GNEWS_APIKEY) {
    const params = new URLSearchParams({
      q,
      lang: language,
      apikey: process.env.GNEWS_APIKEY!,   // correct name
      max: String(pageSize),
      sortby: sort === 'publishedAt' ? 'publishedAt' : 'relevance',
      in: 'title,description,content'
    })
    const r = await fetch(`https://gnews.io/api/v4/search?${params.toString()}`, { cache: 'no-store' })
    if (r.ok) {
      const data = await r.json()
      const articles: Article[] = (data.articles ?? []).map((a: any) => ({
        id: hashId(a.url),
        title: a.title,
        url: a.url,
        source: new URL(a.source?.url || a.url).hostname.replace('www.', ''),
        publishedAt: a.publishedAt,
        summary: a.description,
        imageUrl: a.image || undefined,
        categories: []
      }))
      return { articles }
    }
  }

  return { articles: [] }
}
