export function NewsCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="animate-pulse">
        <div className="h-40 w-full bg-gray-200 dark:bg-gray-700" />
        <div className="p-4">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-1 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-4 flex items-center justify-between">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}