"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { EvidenceCard } from "@/components/ui/evidence-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMockEvidence } from "@/hooks/use-mock-data"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { Search, Lightbulb, TrendingUp, TrendingDown, Loader2 } from "lucide-react"

export default function TheoryPage() {
  const [theoryQuery, setTheoryQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const { supportingEvidence, contradictingEvidence, loading } = useMockEvidence()

  useKeyboardShortcuts()

  const handleSubmit = async () => {
    if (!theoryQuery.trim()) return

    setIsAnalyzing(true)
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false)
      setHasResults(true)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const rightPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-foreground mb-3">Theory Suggestions</h3>
        <div className="space-y-2">
          {[
            "Attention mechanisms improve model performance",
            "Larger models always perform better",
            "Transfer learning reduces training time",
            "Ensemble methods increase accuracy",
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setTheoryQuery(suggestion)}
              className="w-full text-left p-2 bg-card border border-border rounded text-xs hover:bg-card-elevated transition-colors focus-ring"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {hasResults && (
        <div>
          <h3 className="font-medium text-foreground mb-3">Analysis Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-sm font-medium">{supportingEvidence.length}</div>
                <div className="text-xs text-muted-foreground">Supporting</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div>
                <div className="text-sm font-medium">{contradictingEvidence.length}</div>
                <div className="text-xs text-muted-foreground">Contradicting</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-sm font-medium">Mixed</div>
                <div className="text-xs text-muted-foreground">Conclusion</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <MainLayout rightPanel={rightPanel}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Theory Explorer</h1>
          <p className="text-muted-foreground">
            Explore theories and hypotheses with supporting and contradicting evidence from research
          </p>
        </div>

        {/* Theory Input */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="theory-input" className="text-sm font-medium text-foreground">
                Enter a theory or question to explore
              </label>
              <Textarea
                id="theory-input"
                placeholder="Enter a theory or question... (e.g., 'Attention mechanisms are more effective than recurrent architectures for sequence modeling')"
                value={theoryQuery}
                onChange={(e) => setTheoryQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[120px] resize-none text-base"
                disabled={isAnalyzing}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Press Cmd/Ctrl + Enter to analyze</span>
                <span>{theoryQuery.length}/500</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!theoryQuery.trim() || isAnalyzing}
                className="flex-1 sm:flex-none"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze Theory
                  </>
                )}
              </Button>
              {theoryQuery && (
                <Button variant="outline" onClick={() => setTheoryQuery("")} disabled={isAnalyzing}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {(hasResults || isAnalyzing) && (
          <div className="space-y-6">
            {/* Mobile anchor links */}
            <div className="flex gap-2 md:hidden">
              <Button variant="outline" size="sm" asChild>
                <a href="#supporting">Supporting</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="#contradicting">Contradicting</a>
              </Button>
            </div>

            {/* Evidence Columns */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Supporting Evidence */}
              <div id="supporting" className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <h2 className="text-lg font-medium text-foreground">Supporting Evidence</h2>
                  {!isAnalyzing && <span className="text-sm text-muted-foreground">({supportingEvidence.length})</span>}
                </div>

                {isAnalyzing ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                          <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded animate-pulse" />
                          <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                        </div>
                        <div className="flex justify-end">
                          <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : supportingEvidence.length > 0 ? (
                  <div className="space-y-4">
                    {supportingEvidence.map((evidence) => (
                      <EvidenceCard
                        key={evidence.id}
                        evidence={evidence}
                        onOpen={(id) => console.log("Open evidence:", id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No supporting evidence found</p>
                  </div>
                )}
              </div>

              {/* Contradicting Evidence */}
              <div id="contradicting" className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg font-medium text-foreground">Contradicting Evidence</h2>
                  {!isAnalyzing && (
                    <span className="text-sm text-muted-foreground">({contradictingEvidence.length})</span>
                  )}
                </div>

                {isAnalyzing ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                          <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded animate-pulse" />
                          <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                        </div>
                        <div className="flex justify-end">
                          <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : contradictingEvidence.length > 0 ? (
                  <div className="space-y-4">
                    {contradictingEvidence.map((evidence) => (
                      <EvidenceCard
                        key={evidence.id}
                        evidence={evidence}
                        onOpen={(id) => console.log("Open evidence:", id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingDown className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No contradicting evidence found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasResults && !isAnalyzing && (
          <div className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Ready to explore theories</h3>
            <p className="text-muted-foreground mb-4">
              Enter a theory or research question above to find supporting and contradicting evidence.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Try examples like:</p>
              <ul className="mt-2 space-y-1">
                <li>"Attention mechanisms outperform RNNs for long sequences"</li>
                <li>"Larger language models always perform better"</li>
                <li>"Transfer learning reduces training time significantly"</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
