"use client";

import Link from "next/link";
import * as React from "react";
import { Star, GitFork, ExternalLink } from "lucide-react";
import Image from "next/image";
import { TopicBadge } from "./TopicBadge";
import { SaveButton } from "./SaveButton";
import { Repo } from "@/server/providers/github";

function LanguageBadge({ language }: { language: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
      {language}
    </span>
  );
}

export default function RepoCard(props: Repo) {
  const {
    fullName,
    description,
    stars,
    forks,
    language,
    owner,
    topics = [],
    ogImageUrl,
    htmlUrl,
  } = props;
  const nf = React.useMemo(
    () => new Intl.NumberFormat("en", { notation: "compact" }),
    [],
  );

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <Link href={`/repo/${fullName}`} className="block">
        <Image
          src={ogImageUrl || owner.avatarUrl}
          alt={fullName}
          width={400}
          height={200}
          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-grow flex-col p-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <Image
              src={owner.avatarUrl}
              alt={owner.login}
              width={24}
              height={24}
              className="rounded-full"
            />
            <Link
              href={`/repo/${fullName}`}
              className="text-base font-semibold text-gray-800 hover:underline dark:text-gray-100"
            >
              {fullName}
            </Link>
          </div>

          {description && (
            <p className="mt-3 flex-grow text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {description}
            </p>
          )}
        </div>

        {!!topics.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.slice(0, 4).map((t) => (
              <TopicBadge key={t} topic={t} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex items-center gap-x-4">
          <span
            className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400"
            title="Stars"
          >
            <Star size={16} className="text-yellow-500" /> {nf.format(stars)}
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400"
            title="Forks"
          >
            <GitFork size={16} /> {nf.format(forks)}
          </span>
        </div>
        {language && <LanguageBadge language={language} />}
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-2">
        <SaveButton
          item={{
            type: "repo",
            title: fullName,
            url: htmlUrl,
            source: "GitHub",
            data: props,
          }}
        />
        <a
          href={htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-gray-600 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-white/80 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-900/80"
          title="View on GitHub"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </article>
  );
}