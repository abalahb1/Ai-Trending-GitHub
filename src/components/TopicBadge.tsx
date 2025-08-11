"use client";

import Link from "next/link";
import { toTopicSlug } from "@/lib/topics";

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`badge ${className}`}>{children}</span>;
}

export function TopicBadge({ topic }: { topic: string }) {
  const slug = toTopicSlug(topic);
  if (!slug) return null;

  return (
    <Link
      href={`/repos?topics=${encodeURIComponent(slug)}`}
      prefetch={false}
      className="no-underline relative z-10"
      title={`Find repos with topic: ${slug}`}
      onClick={e => e.stopPropagation()} // Prevent card click
    >
      <Badge className="cursor-pointer hover:underline">{topic}</Badge>
    </Link>
  );
}
