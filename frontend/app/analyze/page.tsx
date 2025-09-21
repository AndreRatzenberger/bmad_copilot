"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { EntityCard } from "@/components/ui/entity-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { LinkIcon, Loader2, CheckCircle, AlertCircle, ExternalLink, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AnalysisResult {
  id: string
  url: string
  title: string
  type: "Paper" | "Repo"
  summary: string
  tags: string[]
  relevanceScore: number
  interestingnessScore: number
  status: "success" | "error"
  metadata?: {
    authors?: string[]
    publishedDate?: string
    citations?: number
    stars?: number
    language?: string
  }
}

export default function AnalyzePage() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [error, setError] = useState<string | null>(null)

  useKeyboardShortcuts()

  const handleAnalyze = async () => {
    if (!url.trim()) return

    setIsAnalyzing(true)
    setError(null)

    // Simulate analysis
    setTimeout(() => {
      try {
        // Mock successful analysis
        const mockResult: AnalysisResult = {
          id: `analysis-${Date.now()}`,
          url: url,
          title: url.includes("arxiv")
            ? "Attention Is All You Need"
            : url.includes("github")
              ? "transformer-pytorch"
              : "Research Document",
          type: url.includes("github") ? "Repo" : "Paper",
          summary:
            "This groundbreaking work introduces the Transformer architecture, which relies entirely on attention mechanisms and dispenses with recurrence and convolutions entirely.",
          tags: ["transformers", "attention", "neural-networks", "nlp"],
          relevanceScore: Math.floor(Math.random() * 3) + 8,
          interestingnessScore: Math.floor(Math.random() * 3) + 7,
          status: "success",
          metadata: url.includes("github")
            ? { stars: 12500, language: "Python" }
            : { authors: ["Vaswani et al."], publishedDate: "2017", citations: 45000 },
        }

        setResults((prev) => [mockResult, ...prev])
        setUrl("")
      } catch (err) {
        setError("Failed to analyze URL. Please check the URL and try again.")
      } finally {
        setIsAnalyzing(false)
      }
    }, 2500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAnalyze()
    }
  }

  const rightPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-foreground mb-3">Supported Sources</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>arXiv papers</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>GitHub repositories</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Research PDFs</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Academic journals</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">Recent Analyses</h3>
        <div className="space-y-2">
          {results.slice(0, 3).map((result) => (
            <div key={result.id} className="p-2 bg-card border border-border rounded text-xs">
              <div className="font-medium truncate">{result.title}</div>
              <div className="text-muted-foreground flex items-center gap-1 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {result.type}
                </Badge>
                <span>Score: {result.relevanceScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">Tips</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>• Paste direct links to papers or repositories</p>
          <p>• Analysis typically takes 30-60 seconds</p>
          <p>• Results are automatically added to your catalog</p>
        </div>
      </div>
    </div>
  )

  return (
    <MainLayout rightPanel={rightPanel}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">URL Analyzer</h1>
          <p className="text-muted-foreground">
            Analyze research papers and repositories from URLs to add them to your catalog
          </p>
        </div>

        {/* URL Input Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="url-input" className="text-sm font-medium text-foreground">
                Enter URL to analyze
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://arxiv.org/abs/1706.03762 or https://github.com/pytorch/pytorch"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10"
                    disabled={isAnalyzing}
                  />
                </div>
                <Button onClick={handleAnalyze} disabled={!url.trim() || isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Supports arXiv, GitHub, research PDFs, and academic journal URLs
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">Analysis Results</h2>
              <span className="text-sm text-muted-foreground">{results.length} analyzed</span>
            </div>

            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Analyzed:</span>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {result.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-auto"
                      onClick={() => navigator.clipboard.writeText(result.url)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <EntityCard entity={result} onDetailClick={(id) => console.log("Navigate to detail:", id)} />

                  {result.metadata && (
                    <div className="ml-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground space-y-1">
                        {result.metadata.authors && <div>Authors: {result.metadata.authors.join(", ")}</div>}
                        {result.metadata.publishedDate && <div>Published: {result.metadata.publishedDate}</div>}
                        {result.metadata.citations && (
                          <div>Citations: {result.metadata.citations.toLocaleString()}</div>
                        )}
                        {result.metadata.stars && <div>Stars: {result.metadata.stars.toLocaleString()}</div>}
                        {result.metadata.language && <div>Language: {result.metadata.language}</div>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !isAnalyzing && (
          <div className="text-center py-12">
            <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Ready to analyze URLs</h3>
            <p className="text-muted-foreground mb-4">
              Paste a URL above to automatically extract and analyze research content.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Try these example URLs:</p>
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => setUrl("https://arxiv.org/abs/1706.03762")}
                  className="block mx-auto text-primary hover:underline"
                >
                  https://arxiv.org/abs/1706.03762
                </button>
                <button
                  onClick={() => setUrl("https://github.com/pytorch/pytorch")}
                  className="block mx-auto text-primary hover:underline"
                >
                  https://github.com/pytorch/pytorch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
