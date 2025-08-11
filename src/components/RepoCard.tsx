"use client";

import Link from "next/link";
import * as React from "react";
import { Star, GitFork } from "lucide-react";
import Image from "next/image";
import { TopicBadge } from "./TopicBadge";
import { SaveButton } from "./SaveButton";

export type RepoCardProps = {
  fullName: string;
  htmlUrl: string;
  description?: string;
  stars: number;
  forks: number;
  language?: string;
  owner: { login: string; avatarUrl: string };
  topics?: string[];
  ogImageUrl?: string;
};

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`badge ${className}`}>{children}</span>;
}

export default function RepoCard(props: RepoCardProps) {
  const {
    fullName,
    description,
    stars,
    forks,
    language,
    owner,
    topics = [],
  } = props;
  const nf = React.useMemo(
    () => new Intl.NumberFormat("en", { maximumFractionDigits: 0 }),
    [],
  );

  return (
    <article className="relative group flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400">
      <div className="flex items-center gap-3">
        <Image
          src={owner.avatarUrl}
          alt={owner.login}
          width={32}
          height={32}
          className="rounded-full"
        />
        <Link
          href={`/repo/${fullName}`}
          className="font-semibold text-gray-800 hover:underline dark:text-gray-100"
        >
          {fullName}
        </Link>
      </div>

      {description && (
        <p className="mt-3 flex-grow text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <Star size={14} /> {nf.format(stars)}
        </span>
        <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <GitFork size={14} /> {nf.format(forks)}
        </span>
        {language && <Badge>{language}</Badge>}
      </div>

      {!!topics.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.slice(0, 4).map(t => (
            <TopicBadge key={t} topic={t} />
          ))}
        </div>
      )}
      <Link
        href={`/repo/${fullName}`}
        className="absolute inset-0 z-0"
        aria-label={`View details for ${fullName}`}
      />
      <SaveButton
        item={{
          type: "repo",
          title: fullName,
          url: props.htmlUrl,
          source: "GitHub",
          data: props,
        }}
      />
    </article>
  );
}

