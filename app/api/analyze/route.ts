import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Step 1: Scrape the article content
    const scrapedData = await scrapeArticle(url)

    // Step 2: Analyze with Gemini AI
    const analysis = await analyzeWithGemini(scrapedData.title, scrapedData.content)

    return NextResponse.json({
      title: scrapedData.title,
      content: scrapedData.content,
      analysis: analysis,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze article" }, { status: 500 })
  }
}

async function scrapeArticle(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove unwanted elements
    $("script, style, nav, header, footer, aside, .advertisement, .ads, .social-share").remove()

    // Try to extract title
    const title =
      $("h1").first().text().trim() ||
      $("title").text().trim() ||
      $('[property="og:title"]').attr("content") ||
      "Untitled Article"

    // Try to extract main content
    let content = ""

    // Common article selectors
    const contentSelectors = [
      "article",
      '[role="main"]',
      ".article-content",
      ".post-content",
      ".entry-content",
      ".content",
      "main",
    ]

    for (const selector of contentSelectors) {
      const element = $(selector)
      if (element.length && element.text().trim().length > 200) {
        content = element.text().trim()
        break
      }
    }

    // Fallback: get all paragraph text
    if (!content || content.length < 200) {
      content = $("p")
        .map((_, el) => $(el).text().trim())
        .get()
        .join("\n\n")
    }

    // Clean up content
    content = content
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .trim()

    if (!content || content.length < 100) {
      throw new Error("Could not extract sufficient content from the article")
    }

    return { title, content }
  } catch (error) {
    throw new Error(`Failed to scrape article: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

async function analyzeWithGemini(title: string, content: string) {
  const apiKey = process.env.GOOGLE_AI_API_KEY

  if (!apiKey) {
    throw new Error("Google AI API key not configured")
  }

  const prompt = `You are "The Digital Skeptic" AI, designed to help readers think critically about news articles. Analyze the following article and provide a structured critical analysis report.

Article Title: ${title}

Article Content: ${content}

Please provide a comprehensive analysis in the following format:

# Critical Analysis Report for: ${title}

### Core Claims
* [List 3-5 main factual claims the article makes]

### Language & Tone Analysis
[Brief analysis of the article's language - is it neutral, emotionally charged, persuasive, etc.]

### Potential Red Flags
* [List any signs of bias, poor reporting, loaded terminology, over-reliance on anonymous sources, lack of cited data, missing opposing viewpoints, etc.]

### Verification Questions
1. [Specific question readers should ask to verify the content]
2. [Another verification question]
3. [Another verification question]
4. [Another verification question]

Focus on empowering critical thinking rather than making final judgments about truth or falsehood. Highlight what readers should investigate further.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response from Gemini API")
    }

    return data.candidates[0].content.parts[0].text
  } catch (error) {
    throw new Error(`Failed to analyze with Gemini: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
