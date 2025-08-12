import Hero from "@/components/home/Hero";
import { fetchNews } from "@/server/providers/news";
import { fetchTrendingRepos } from "@/server/providers/github";
import NewsCard from "@/components/NewsCard";
import RepoCard from "@/components/RepoCard";
import { Suspense } from "react";
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";

export const dynamic = "force-dynamic";

function RepoGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i}>
          <RepoCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

function NewsGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i}>
          <NewsCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

async function TrendingRepos() {
  const { repos } = await fetchTrendingRepos({ topics: ["ai"], perPage: 8 });
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map(r => (
        <li key={r.id}>
          <RepoCard {...r} />
        </li>
      ))}
    </ul>
  );
}

async function RecentNews() {
  const { articles } = await fetchNews({
    pageSize: 8,
    sort: "publishedAt",
    language: "en",
  });
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

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Hero />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">GitHub — Topic: ai</h2>
          <a
            href="/repos?topics=ai"
            className="text-sm hover:underline opacity-80"
          >
            View All
          </a>
        </div>
        <Suspense fallback={<RepoGridSkeleton />}>
          <TrendingRepos />
        </Suspense>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent News</h2>
          <a href="/news" className="text-sm hover:underline opacity-80">
            View All
          </a>
        </div>
        <Suspense fallback={<NewsGridSkeleton />}>
          <RecentNews />
        </Suspense>
      </section>
    </div>
  );
}
