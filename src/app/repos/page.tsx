"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Repo } from "@/server/providers/github";
import RepoCard from "@/components/RepoCard";
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton";
import { Pagination } from "@/components/Pagination";
import { RepoFilters } from "@/components/RepoFilters";

function RepoGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <RepoCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

function ReposList({ repos }: { repos: Repo[] }) {
  if (repos.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-200 p-8 dark:border-gray-700">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Repositories Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((r) => (
        <li key={r.id}>
          <RepoCard {...r} />
        </li>
      ))}
    </ul>
  );
}

function ReposPageContent() {
  const searchParams = useSearchParams();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const perPage = 24;

  const fetchReposForClient = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set("perPage", String(perPage));
      const response = await fetch(`/api/repos?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }
      const data = await response.json();
      setRepos(data.repos);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error(error);
      setRepos([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchReposForClient();
  }, [fetchReposForClient]);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-xl font-semibold">Trending Repositories</h1>
        <p className="text-sm opacity-80">
          Discover the most popular and trending open-source AI/ML projects.
        </p>
        <RepoFilters />
      </header>

      {isLoading ? (
        <RepoGridSkeleton />
      ) : (
        <>
          <ReposList repos={repos} />
          <Pagination totalCount={totalCount} perPage={perPage} />
        </>
      )}
    </div>
  );
}

export default function ReposPage() {
  return (
    <Suspense fallback={<RepoGridSkeleton />}>
      <ReposPageContent />
    </Suspense>
  );
}