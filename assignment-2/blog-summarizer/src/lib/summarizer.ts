import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = process.env.GOOGLE_GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY) : null

export interface SummaryResult {
  summary: string
  method: "static" | "gemini"
}

export async function generateSummary(content: string, title: string): Promise<SummaryResult> {
  // Always try static logic first (cost-effective)
  const staticSummary = generateStaticSummary(content, title)

  // Only use Gemini if API key is available and content is substantial
  if (genAI && content.length > 1000) {
    try {
      const geminiSummary = await generateGeminiSummary(content, title)
      return {
        summary: geminiSummary,
        method: "gemini",
      }
    } catch (error) {
      console.error("Gemini API failed, using static logic:", error)
    }
  }

  return {
    summary: staticSummary,
    method: "static",
  }
}

async function generateGeminiSummary(content: string, title: string): Promise<string> {
  if (!genAI) {
    throw new Error("Gemini API not configured")
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Please provide a comprehensive summary of the following blog post titled "${title}":

${content}

Requirements:
- Create a summary between 200-400 words
- Focus on the main points, key insights, and important takeaways
- Maintain the original tone and style where appropriate
- Structure the summary with clear, coherent paragraphs
- Include specific details and examples when relevant
- Make it engaging and informative for readers

Summary:`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  if (!text || text.length < 50) {
    throw new Error("Gemini API returned insufficient content")
  }

  return text.trim()
}

export function generateStaticSummary(content: string, title: string): string {
  // Enhanced static logic for better summarization
  const sentences = content
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 300) // Filter out very short or very long sentences

  if (sentences.length === 0) {
    return "Unable to generate a meaningful summary from the provided content."
  }

  // Score sentences based on multiple factors
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0
    const words = sentence.toLowerCase().split(/\s+/)
    const sentenceLength = words.length

    // Position scoring (earlier sentences get higher scores, but not too early)
    if (index < sentences.length * 0.1) {
      score += 8 // Very early sentences (introduction)
    } else if (index < sentences.length * 0.3) {
      score += 12 // Early sentences (main content start)
    } else if (index < sentences.length * 0.7) {
      score += 10 // Middle sentences (main content)
    } else {
      score += 6 // Later sentences (conclusion)
    }

    // Length scoring (prefer medium-length sentences)
    if (sentenceLength >= 12 && sentenceLength <= 25) {
      score += 8
    } else if (sentenceLength >= 8 && sentenceLength <= 35) {
      score += 5
    }

    // Keyword scoring - important terms
    const importantKeywords = [
      "important",
      "key",
      "main",
      "significant",
      "crucial",
      "essential",
      "primary",
      "major",
      "critical",
      "fundamental",
      "central",
      "core",
      "vital",
      "necessary",
      "conclusion",
      "result",
      "finding",
      "discovery",
      "research",
      "study",
      "analysis",
      "solution",
      "approach",
      "method",
      "strategy",
      "technique",
      "process",
      "benefit",
      "advantage",
      "impact",
      "effect",
      "influence",
      "consequence",
      "problem",
      "challenge",
      "issue",
      "difficulty",
      "concern",
      "example",
      "instance",
      "case",
      "evidence",
      "proof",
      "data",
      "statistics",
    ]

    importantKeywords.forEach((keyword) => {
      if (sentence.toLowerCase().includes(keyword)) {
        score += 4
      }
    })

    // Title word scoring
    const titleWords = title
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3)
    titleWords.forEach((word) => {
      if (sentence.toLowerCase().includes(word)) {
        score += 3
      }
    })

    // Numeric data scoring (sentences with numbers often contain important facts)
    if (/\d+/.test(sentence)) {
      score += 2
    }

    // Question scoring (questions often introduce important topics)
    if (sentence.includes("?")) {
      score += 3
    }

    // Avoid sentences that are too generic
    const genericPhrases = ["click here", "read more", "subscribe", "follow us", "share this"]
    const isGeneric = genericPhrases.some((phrase) => sentence.toLowerCase().includes(phrase))
    if (isGeneric) {
      score -= 5
    }

    return { sentence: sentence.trim(), score, index }
  })

  // Sort by score and select top sentences
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(8, Math.ceil(sentences.length * 0.25))) // Take top 25% or max 8 sentences
    .sort((a, b) => a.index - b.index) // Restore original order

  let summary = topSentences.map((item) => item.sentence).join(". ")

  // Ensure proper sentence ending
  if (!summary.endsWith(".") && !summary.endsWith("!") && !summary.endsWith("?")) {
    summary += "."
  }

  // Add a conclusion if the summary is substantial
  if (summary.length > 300) {
    const conclusionStarters = [
      "In summary, this article discusses",
      "Overall, the main points covered include",
      "The key takeaways from this content are",
      "This article primarily focuses on",
    ]
    const randomStarter = conclusionStarters[Math.floor(Math.random() * conclusionStarters.length)]

    // Extract main topics for conclusion
    const mainTopics = title
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .slice(0, 3)
      .join(", ")
    if (mainTopics) {
      summary += ` ${randomStarter} ${mainTopics} and related concepts.`
    }
  }

  return summary || "This article provides insights and information on various topics related to the subject matter."
}