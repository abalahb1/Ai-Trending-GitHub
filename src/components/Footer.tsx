export function Footer() {
  const owner = process.env.NEXT_PUBLIC_OWNER_NAME || "Site Owner";
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t border-gray-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-6 text-sm flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <p className="opacity-80">
          © {year} {owner}. All rights reserved.
        </p>
        <div className="opacity-70">AI/ML Pulse — A light & fast interface</div>
      </div>
    </footer>
  );
}
