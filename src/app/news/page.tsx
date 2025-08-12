import { fetchNews } from "@/server/providers/news";
import NewsCard from "@/components/NewsCard";
import { Search } from "lucide-react";
import { Suspense } from "react";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

function NewsGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <NewsCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

async function NewsList({ q, language, sort, pageSize }: any) {
  const { articles } = await fetchNews({
    q,
    language,
    sort: sort as any,
    pageSize,
  });

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No results found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map(a => (
        <li key={a.id}>
          <NewsCard {...a} />
        </li>
      ))}
    </ul>
  );
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const q =
    (Array.isArray(sp.q) ? sp.q[0] : sp.q) ||
    '(AI OR "machine learning" OR LLM)';
  const language =
    (Array.isArray(sp.language) ? sp.language[0] : sp.language) || "en";
  const sort =
    (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) || "publishedAt";
  const pageSize =
    Number(Array.isArray(sp.pageSize) ? sp.pageSize[0] : sp.pageSize) || 24;

  return (
    <section className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Latest AI/ML News
        </h1>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <form className="grid grid-cols-1 gap-4 sm:grid-cols-4" action="/news">
            <div className="sm:col-span-2">
              <label htmlFor="q" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="q"
                  name="q"
                  defaultValue={q}
                  placeholder='Search (e.g., "LLM")'
                  className="block w-full rounded-md border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div>
              <label htmlFor="language" className="sr-only">
                Language
              </label>
              <select
                id="language"
                name="language"
                defaultValue={language}
                className="block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="publishedAt">Latest</option>
                <option value="relevancy">Relevant</option>
                <option value="popularity">Popular</option>
              </select>
            </div>
            <div className="sm:col-span-4">
              <button className="btn w-full sm:w-auto" type="submit">
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      </header>

      <Suspense fallback={<NewsGridSkeleton />}>
        <NewsList
          q={q}
          language={language}
          sort={sort}
          pageSize={pageSize}
        />
      </Suspense>
    </section>
  );
}
