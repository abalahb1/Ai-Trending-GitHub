/** يحوّل سلسلة مواضيع إلى مصفوفة slugs جاهزة للاستخدام في GitHub topics */
export function normalizeTopicsInput(raw: string): string[] {
  // اعتبر "+" كمسافة (أحيانًا تُكتب يدويًا في URL)
  raw = String(raw ?? "").replace(/\+/g, " ")

  const normDash = (s: string) =>
    s.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-") // شرطات ذكية → "-"
  const stripQuotes = (s: string) =>
    s.replace(/[“”„‟"«»‚‘’‹›']/g, "") // إزالة الاقتباسات

  const slug = (s: string) => {
    const t = normDash(stripQuotes(s))
      .trim()
      .replace(/[ \t\r\n]+/g, "-") // مسافات → "-"
      .replace(/_/g, "-")          // underscores → "-"
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")  // إزالة أي محارف غير مسموحة
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
    return t
  }

  const uniq = <T,>(arr: T[]) => Array.from(new Set(arr))

  // نفصل على الفواصل (الإنكليزية والعربية)، المسافات داخل الموضوع تُحوّل لشرطات
  return uniq(
    raw.split(/[,\u060C،]+/).map(slug).filter(Boolean)
  )
}

/** يحوّل موضوع واحد إلى slug صالح (للاستخدام عند ربط التشيبس) */
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
