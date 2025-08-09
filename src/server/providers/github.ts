export type Repo = {
  id: number
  name: string
  fullName: string
  description?: string
  htmlUrl: string
  stars: number
  forks: number
  language?: string
  owner: { login: string; avatarUrl: string }
  topics: string[]
  homepage?: string
  ogImageUrl?: string
}

export type RepoQuery = {
  topics?: string[]
  perPage?: number
}

// slugifyTopic: يتعامل مع "+", المسافات, underscores, الاقتباسات, والشرطات الذكية
function slugifyTopic(s: string) {
  const normDash = (x: string) => x.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-")
  const stripQuotes = (x: string) => x.replace(/[“”„‟"«»‚‘’‹›']/g, "")
  const t = normDash(stripQuotes(String(s).replace(/\+/g, " ")))
    .trim()
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
  return t && /^[a-z0-9][a-z0-9-]*$/.test(t) ? t : null
}

async function searchOnce(q: string, perPage = 24, headers: Record<string, string>) {
  const params = new URLSearchParams({ q, sort: "stars", order: "desc", per_page: String(perPage) })
  if (process.env.DEBUG_GITHUB === "1") console.log("[GITHUB_SEARCH] q=", q)
  const url = "https://api.github.com/search/repositories?" + params
  const r = await fetch(url, { headers, next: { revalidate: 300 } })
  if (!r.ok) {
    const body = await r.text().catch(() => "")
    if (r.status === 422) {
      if (process.env.DEBUG_GITHUB === "1") console.warn("[GITHUB_SEARCH] 422 → returning [] for q=", q)
      return [] // لا ترمِ خطأ؛ فعّل fallback
    }
    throw new Error(`GitHub search failed ${r.status}: ${body}`)
  }
  const data = await r.json()
  return (data.items ?? []) as any[]
}

function mapRepo(x: any) {
  return {
    id: x.id,
    name: x.name,
    fullName: x.full_name,
    description: x.description || undefined,
    htmlUrl: x.html_url,
    stars: x.stargazers_count,
    forks: x.forks_count,
    language: x.language || undefined,
    owner: { login: x.owner?.login, avatarUrl: x.owner?.avatar_url },
    topics: Array.isArray(x.topics) ? x.topics : [],
    homepage: x.homepage || undefined,
    ogImageUrl: `https://opengraph.githubassets.com/1/${x.full_name}`,
  }
}

export async function fetchTrendingRepos({ topics = [], perPage = 24 }: RepoQuery = {}): Promise<{ repos: any[] }> {
  const defaults = ["ai","machine-learning","deep-learning","nlp","computer-vision","agents","llm","generative-ai"]
  const normalized = (topics.length ? topics : defaults)
    .map(slugifyTopic)
    .filter((t): t is string => Boolean(t))

  const subject = normalized.length ? normalized.map(t => `topic:${t}`).join(" OR ") : "topic:ai"

  const headers: Record<string, string> = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ai-ml-pulse"
  }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

  if (process.env.DEBUG_GITHUB === "1") {
    console.log("[TOPICS_NORMALIZED]", normalized)
    console.log("[GITHUB_SUBJECT]", subject)
  }

  // المحاولة الأساسية
  let items = await searchOnce(subject, perPage, headers)

  // Fallback: إن رجعت [] (مثلاً بسبب 422)، جرّب كل topic لوحده
  if ((!items || items.length === 0) && normalized.length) {
    const all: any[] = []
    for (const t of normalized) {
      const chunk = await searchOnce(`topic:${t}`, Math.max(6, Math.ceil(perPage / normalized.length)), headers)
      all.push(...chunk)
    }
    items = all
  }

  return { repos: items.map(mapRepo) }
}

export default fetchTrendingRepos
