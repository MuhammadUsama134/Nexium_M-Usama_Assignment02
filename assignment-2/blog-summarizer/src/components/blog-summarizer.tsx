"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Globe, FileText, Languages, Database, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface SummaryResult {
  id: string
  url: string
  title: string
  content: string
  summary: string
  urduSummary: string
  createdAt: string
  processingTime: number
  wordCount: number
  summaryMethod: "static" | "gemini"
}

interface ProcessingStatus {
  step: string
  completed: boolean
  error?: string
}

export function BlogSummarizer() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus[]>([])
  

  const processingSteps = [
    { key: "scraping", label: "Scraping blog content" },
    { key: "summarizing", label: "Generating summary" },
    { key: "translating", label: "Translating to Urdu" },
    { key: "storing", label: "Storing in databases" },
  ]

  const updateProcessingStatus = (step: string, completed: boolean, error?: string) => {
    setProcessingStatus((prev) => {
      const existing = prev.find((s) => s.step === step)
      if (existing) {
        return prev.map((s) => (s.step === step ? { ...s, completed, error } : s))
      }
      return [...prev, { step, completed, error }]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      // Changed toast call
      toast.error("Error", {
        description: "Please enter a valid blog URL",
      })
      return
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      // Changed toast call
      toast.error("Invalid URL", {
        description: "Please enter a valid URL starting with http:// or https://",
      })
      return
    }

    setLoading(true)
    setResult(null)
    setProcessingStatus([])

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process blog")
      }

      const data = await response.json()
      setResult(data)

      // Changed toast call
      toast.success("Success!", {
        description: `Blog processed successfully in ${data.processingTime}ms`,
      })
    } catch (error) {
      console.error("Processing error:", error)
      // Changed toast call
      toast.error("Processing Failed", {
        description: error instanceof Error ? error.message : "Failed to process blog. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Input Section */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Globe className="h-7 w-7 text-blue-600" />
            Enter Blog URL
          </CardTitle>
          <CardDescription className="text-base">
            Paste the URL of any blog post to generate an AI-powered summary with Urdu translation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              type="url"
              placeholder="https://example.com/blog-post"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 h-12 text-base"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Summarize"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {loading && (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processingSteps.map((step) => {
                const status = processingStatus.find((s) => s.step === step.key)
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    {status?.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : status?.error ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    )}
                    <span
                      className={`${status?.completed ? "text-green-700" : status?.error ? "text-red-700" : "text-gray-700"}`}
                    >
                      {step.label}
                    </span>
                    {status?.error && <span className="text-sm text-red-600">({status.error})</span>}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {result && (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{result.title}</CardTitle>
                <CardDescription className="break-all text-blue-600 hover:text-blue-800">
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    {result.url}
                  </a>
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <Badge variant="secondary">{new Date(result.createdAt).toLocaleDateString()}</Badge>
                <Badge variant="outline">{result.wordCount} words</Badge>
                <Badge variant={result.summaryMethod === "gemini" ? "default" : "secondary"}>
                  {result.summaryMethod === "gemini" ? "AI Powered" : "Static Logic"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="urdu" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  اردو ترجمہ
                </TabsTrigger>
                <TabsTrigger value="original" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Original Content
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      AI-Generated Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">{result.summary}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="urdu" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Languages className="h-5 w-5 text-purple-600" />
                      اردو ترجمہ (Urdu Translation)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base text-right" dir="rtl">
                        {result.urduSummary}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="original" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-600" />
                      Original Content
                    </CardTitle>
                    <CardDescription>First 3000 characters of the scraped content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                        {result.content.substring(0, 3000)}
                        {result.content.length > 3000 && "..."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Processing Info */}
            <Alert className="mt-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Processing completed in {result.processingTime}ms. Summary stored in Supabase, full content stored in
                MongoDB.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}