export function toTopicSlug(s: string): string | null {
  const normDash = (x: string) => x.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-")
  const stripQuotes = (x: string) => x.replace(/[“”„‟"«»‚‘’‹›']/g, "")
  const t = normDash(stripQuotes(String(s).replace(/\+/g, " ")))
    .trim()
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
  return t && /^[a-z0-9][a-z0-9-]*$/.test(t) ? t : null
}
