"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, AlertTriangle } from "lucide-react"
import { AnalysisReport } from "@/components/analysis-report"

interface AnalysisResult {
  title: string
  content: string
  analysis: string
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze article")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
  <div className="flex items-center justify-center gap-2 mb-4">
    <AlertTriangle className="h-8 w-8 text-amber-600" />
    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
      The Digital Skeptic
    </h1>
  </div>
  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
    Empowering Critical Thinking in an Age of Information Overload
  </p>
  <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
    Analyze news articles for bias, claims, and critical thinking insights — built by <span className="font-semibold text-slate-700 dark:text-slate-300">Spandan Mukherjee</span>.
  </p>
</div>


        {/* Input Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Article Analysis
            </CardTitle>
            <CardDescription>Enter the URL of a news article to get a comprehensive critical analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/news-articles-you-like"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleAnalyze} disabled={loading || !url.trim()} className="min-w-[120px]">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>

            {error && (
              <Alert className="mt-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && <AnalysisReport result={result} />}

        {/* Setup Instructions */}
        {!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY && (
          <Alert className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Setup Required:</strong> Add your Google AI API key as GOOGLE_AI_API_KEY in your environment
              variables to enable analysis.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
