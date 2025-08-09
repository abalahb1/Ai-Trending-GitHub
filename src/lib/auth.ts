import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GithubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/db"
import { getServerSession, type NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? ""
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // عند تسجيل الدخول لأول مرة ننسخ user.id إلى التوكن
      if (user && (user as any).id) token.id = (user as any).id as string
      return token
    },
    async session({ session, token }) {
      // نحقن id داخل session.user ليستعمله الكود (Dashboard, APIs)
      if (session.user) {
        (session.user as any).id = (token.id as string) || (token.sub as string) || ""
      }
      return session
    }
  }
}

export { getServerSession }
