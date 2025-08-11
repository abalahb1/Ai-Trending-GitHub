import {
  BookOpen,
  Code,
  GitFork,
  Globe,
  Scale,
  Star,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Repo } from "@/server/providers/github";

type RepoDetailsProps = {
  repository: Repo;
};

function DetailItem({
  icon,
  label,
  value,
  url,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  url?: string;
}) {
  const content = url ? (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="truncate text-blue-600 hover:underline dark:text-blue-400"
    >
      {value}
    </Link>
  ) : (
    <span className="truncate text-gray-700 dark:text-gray-300">{value}</span>
  );

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-1 flex-shrink-0 text-gray-500 dark:text-gray-400">
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        {value && <div className="text-sm">{content}</div>}
      </div>
    </div>
  );
}

export function RepoDetails({ repository }: RepoDetailsProps) {
  const nf = new Intl.NumberFormat("en", { notation: "compact" });

  return (
    <div className="sticky top-8 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          About
        </h2>
      </div>
      <div className="divide-y divide-gray-200 p-4 dark:divide-gray-700">
        <DetailItem
          icon={<Star className="h-5 w-5" />}
          label={`${nf.format(repository.stars)} stars`}
        />
        <DetailItem
          icon={<Eye className="h-5 w-5" />}
          label={`${nf.format(repository.watchers)} watching`}
        />
        <DetailItem
          icon={<GitFork className="h-5 w-5" />}
          label={`${nf.format(repository.forks)} forks`}
        />
        <DetailItem
          icon={<BookOpen className="h-5 w-5" />}
          label={`${nf.format(repository.openIssues)} open issues`}
        />
        {repository.language && (
          <DetailItem
            icon={<Code className="h-5 w-5" />}
            label="Language"
            value={repository.language}
          />
        )}
        {repository.license && (
          <DetailItem
            icon={<Scale className="h-5 w-5" />}
            label="License"
            value={repository.license.name}
          />
        )}
        {repository.homepage && (
          <DetailItem
            icon={<Globe className="h-5 w-5" />}
            label="Website"
            value={repository.homepage}
            url={repository.homepage}
          />
        )}
      </div>
    </div>
  );
}
