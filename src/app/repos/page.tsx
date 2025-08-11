import RepoCard from "@/components/RepoCard";
import { fetchTrendingRepos } from "@/server/providers/github";
import { Pagination } from "@/components/Pagination";
import { Suspense } from "react";
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
const toTopics = (v?: string | string[]) =>
  (Array.isArray(v) ? v : [v ?? ""])
    .flatMap(s => String(s).split(/[,\u060C،\s]+/))
    .map(s => s.trim())
    .filter(Boolean);

function RepoGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <RepoCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

async function RepoList({ topics, page, perPage }: any) {
  const { repos, totalCount } = await fetchTrendingRepos({
    topics,
    perPage,
    page,
  });

  if (repos.length === 0) {
    return (
      <p className="text-sm opacity-80">
        No results found — try a different or less specific topic.
      </p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {repos.map(r => (
          <li key={r.id}>
            <RepoCard {...r} />
          </li>
        ))}
      </ul>
      <Pagination totalCount={totalCount} perPage={perPage} />
    </>
  );
}

export default async function ReposPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const topics = toTopics(sp.topics);
  const page = Number(first(sp.page)) || 1;
  const perPage = 24;

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-xl font-semibold">Trending Repositories</h1>
        <p className="text-sm opacity-80">
          Select one or more topics to discover relevant repositories.
        </p>

        <form
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          action="/repos"
        >
          <label className="flex flex-col gap-1 text-sm sm:col-span-3 lg:col-span-4">
            <span>Topics</span>
            <input
              name="topics"
              defaultValue={topics.join(",")}
              placeholder="ai, machine-learning, nlp, computer-vision, agents"
              className="border rounded px-2 py-1 bg-transparent border-gray-200 dark:border-neutral-700"
            />
          </label>
          <div className="flex items-end">
            <button className="border rounded px-3 py-1">Apply</button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            "ai",
            "machine-learning",
            "deep-learning",
            "nlp",
            "computer-vision",
            "agents",
            "generative-ai",
            "llm",
          ].map(t => (
            <a
              key={t}
              href={`/repos?topics=${encodeURIComponent(t)}`}
              className="badge hover:underline"
            >
              {t}
            </a>
          ))}
        </div>
      </header>

      <Suspense fallback={<RepoGridSkeleton />}>
        <RepoList topics={topics} page={page} perPage={perPage} />
      </Suspense>
    </section>
  );
}
