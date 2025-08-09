import { fetchNews } from "@/server/providers/news"
import NewsCard from "@/components/NewsCard"

export const dynamic = "force-dynamic"

type SP = Record<string, string | string[] | undefined>

export default async function NewsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q) || '(AI OR "machine learning" OR LLM)'
  const language = (Array.isArray(sp.language) ? sp.language[0] : sp.language) || 'en'
  const sort = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) || 'publishedAt'
  const pageSize = Number(Array.isArray(sp.pageSize) ? sp.pageSize[0] : sp.pageSize) || 24

  const { articles } = await fetchNews({ q, language, sort: sort as any, pageSize })

  return (
    <section className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <h1 className="text-xl font-semibold">Latest AI/ML News</h1>
        <form className="flex flex-wrap gap-2 text-sm" action="/news">
          <input name="q" defaultValue={q} placeholder='keyword e.g. "LLM"'
                 className="border rounded-md px-2 py-1 bg-white/70 dark:bg-neutral-900/70
                            border-gray-200 dark:border-neutral-700" />
          <select name="language" defaultValue={language}
                  className="border rounded-md px-2 py-1 bg-white/70 dark:bg-neutral-900/70
                             border-gray-200 dark:border-neutral-700">
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
          <select name="sort" defaultValue={sort}
                  className="border rounded-md px-2 py-1 bg-white/70 dark:bg-neutral-900/70
                             border-gray-200 dark:border-neutral-700">
            <option value="publishedAt">Latest</option>
            <option value="relevancy">Relevant</option>
            <option value="popularity">Popular</option>
          </select>
          <button className="btn">Search</button>
        </form>
      </header>

      {articles.length === 0 ? (
        <p className="text-sm opacity-80">لا توجد نتائج — جرّب كلمة بحث أخرى.</p>
      ) : (
        <ul className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map(a => (
            <li key={a.id}>
              <NewsCard
                title={a.title}
                url={a.url}
                source={a.source}
                publishedAt={a.publishedAt}
                summary={a.summary}
                imageUrl={a.imageUrl}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
