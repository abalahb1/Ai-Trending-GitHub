"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MultiSelect } from "./MultiSelect";
import { popularTopics } from "@/lib/topics";

export function RepoFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTopicsChange = (newTopics: string[]) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (newTopics.length > 0) {
      params.set("topics", newTopics.join(","));
    } else {
      params.delete("topics");
    }
    router.push(`/repos?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("sort", e.target.value);
    router.push(`/repos?${params.toString()}`);
  };

  const selectedTopics = searchParams.get("topics")?.split(",") || [];
  const selectedSort = searchParams.get("sort") || "stars";

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row">
      <div className="flex-grow">
        <MultiSelect
          options={popularTopics}
          selected={selectedTopics}
          onChange={handleTopicsChange}
          placeholder="Select topics..."
        />
      </div>
      <div className="w-full sm:w-48">
        <select
          value={selectedSort}
          onChange={handleSortChange}
          className="block w-full rounded-md border-gray-200 bg-white py-2 px-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        >
          <option value="stars">Sort by Stars</option>
          <option value="forks">Sort by Forks</option>
          <option value="updated">Sort by Updated</option>
        </select>
      </div>
    </div>
  );
}
