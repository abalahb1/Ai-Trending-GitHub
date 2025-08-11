export function RepoCardSkeleton() {
  return (
    <div className="h-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mt-3 h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-1 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 flex items-center gap-x-4 gap-y-2">
          <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}