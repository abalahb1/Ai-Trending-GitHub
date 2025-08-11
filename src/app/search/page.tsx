import { fetchNews } from "@/server/providers/news";
import { fetchTrendingRepos } from "@/server/providers/github";
import NewsCard from "@/components/NewsCard";
import RepoCard from "@/components/RepoCard";
import Link from "next/link";
import { Suspense } from "react";
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

function RepoGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i}>
          <RepoCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

function NewsGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i}>
          <NewsCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

async function SearchResults({ q, tab }: { q: string; tab: string }) {
  const [newsRes, reposRes] = await Promise.all([
    fetchNews({ q, pageSize: 12 }),
    fetchTrendingRepos({ topics: [q], perPage: 12 }),
  ]);

  const articles = newsRes.articles || [];
  const repos = reposRes.repos || [];

  const showNews = tab === "all" || tab === "news";
  const showRepos = tab === "all" || tab === "repos";

  return (
    <>
      {showNews && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">News</h2>
          {articles.length === 0 ? (
            <p className="text-sm text-gray-500">No news articles found.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {articles.map(a => (
                <li key={a.id}>
                  <NewsCard {...a} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {showRepos && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Repositories</h2>
          {repos.length === 0 ? (
            <p className="text-sm text-gray-500">No repositories found.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {repos.map(r => (
                <li key={r.id}>
                  <RepoCard {...r} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q) || "";
  const tab = (Array.isArray(sp.tab) ? sp.tab[0] : sp.tab) || "all";

  return (
    <section className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Search Results for "{q}"
        </h1>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <Link
              href={`/search?q=${q}&tab=all`}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                tab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              All
            </Link>
            <Link
              href={`/search?q=${q}&tab=news`}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                tab === "news"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              News
            </Link>
            <Link
              href={`/search?q=${q}&tab=repos`}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                tab === "repos"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Repositories
            </Link>
          </nav>
        </div>
      </header>

      <Suspense
        fallback={
          <>
            <NewsGridSkeleton />
            <RepoGridSkeleton />
          </>
        }
      >
        <SearchResults q={q} tab={tab} />
      </Suspense>
    </section>
  );
}