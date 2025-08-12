"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  totalCount: number;
  perPage: number;
};

const DOTS = "...";

function usePagination({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}) {
  const totalPageCount = Math.ceil(totalCount / pageSize);

  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount,
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
}

function range(start: number, end: number) {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
}

export function Pagination({ totalCount, perPage }: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalCount / perPage);

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    pageSize: perPage,
  });

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(pageNumber));
    return `/repos?${params.toString()}`;
  };

  if (currentPage === 0 || !paginationRange || paginationRange.length < 2) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-800"
      aria-label="Pagination"
    >
      <div className="flex flex-1 justify-between sm:hidden">
        {currentPage > 1 && (
          <Link
            href={createPageURL(currentPage - 1)}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={createPageURL(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Next
          </Link>
        )}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          {totalCount > 0 && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * perPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * perPage, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span> results
          </p>
          )}
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {currentPage > 1 && (
              <Link
                href={createPageURL(currentPage - 1)}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-600 dark:hover:bg-gray-700"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}
            {paginationRange.map((pageNumber, index) => {
              if (pageNumber === DOTS) {
                return (
                  <span
                    key={`${pageNumber}-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-600"
                  >
                    ...
                  </span>
                );
              }

              return (
                <Link
                  key={pageNumber}
                  href={createPageURL(pageNumber)}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === pageNumber
                      ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
            {currentPage < totalPages && (
              <Link
                href={createPageURL(currentPage + 1)}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-600 dark:hover:bg-gray-700"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}