import Hero from "@/components/home/Hero"
import { fetchNews } from "@/server/providers/news"
import { fetchTrendingRepos } from "@/server/providers/github"
import NewsCard from "@/components/NewsCard"
import RepoCard from "@/components/RepoCard"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // قسم GitHub (topic=ai) + الأخبار
  const [aiRes, newsRes] = await Promise.all([
    fetchTrendingRepos({ topics: ["ai"], perPage: 8 }),
    fetchNews({ pageSize: 8, sort: "publishedAt", language: "en" })
  ])

  const aiRepos   = aiRes.repos   || []
  const articles  = newsRes.articles || []

  return (
    <div className="space-y-8">
      <Hero />

      {/* GitHub: Topic = ai */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">GitHub — Topic: ai</h2>
          <a href="/repos?topics=ai" className="text-sm hover:underline opacity-80">عرض الكل</a>
        </div>

        {/* فورم سريع يوجّه إلى /repos مع topics=ai (يمكن تعديلها) */}
        <form action="/repos" className="flex gap-2">
          <input
            name="topics"
            defaultValue="ai"
            placeholder="topic (مثال: ai)"
            className="flex-1 border rounded-md px-3 py-2 bg-white/80 dark:bg-neutral-900/80
                       border-gray-200 dark:border-neutral-700"
          />
          <button className="btn" type="submit">بحث GitHub</button>
        </form>

        {aiRepos.length === 0 ? (
          <p className="text-sm opacity-80">لا توجد نتائج للموضوع ai الآن. جرّب فتح /repos وتغيير الـ topic.</p>
        ) : (
          <ul className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {aiRepos.map((r) => (
              <li key={r.id}>
                <RepoCard
                  fullName={r.fullName}
                  htmlUrl={r.htmlUrl}
                  description={r.description}
                  stars={r.stars}
                  forks={r.forks}
                  language={r.language}
                  owner={r.owner}
                  topics={r.topics}
                  ogImageUrl={r.ogImageUrl}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* أخبار حديثة */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">أخبار حديثة</h2>
          <a href="/news" className="text-sm hover:underline opacity-80">عرض الكل</a>
        </div>
        {articles.length === 0 ? (
          <p className="text-sm opacity-80">لا توجد أخبار الآن.</p>
        ) : (
          <ul className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((a) => (
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
    </div>
  )
}
