import { Github, Star, GitFork, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Repo } from "@/server/providers/github";

type RepoHeaderProps = {
  repository: Repo;
};

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
      {icon}
      <span className="font-semibold text-gray-900 dark:text-white">
        {value}
      </span>
      <span>{label}</span>
    </div>
  );
}

export function RepoHeader({ repository }: RepoHeaderProps) {
  const nf = new Intl.NumberFormat("en", { notation: "compact" });

  return (
    <div className="border-b border-gray-200 bg-white/50 py-8 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={repository.owner.avatarUrl}
              alt={repository.owner.login}
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              <Link
                href={repository.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {repository.fullName}
              </Link>
            </h1>
          </div>
          <Link
            href={repository.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 sm:flex"
          >
            <Github className="h-5 w-5" />
            <span>View on GitHub</span>
          </Link>
        </div>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400 md:text-lg">
          {repository.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <StatItem
            icon={<Star className="h-4 w-4" />}
            value={nf.format(repository.stars)}
            label="stars"
          />
          <StatItem
            icon={<GitFork className="h-4 w-4" />}
            value={nf.format(repository.forks)}
            label="forks"
          />
          <StatItem
            icon={<Eye className="h-4 w-4" />}
            value={nf.format(repository.watchers)}
            label="watchers"
          />
        </div>
      </div>
    </div>
  );
}
