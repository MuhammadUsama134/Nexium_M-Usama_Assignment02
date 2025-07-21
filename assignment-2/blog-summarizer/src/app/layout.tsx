import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Blog Summarizer - Smart Content Processing",
  description:
    "Scrape, summarize, and translate blog content with AI-powered tools. Convert any blog post into concise summaries with Urdu translation.",
  keywords: "blog summarizer, AI content, Urdu translation, web scraping, content analysis",
  authors: [{ name: "Blog Summarizer Team" }],
  openGraph: {
    title: "AI Blog Summarizer",
    description: "Transform blog content into intelligent summaries with translation",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">{children}</div>
        <Toaster />
      </body>
    </html>
  )
}