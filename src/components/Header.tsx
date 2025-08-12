"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, Menu, X } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold tracking-tight">
            AI/ML Pulse
          </Link>
        </div>

        <div className="hidden flex-1 justify-center px-4 sm:flex">
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

        <div className="hidden items-center gap-3 text-sm sm:flex">
          <Link href="/news" className="hover:underline">
            News
          </Link>
          <Link href="/repos" className="hover:underline">
            Repos
          </Link>
          <Link href="/huggingface" className="hover:underline">
            Hugging Face
          </Link>
          {session?.user && (
            <Link href="/dashboard" className="hover:underline">
              Saved
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            {session?.user ? (
              <UserMenu session={session} />
            ) : (
              <a
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                href="/api/auth/signin"
              >
                Sign In
              </a>
            )}
          </div>
          <button
            className="p-2 sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="bg-white dark:bg-neutral-900 sm:hidden">
          <nav className="flex flex-col gap-4 p-4">
            <form action="/search" className="w-full">
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
            <Link href="/news" className="hover:underline">
              News
            </Link>
            <Link href="/repos" className="hover:underline">
              Repos
            </Link>
            <Link href="/huggingface" className="hover:underline">
              Hugging Face
            </Link>
            {session?.user && (
              <Link href="/dashboard" className="hover:underline">
                Saved
              </Link>
            )}
            <div className="border-t border-gray-200 pt-4 dark:border-neutral-800">
              {session?.user ? (
                <UserMenu session={session} />
              ) : (
                <a
                  className="block w-full rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                  href="/api/auth/signin"
                >
                  Sign In
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
