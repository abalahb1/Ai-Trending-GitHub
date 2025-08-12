import { fetchTrendingRepos } from "@/server/providers/github";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topics = searchParams.get("topics")?.split(",") || [];
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "24", 10);
  // Note: The 'sort' param is not yet used in fetchTrendingRepos,
  // but we'll add it here in preparation for the next step.
  const sort = searchParams.get("sort") || "stars";

  try {
    const { repos, totalCount } = await fetchTrendingRepos({
      topics,
      page,
      perPage,
    });
    return NextResponse.json({ repos, totalCount });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}