import { type NextRequest, NextResponse } from "next/server"
import { scrapeBlogContent } from "@/lib/scraper"
import { generateSummary } from "@/lib/summarizer"
import { translateToUrdu } from "@/lib/translator"
import { supabase } from "@/lib/supabase"
import { connectToMongoDB } from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    console.log(`Starting processing for URL: ${url}`)

    // Step 1: Scrape blog content
    console.log("Step 1: Scraping content...")
    const scrapedData = await scrapeBlogContent(url)
    console.log(`Scraped ${scrapedData.wordCount} words from ${scrapedData.metadata.domain}`)

    // Step 2: Generate summary
    console.log("Step 2: Generating summary...")
    const summaryResult = await generateSummary(scrapedData.content, scrapedData.title)
    console.log(`Generated summary using ${summaryResult.method} method`)

    // Step 3: Translate summary to Urdu
    console.log("Step 3: Translating to Urdu...")
    const urduSummary = await translateToUrdu(summaryResult.summary)
    console.log("Translation completed")

    // Step 4: Store data in databases
    console.log("Step 4: Storing in databases...")
    const summaryId = uuidv4()
    const processingTime = Date.now() - startTime

    // Store summary in Supabase
    const { error: supabaseError } = await supabase.from("blog_summaries").insert({
      id: summaryId,
      url: url,
      title: scrapedData.title,
      summary: summaryResult.summary,
      urdu_summary: urduSummary,
      word_count: scrapedData.wordCount,
      summary_method: summaryResult.method,
      processing_time: processingTime,
    })

    if (supabaseError) {
      console.error("Supabase error:", supabaseError)
      // Continue processing even if Supabase fails
    } else {
      console.log("Summary stored in Supabase")
    }

    // Store full content in MongoDB
    try {
      const db = await connectToMongoDB()
      await db.collection("blog_contents").insertOne({
        url: url,
        title: scrapedData.title,
        content: scrapedData.content,
        scraped_at: new Date(),
        summary_id: summaryId,
        word_count: scrapedData.wordCount,
        metadata: scrapedData.metadata,
      })
      console.log("Content stored in MongoDB")
    } catch (mongoError) {
      console.error("MongoDB error:", mongoError)
      // Continue processing even if MongoDB fails
    }

    console.log(`Processing completed in ${processingTime}ms`)

    // Return the result
    return NextResponse.json({
      id: summaryId,
      url: url,
      title: scrapedData.title,
      content: scrapedData.content,
      summary: summaryResult.summary,
      urduSummary: urduSummary,
      createdAt: new Date().toISOString(),
      processingTime: processingTime,
      wordCount: scrapedData.wordCount,
      summaryMethod: summaryResult.method,
    })
  } catch (error) {
    console.error("API error:", error)
    const processingTime = Date.now() - startTime

    let errorMessage = "Failed to process blog content"
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message

      // Specific error handling
      if (error.message.includes("scrape")) {
        statusCode = 422
      } else if (error.message.includes("timeout")) {
        statusCode = 408
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        processingTime: processingTime,
      },
      { status: statusCode },
    )
  }
}