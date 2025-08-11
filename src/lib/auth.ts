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
      // On first sign-in, copy user.id to the token
      if (user && (user as any).id) token.id = (user as any).id as string;
      return token;
    },
    async session({ session, token }) {
      // Inject id into session.user for use in code (Dashboard, APIs)
      if (session.user) {
        (session.user as any).id =
          (token.id as string) || (token.sub as string) || "";
      }
      return session;
    },
  }
}

export { getServerSession }
