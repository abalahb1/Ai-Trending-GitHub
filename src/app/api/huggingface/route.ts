import { fetchModels } from "@/server/providers/huggingface";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const author = searchParams.get("author") || undefined;
  const tags = searchParams.get("tags")?.split(",") || undefined;
  const sort = searchParams.get("sort") || "downloads";
  const direction = searchParams.get("direction") || "-1";
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);

  try {
    const { models, nextPage } = await fetchModels({
      search,
      author,
      tags,
      sort,
      direction,
      limit,
      page,
    });
    const response = NextResponse.json({ models, nextPage });
    response.headers.set(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate"
    );
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
