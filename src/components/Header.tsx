import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60 bg-white/80 dark:bg-neutral-900/80 border-b border-gray-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold tracking-tight">AI/ML Pulse</Link>
          <nav className="hidden sm:flex items-center gap-3 text-sm">
            <Link href="/news" className="hover:underline">الأخبار</Link>
            <Link href="/repos" className="hover:underline">المشاريع</Link>
            <Link href="/dashboard" className="hover:underline">المحفوظات</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <form action="/api/auth/signout" method="POST"><button className="btn" type="submit">تسجيل الخروج</button></form>
          ) : (
            <a className="btn" href="/api/auth/signin">تسجيل الدخول</a>
          )}
        </div>
      </div>
    </header>
  )
}
