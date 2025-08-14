import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, MessageSquare, AlertTriangle, HelpCircle, ExternalLink } from "lucide-react"
import { AudioControls } from "@/components/audio-controls"

interface AnalysisResult {
  title: string
  content: string
  analysis: string
}

interface AnalysisReportProps {
  result: AnalysisResult
}

export function AnalysisReport({ result }: AnalysisReportProps) {
  // Parse the markdown analysis into sections
  const parseAnalysis = (analysis: string) => {
    const sections = {
      coreClaims: [] as string[],
      languageTone: "",
      redFlags: [] as string[],
      verificationQuestions: [] as string[],
    }

    const lines = analysis.split("\n")
    let currentSection = ""

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.includes("Core Claims") || trimmed.includes("### Core Claims")) {
        currentSection = "coreClaims"
        continue
      } else if (trimmed.includes("Language & Tone") || trimmed.includes("### Language & Tone")) {
        currentSection = "languageTone"
        continue
      } else if (trimmed.includes("Red Flags") || trimmed.includes("### Potential Red Flags")) {
        currentSection = "redFlags"
        continue
      } else if (trimmed.includes("Verification Questions") || trimmed.includes("### Verification Questions")) {
        currentSection = "verificationQuestions"
        continue
      }

      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        const content = trimmed.substring(1).trim()
        if (currentSection === "coreClaims") {
          sections.coreClaims.push(content)
        } else if (currentSection === "redFlags") {
          sections.redFlags.push(content)
        }
      } else if (trimmed.match(/^\d+\./)) {
        const content = trimmed.replace(/^\d+\./, "").trim()
        if (currentSection === "verificationQuestions") {
          sections.verificationQuestions.push(content)
        }
      } else if (trimmed && currentSection === "languageTone" && !trimmed.startsWith("#")) {
        sections.languageTone += trimmed + " "
      }
    }

    return sections
  }

  const sections = parseAnalysis(result.analysis)

  const createAudioNarration = () => {
    let narration = `Analysis of: ${result.title}. `

    if (sections.coreClaims.length > 0) {
      narration += `Core Claims: ${sections.coreClaims.join(". ")}. `
    }

    if (sections.languageTone) {
      narration += `Language and Tone Analysis: ${sections.languageTone}. `
    }

    if (sections.redFlags.length > 0) {
      narration += `Potential Red Flags: ${sections.redFlags.join(". ")}. `
    }

    if (sections.verificationQuestions.length > 0) {
      narration += `Verification Questions: ${sections.verificationQuestions.join(". ")}`
    }

    return narration
  }

  return (
    <div className="space-y-6">
      <AudioControls analysisText={createAudioNarration()} />

      {/* Article Title */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Article Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{result.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Content length: {result.content.length} characters
          </p>
        </CardContent>
      </Card>

      {/* Core Claims */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Core Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sections.coreClaims.length > 0 ? (
            <ul className="space-y-2">
              {sections.coreClaims.map((claim, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5 text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{claim}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No specific claims identified.</p>
          )}
        </CardContent>
      </Card>

      {/* Language & Tone Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            Language & Tone Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{sections.languageTone || "No language analysis available."}</p>
        </CardContent>
      </Card>

      {/* Potential Red Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Potential Red Flags
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sections.redFlags.length > 0 ? (
            <ul className="space-y-2">
              {sections.redFlags.map((flag, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No significant red flags identified.</p>
          )}
        </CardContent>
      </Card>

      {/* Verification Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            Verification Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sections.verificationQuestions.length > 0 ? (
            <ol className="space-y-3">
              {sections.verificationQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5 text-xs min-w-[24px] justify-center">
                    {index + 1}
                  </Badge>
                  <span className="text-sm leading-relaxed">{question}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-500">No verification questions generated.</p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Raw Analysis (Collapsible) */}
      <details className="group">
        <summary className="cursor-pointer text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
          View Raw Analysis
        </summary>
        <Card className="mt-2">
          <CardContent className="pt-6">
            <pre className="text-xs bg-slate-50 dark:bg-slate-800 p-4 rounded-md overflow-auto whitespace-pre-wrap">
              {result.analysis}
            </pre>
          </CardContent>
        </Card>
      </details>
    </div>
  )
}
