"use client";

import * as React from "react";
import { Globe, Calendar } from "lucide-react";
import { SaveButton } from "./SaveButton";

type Props = {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary?: string;
  imageUrl?: string;
};

export default function NewsCard(props: Props) {
  const { title, url, source, publishedAt, summary, imageUrl } = props;

  const publishedDate = React.useMemo(() => {
    const date = new Date(publishedAt);
    if (isNaN(date.getTime())) return null;
    return date;
  }, [publishedAt]);

  const formattedDate = publishedDate
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(publishedDate)
    : null;

  return (
    <article className="relative group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Globe className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
      </a>
      <div className="flex flex-grow flex-col p-5">
        <h2 className="flex-grow text-base font-semibold text-gray-800 dark:text-gray-100">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {title}
          </a>
        </h2>
        {summary && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {summary}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Globe size={16} /> {source}
          </span>
          {formattedDate && (
            <time
              dateTime={publishedDate?.toISOString()}
              className="inline-flex items-center gap-1.5"
            >
              <Calendar size={16} />
              {formattedDate}
            </time>
          )}
        </div>
      </div>
      <SaveButton
        item={{
          type: "article",
          title,
          url,
          source,
          data: props,
        }}
      />
    </article>
  );
}
