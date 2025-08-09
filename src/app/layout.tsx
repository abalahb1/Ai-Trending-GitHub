import "./../styles/globals.css"
import { Header } from "@/components/Header"; import { Footer } from "@/components/Footer"
import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" })

export const metadata: Metadata = {
  title: "AI/ML Pulse",
  description: "Stay on top of AI/ML news and trending open-source repos",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} font-sans`}>
        <Header />
        <main className="container mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
