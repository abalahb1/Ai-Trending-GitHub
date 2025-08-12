"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import { MultiSelect } from "./MultiSelect";
import { hfTags } from "@/lib/hf-tags";

function FilterPill({
  name,
  value,
  onRemove,
}: {
  name: string;
  value: string;
  onRemove: (name: string, value?: string) => void;
}) {
  return (
    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
      <span className="font-semibold">{name}:</span>
      {value}
      <button
        type="button"
        onClick={() => onRemove(name, value)}
        className="group"
      >
        <X className="h-3 w-3 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
      </button>
    </span>
  );
}

export function HuggingFaceFilters() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleFilterChange = useDebouncedCallback(
    (term: string, name: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if (term) {
        params.set(name, term);
      } else {
        params.delete(name);
      }
      replace(`?${params.toString()}`);
    },
    300
  );

  const handleTagsChange = (newTags: string[]) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (newTags.length > 0) {
      params.set("tags", newTags.join(","));
    } else {
      params.delete("tags");
    }
    replace(`?${params.toString()}`);
  };

  const handleSortDirectionChange = () => {
    const params = new URLSearchParams(searchParams);
    const currentDirection = params.get("direction") || "-1";
    params.set("direction", currentDirection === "-1" ? "1" : "-1");
    replace(`?${params.toString()}`);
  };

  const handleRemoveFilter = (name: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (name === "tags" && value) {
      const currentTags = params.get("tags")?.split(",") || [];
      const newTags = currentTags.filter((t) => t !== value);
      if (newTags.length > 0) {
        params.set("tags", newTags.join(","));
      } else {
        params.delete("tags");
      }
    } else {
      params.delete(name);
    }
    replace(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    replace("/huggingface");
  };

  const search = searchParams.get("search");
  const author = searchParams.get("author");
  const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const sort = searchParams.get("sort") || "downloads";
  const direction = searchParams.get("direction") || "-1";

  const hasFilters = search || author || tags.length > 0 || sort !== "downloads";

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          name="search"
          placeholder="Search models..."
          defaultValue={search || ""}
          onChange={(e) => handleFilterChange(e.target.value, "search")}
          className="block w-full rounded-md border-gray-200 bg-white py-2 px-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />
        <input
          name="author"
          placeholder="Filter by author..."
          defaultValue={author || ""}
          onChange={(e) => handleFilterChange(e.target.value, "author")}
          className="block w-full rounded-md border-gray-200 bg-white py-2 px-3 text.sm placeholder-gray-500 focus:border-blue-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />
        <MultiSelect
          options={hfTags}
          selected={tags}
          onChange={handleTagsChange}
          placeholder="Filter by tags..."
        />
        <div className="flex gap-2">
          <select
            name="sort"
            value={sort}
            onChange={(e) => handleFilterChange(e.target.value, "sort")}
            className="block w-full rounded-md border-gray-200 bg-white py-2 px-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          >
            <option value="downloads">Sort by Downloads</option>
            <option value="likes">Sort by Likes</option>
            <option value="lastModified">Sort by Last Modified</option>
          </select>
          <button
            type="button"
            onClick={handleSortDirectionChange}
            className="flex-shrink-0 rounded-md border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {direction === "-1" ? (
              <ArrowDown className="h-5 w-5" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {search && (
            <FilterPill
              name="search"
              value={search}
              onRemove={handleRemoveFilter}
            />
          )}
          {author && (
            <FilterPill
              name="author"
              value={author}
              onRemove={handleRemoveFilter}
            />
          )}
          {tags.map((tag) => (
            <FilterPill
              key={tag}
              name="tags"
              value={tag}
              onRemove={handleRemoveFilter}
            />
          ))}
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-x-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        </div>
      )}
    </form>
  );
}