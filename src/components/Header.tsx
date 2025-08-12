import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Search } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60 bg-white/80 dark:bg-neutral-900/80 border-b border-gray-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold tracking-tight">
            AI/ML Pulse
          </Link>
          <nav className="hidden sm:flex items-center gap-3 text-sm">
            <Link href="/news" className="hover:underline">
              News
            </Link>
            <Link href="/repos" className="hover:underline">
              Repos
            </Link>
            <Link href="/huggingface" className="hover:underline">
              Hugging Face
            </Link>
            <Link href="/dashboard" className="hover:underline">
              Saved
            </Link>
          </nav>
        </div>
        <div className="flex-1 flex justify-center px-4">
          <form action="/search" className="w-full max-w-md">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="q"
                placeholder="Search..."
                className="block w-full rounded-md border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <UserMenu session={session} />
          ) : (
            <a className="btn" href="/api/auth/signin">
              Sign In
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
