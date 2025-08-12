"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  HuggingFaceModel,
  fetchModels,
} from "@/server/providers/huggingface";
import { ModelCard } from "@/components/ModelCard";
import { ModelCardSkeleton } from "@/components/ModelCardSkeleton";
import { SimplePagination } from "@/components/SimplePagination";
import { HuggingFaceFilters } from "@/components/HuggingFaceFilters";

function ModelGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <ModelCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

function HuggingFaceModels({ models }: { models: HuggingFaceModel[] }) {
  if (models.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-200 p-8 dark:border-gray-700">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Models Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((m) => (
        <li key={m.id}>
          <ModelCard {...m} />
        </li>
      ))}
    </ul>
  );
}

type HuggingFacePageContentProps = {
  initialModels: HuggingFaceModel[];
  initialNextPage: number | null;
};

function HuggingFacePageContent({
  initialModels,
  initialNextPage,
}: HuggingFacePageContentProps) {
  const searchParams = useSearchParams();
  const [models, setModels] = useState<HuggingFaceModel[]>(initialModels);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(initialNextPage);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const fetchModelsForClient = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      const response = await fetch(`/api/huggingface?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }
      const data = await response.json();
      setModels(data.models);
      setNextPage(data.nextPage);
    } catch (error) {
      console.error(error);
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    // Skip the initial fetch since we have server-rendered data
    if (currentPage > 1 || searchParams.toString() !== "") {
      fetchModelsForClient();
    }
  }, [fetchModelsForClient, currentPage, searchParams]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-semibold">Hugging Face Models</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {models.length} models
          </p>
        </div>
        <HuggingFaceFilters />
        {isLoading ? (
          <ModelGridSkeleton />
        ) : (
          <HuggingFaceModels models={models} />
        )}
      </section>
      <SimplePagination
        currentPage={currentPage}
        hasNextPage={!!nextPage}
        path="/huggingface"
      />
    </div>
  );
}

export default async function HuggingFacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = parseInt(searchParams.page as string || "1", 10);
  const search = searchParams.search as string || undefined;
  const author = searchParams.author as string || undefined;
  const tags = (searchParams.tags as string)?.split(",") || undefined;
  const sort = searchParams.sort as string || "downloads";
  const direction = searchParams.direction as string || "-1";

  const { models, nextPage } = await fetchModels({
    page,
    search,
    author,
    tags,
    sort,
    direction,
    limit: 20,
  });

  return (
    <Suspense fallback={<ModelGridSkeleton />}>
      <HuggingFacePageContent
        initialModels={models}
        initialNextPage={nextPage}
      />
    </Suspense>
  );
}