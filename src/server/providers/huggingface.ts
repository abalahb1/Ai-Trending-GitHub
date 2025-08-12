import { z } from "zod";

const ModelSchema = z.object({
  id: z.string(),
  author: z.string(),
  downloads: z.number(),
  likes: z.number(),
  lastModified: z.string(),
  tags: z.array(z.string()),
  pipeline_tag: z.string().optional(),
  library_name: z.string().optional(),
  description: z.string().optional(),
});

const ModelsResponseSchema = z.array(ModelSchema);

export type HuggingFaceModel = z.infer<typeof ModelSchema>;

export async function fetchModels(options: {
  search?: string;
  author?: string;
  tags?: string[];
  sort?: string;
  direction?: string;
  limit?: number;
  full?: boolean;
  config?: boolean;
  page?: number;
}) {
  const {
    search,
    author,
    tags,
    sort = "downloads",
    direction = "-1",
    limit = 20,
    full = true,
    config = true,
    page = 1,
  } = options;

  const params = new URLSearchParams({
    sort,
    direction,
    limit: limit.toString(),
    full: full.toString(),
    config: config.toString(),
  });

  if (search) {
    params.append("search", search);
  }
  if (author) {
    params.append("author", author);
  }
  if (tags && tags.length > 0) {
    params.append("filter", tags.join(","));
  }

  const headers: HeadersInit = {};
  if (process.env.HF_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.HF_TOKEN}`;
  }

  const response = await fetch(`https://huggingface.co/api/models?${params.toString()}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }

  const models = await response.json();
  const validatedModels = ModelsResponseSchema.parse(models);

  return {
    models: validatedModels,
    nextPage: validatedModels.length === limit ? page + 1 : null,
  };
}
