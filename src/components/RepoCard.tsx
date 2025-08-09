"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { Star, GitFork, Globe } from "lucide-react"
import { toTopicSlug } from "@/lib/topics"

export type RepoCardProps = {
  fullName: string
  htmlUrl: string
  description?: string
  stars: number
  forks: number
  language?: string
  owner: { login: string; avatarUrl: string }
  topics?: string[]
  ogImageUrl?: string
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`badge ${className}`}>{children}</span>
}

export default function RepoCard(props: RepoCardProps) {
  const { fullName, htmlUrl, description, stars, forks, language, owner, topics = [], ogImageUrl } = props
  const nf = React.useMemo(() => new Intl.NumberFormat("en", { maximumFractionDigits: 0 }), [])

  return (
    <article className="card group hover:translate-y-[-2px] relative">
      <div className="relative h-40 w-full bg-neutral-50 dark:bg-neutral-800">
        {ogImageUrl && (
          <Image src={ogImageUrl} alt={fullName} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Image src={owner.avatarUrl} alt={owner.login} width={36} height={36} className="rounded-full border border-gray-200 dark:border-neutral-700" />
          {/* الرابط على العنوان فقط */}
          <a className="font-semibold hover:underline" href={htmlUrl} target="_blank" rel="noreferrer">{fullName}</a>
        </div>

        {description && <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{description}</p>}

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1 badge"><Star size={14} /> {nf.format(stars)}</span>
          <span className="inline-flex items-center gap-1 badge"><GitFork size={14} /> {nf.format(forks)}</span>
          {language && <Badge>{language}</Badge>}
        </div>

        {!!topics.length && (
          <div className="flex flex-wrap gap-2">
            {topics.slice(0, 6).map((t) => {
              const slug = toTopicSlug(t)
              if (!slug) return null
              return (
                <Link
                  key={t}
                  href={`/repos?topics=${encodeURIComponent(slug)}`}
                  prefetch={false}
                  className="no-underline"
                  title={`ابحث عن topic: ${slug}`}
                >
                  <Badge className="cursor-pointer hover:underline">{t}</Badge>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* تمت إزالة الرابط المُغطّي للبطاقة كي لا يمنع نقر التشيبس */}
    </article>
  )
}
