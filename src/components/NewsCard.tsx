"use client"

import * as React from "react"
import { Globe } from "lucide-react"

type Props = {
  title: string
  url: string
  source: string
  publishedAt: string
  summary?: string
  imageUrl?: string
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>
}

export default function NewsCard({ title, url, source, publishedAt, summary, imageUrl }: Props) {
  const pretty = React.useMemo(() => {
    const d = new Date(publishedAt)
    if (isNaN(d.getTime())) return publishedAt
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
      timeZone: "Asia/Baghdad"
    }).format(d)
  }, [publishedAt])

  const iso = (() => {
    const d = new Date(publishedAt); return isNaN(d.getTime()) ? undefined : d.toISOString()
  })()

  return (
    <article className="card hover:translate-y-[-2px]">
      {imageUrl && (
        <div className="relative h-40 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="p-4 space-y-3">
        <a className="font-semibold hover:underline" href={url} target="_blank" rel="noreferrer">{title}</a>
        {summary && <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{summary}</p>}
        <div className="flex items-center gap-2 text-xs">
          <Badge className="inline-flex items-center gap-1"><Globe size={14} /> {source}</Badge>
          <time dateTime={iso} className="opacity-70" suppressHydrationWarning>{pretty}</time>
        </div>
      </div>

      <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0" aria-label={title} />
    </article>
  )
}
