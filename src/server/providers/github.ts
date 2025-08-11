export type Repo = {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  htmlUrl: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  language?: string;
  license?: { name: string };
  owner: { login: string; avatarUrl: string };
  topics: string[];
  homepage?: string;
  ogImageUrl?: string;
};

export type RepoQuery = {
  topics?: string[];
  perPage?: number;
  page?: number;
};

// slugifyTopic: handles "+", spaces, underscores, quotes, and smart dashes
function slugifyTopic(s: string) {
  const normDash = (x: string) =>
    x.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-");
  const stripQuotes = (x: string) => x.replace(/[“”„‟"«»‚‘’‹›']/g, "");
  const t = normDash(stripQuotes(String(s).replace(/\+/g, " ")))
    .trim()
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return t && /^[a-z0-9][a-z0-9-]*$/.test(t) ? t : null;
}

async function searchOnce(
  q: string,
  perPage = 24,
  page = 1,
  headers: Record<string, string>,
) {
  const params = new URLSearchParams({
    q,
    sort: "stars",
    order: "desc",
    per_page: String(perPage),
    page: String(page),
  });

  const url = "https://api.github.com/search/repositories?" + params;
  const r = await fetch(url, { headers, next: { revalidate: 300 } });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    if (r.status === 422) {
      return { items: [], total_count: 0 };
    }
    throw new Error(`GitHub search failed ${r.status}: ${body}`);
  }
  const data = await r.json();
  return {
    items: (data.items ?? []) as any[],
    total_count: data.total_count ?? 0,
  };
}

function mapRepo(x: any): Repo {
  return {
    id: x.id,
    name: x.name,
    fullName: x.full_name,
    description: x.description || undefined,
    htmlUrl: x.html_url,
    stars: x.stargazers_count,
    forks: x.forks_count,
    watchers: x.watchers_count,
    openIssues: x.open_issues_count,
    language: x.language || undefined,
    license: x.license ? { name: x.license.name } : undefined,
    owner: { login: x.owner?.login, avatarUrl: x.owner?.avatar_url },
    topics: Array.isArray(x.topics) ? x.topics : [],
    homepage: x.homepage || undefined,
    ogImageUrl: `https://opengraph.githubassets.com/1/${x.full_name}`,
  };
}

export async function fetchTrendingRepos({
  topics = [],
  perPage = 24,
  page = 1,
}: RepoQuery = {}): Promise<{ repos: any[]; totalCount: number }> {
  const defaults = [
    "ai",
    "machine-learning",
    "deep-learning",
    "nlp",
    "computer-vision",
    "agents",
    "llm",
    "generative-ai",
  ];
  const normalized = (topics.length ? topics : defaults)
    .map(slugifyTopic)
    .filter((t): t is string => Boolean(t));

  const subject = normalized.length
    ? normalized.map(t => `topic:${t}`).join(" OR ")
    : "topic:ai";

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ai-ml-pulse",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  let result = await searchOnce(subject, perPage, page, headers);

  // Fallback: if it returns [], (e.g. due to 422), try each topic alone
  if ((!result.items || result.items.length === 0) && normalized.length) {
    const all: any[] = [];
    for (const t of normalized) {
      const chunk = await searchOnce(
        `topic:${t}`,
        Math.max(6, Math.ceil(perPage / normalized.length)),
        page,
        headers,
      );
      all.push(...chunk.items);
    }
    // De-duplicate the results
    const uniqueRepos = Array.from(new Map(all.map(item => [item.id, item])).values());
    result = { items: uniqueRepos, total_count: uniqueRepos.length };
  }

  return {
    repos: result.items.map(mapRepo),
    totalCount: result.total_count,
  };
}

export default fetchTrendingRepos

// Back-compat: some routes import `fetchRepos`
export { fetchTrendingRepos as fetchRepos };

export async function getRepoDetails(fullName: string): Promise<Repo | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ai-ml-pulse",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${fullName}`;
  const r = await fetch(url, { headers, next: { revalidate: 300 } });

  if (!r.ok) {
    if (r.status === 404) {
      return null;
    }
    const body = await r.text().catch(() => "");
    throw new Error(`GitHub repo fetch failed ${r.status}: ${body}`);
  }

  const data = await r.json();
  return mapRepo(data);
}

export async function getReadme(fullName: string): Promise<string | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw",
    "User-Agent": "ai-ml-pulse",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${fullName}/readme`;
  const r = await fetch(url, { headers, next: { revalidate: 300 } });

  if (!r.ok) {
    return null;
  }

  return r.text();
}


