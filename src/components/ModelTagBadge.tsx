"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ModelTagBadge({ tag, type }: { tag: string; type: "primary" | "secondary" }) {
  const searchParams = useSearchParams();
  const currentTags = searchParams.get("tags")?.split(",") || [];
  const isActive = currentTags.includes(tag);

  const getHref = () => {
    const params = new URLSearchParams(searchParams);
    const newTags = isActive
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    if (newTags.length > 0) {
      params.set("tags", newTags.join(","));
    } else {
      params.delete("tags");
    }
    params.set("page", "1");
    return `/huggingface?${params.toString()}`;
  };

  const baseClasses = "rounded-md px-2 py-1 text-xs font-medium transition-colors";
  const typeClasses = {
    primary: `inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 ${isActive ? "ring-2 ring-blue-500" : "hover:bg-blue-200 dark:hover:bg-blue-800"}`,
    secondary: `bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 ${isActive ? "ring-2 ring-blue-500" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`,
  };

  return (
    <Link href={getHref()} className={`${baseClasses} ${typeClasses[type]}`}>
      {tag}
    </Link>
  );
}
