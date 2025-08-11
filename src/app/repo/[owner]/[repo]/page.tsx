import { getReadme, getRepoDetails } from "@/server/providers/github";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Readme } from "./_components/readme";
import { RepoDetails } from "./_components/repo-details";
import { RepoHeader } from "./_components/repo-header";

interface PageProps {
  params: {
    owner: string;
    repo: string;
  };
}

export default async function RepoPage({ params }: PageProps) {
  const fullName = `${params.owner}/${params.repo}`;

  const [repository, readme] = await Promise.all([
    getRepoDetails(fullName),
    getReadme(fullName),
  ]);

  if (!repository) {
    notFound();
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <RepoHeader repository={repository} />
      <div className="container mx-auto grid grid-cols-12 gap-8 px-4 py-8 animate-fade-in">
        <main className="col-span-12 lg:col-span-9">
          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-lg bg-white p-6 shadow-md dark:bg-gray-800" />
            }
          >
            <Readme content={readme} />
          </Suspense>
        </main>
        <aside className="col-span-12 lg:col-span-3">
          <RepoDetails repository={repository} />
        </aside>
      </div>
    </div>
  );
}
