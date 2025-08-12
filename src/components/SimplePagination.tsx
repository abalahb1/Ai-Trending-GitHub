"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SimplePaginationProps = {
  currentPage: number;
  hasNextPage: boolean;
  path: string;
};

export function SimplePagination({
  currentPage,
  hasNextPage,
  path,
}: SimplePaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${path}?${params.toString()}`;
  };

  return (
    <nav
      className="flex items-center justify-center space-x-4"
      aria-label="Pagination"
    >
      {currentPage > 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className="inline-flex items-center gap-x-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      )}
      <span className="font-medium">{currentPage}</span>
      {hasNextPage && (
        <Link
          href={createPageURL(currentPage + 1)}
          className="inline-flex items-center gap-x-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
