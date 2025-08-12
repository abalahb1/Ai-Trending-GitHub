/** Converts a raw topics string into an array of slugs suitable for GitHub */
export function normalizeTopicsInput(raw: string): string[] {
  // Treat "+" as a space (sometimes used in manual URLs)
  raw = String(raw ?? "").replace(/\+/g, " ");

  const normDash = (s: string) =>
    s.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-"); // smart dashes -> "-"
  const stripQuotes = (s: string) => s.replace(/[“”„‟"«»‚‘’‹›']/g, ""); // remove quotes

  const slug = (s: string) => {
    const t = normDash(stripQuotes(s))
      .trim()
      .replace(/[ \t\r\n]+/g, "-") // whitespace -> "-"
      .replace(/_/g, "-") // underscores -> "-"
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") // remove disallowed chars
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    return t;
  };

  const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

  // Split by comma (English and Arabic), spaces inside topics are converted to dashes
  return uniq(
    raw
      .split(/[,\u060C،]+/)
      .map(slug)
      .filter(Boolean),
  );
}

/** Converts a single topic to a valid slug (for linking from chips) */
export function toTopicSlug(s: string): string | null {
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

export const popularTopics = [
  "ai",
  "machine-learning",
  "deep-learning",
  "nlp",
  "computer-vision",
  "generative-ai",
  "llm",
  "agents",
  "pytorch",
  "tensorflow",
  "jax",
  "stable-diffusion",
  "large-language-models",
  "transformer",
  "data-science",
  "data-visualization",
  "data-analysis",
  "reinforcement-learning",
  "robotics",
  "self-driving-cars",
  "speech-recognition",
  "image-generation",
  "text-to-image",
  "text-to-speech",
  "neural-network",
  "awesome-list",
];