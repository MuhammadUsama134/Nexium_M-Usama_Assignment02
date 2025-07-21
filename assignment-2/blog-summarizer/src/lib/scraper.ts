import * as cheerio from "cheerio"
import axios from "axios"

export interface ScrapedContent {
  title: string
  content: string
  url: string
  wordCount: number
  metadata: {
    domain: string
    scrapingMethod: string
    contentType: string
  }
}

export async function scrapeBlogContent(url: string): Promise<ScrapedContent> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
      },
      timeout: 30000,
    })

    const $ = cheerio.load(response.data)

    // Remove unwanted elements
    $("script, style, nav, header, footer, aside, .advertisement, .ads, .social-share, .comments").remove()

    // Extract title with multiple fallbacks
    const title =
      $("h1").first().text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text().trim() ||
      "Untitled Article"

    // Try multiple content selectors in order of preference
    let content = ""
    const contentSelectors = [
      "article",
      '[role="main"]',
      ".post-content",
      ".entry-content",
      ".article-content",
      ".content",
      "main",
      ".post-body",
      ".story-body",
      "#content",
      ".article-body",
    ]

    for (const selector of contentSelectors) {
      const element = $(selector)
      if (element.length > 0) {
        content = element.text().trim()
        if (content.length > 200) break // Only use if substantial content
      }
    }

    // Fallback to body content if no specific content found
    if (!content || content.length < 200) {
      content = $("body").text().trim()
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/\n+/g, "\n") // Replace multiple newlines with single newline
      .replace(/\t+/g, " ") // Replace tabs with spaces
      .trim()

    if (!content || content.length < 100) {
      throw new Error(
        "Could not extract meaningful content from the URL. The page might be protected or have dynamic content.",
      )
    }

    const wordCount = content.split(/\s+/).length
    const domain = new URL(url).hostname

    return {
      title: title.substring(0, 500), // Limit title length
      content,
      url,
      wordCount,
      metadata: {
        domain,
        scrapingMethod: "cheerio",
        contentType: "text/html",
      },
    }
  } catch (error) {
    console.error("Scraping error:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to scrape blog content: ${error.message}`)
    }
    throw new Error("Failed to scrape blog content due to unknown error")
  }
}