"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScoreBadge } from "@/components/ui/score-badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ExternalLink, FileText, GitBranch, Calendar, User, Star, Eye } from "lucide-react"
import { useMockData } from "@/hooks/use-mock-data"

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { entities } = useMockData()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const foundItem = entities.find((e) => e.id === params.id)
      if (foundItem) {
        // Enhance with additional detail data
        setItem({
          ...foundItem,
          abstract:
            "This research explores advanced machine learning techniques for natural language processing, focusing on transformer architectures and their applications in semantic understanding. The work demonstrates significant improvements in accuracy and efficiency compared to previous approaches.",
          authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez", "Dr. Emily Watson"],
          publishedDate: "2024-01-15",
          citations: 127,
          views: 2543,
          doi: "10.1000/182",
          venue: "International Conference on Machine Learning",
          keywords: ["machine learning", "NLP", "transformers", "semantic analysis"],
          relatedItems: entities.filter((e) => e.id !== params.id).slice(0, 3),
        })
      }
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [params.id, entities])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <div className="text-sm text-muted-foreground">Loading item details...</div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="text-lg font-medium">Item not found</div>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {item.type === "Paper" ? (
            <FileText className="h-5 w-5 text-muted-foreground" />
          ) : (
            <GitBranch className="h-5 w-5 text-muted-foreground" />
          )}
          <Badge variant="secondary">{item.type}</Badge>
        </div>
      </div>

      {/* Title and Scores */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-balance leading-tight">{item.title}</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ScoreBadge score={item.relevanceScore} type="relevance" />
            <span className="text-sm text-muted-foreground">Relevance</span>
          </div>
          <div className="flex items-center gap-2">
            <ScoreBadge score={item.interestingnessScore} type="interestingness" />
            <span className="text-sm text-muted-foreground">Interest</span>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Authors:</span> {item.authors.join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Published:</span> {item.publishedDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Citations:</span> {item.citations}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Views:</span> {item.views}
              </span>
            </div>
          </div>
          {item.venue && (
            <div className="text-sm">
              <span className="text-muted-foreground">Venue:</span> {item.venue}
            </div>
          )}
          {item.doi && (
            <div className="text-sm">
              <span className="text-muted-foreground">DOI:</span> {item.doi}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Abstract */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Abstract</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{item.abstract}</p>
        </CardContent>
      </Card>

      {/* Tags and Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tags & Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-tag-bg text-foreground hover:bg-tag-hover transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Keywords:</span>
              <div className="flex flex-wrap gap-2">
                {item.keywords.map((keyword: string) => (
                  <Badge key={keyword} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Items */}
      {item.relatedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {item.relatedItems.map((relatedItem: any) => (
                <div
                  key={relatedItem.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => router.push(`/items/${relatedItem.id}`)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {relatedItem.type === "Paper" ? (
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <GitBranch className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{relatedItem.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{relatedItem.summary}</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button>
          <ExternalLink className="h-4 w-4 mr-2" />
          View Original
        </Button>
        <Button variant="outline">Add to Collection</Button>
        <Button variant="outline">Export Citation</Button>
      </div>
    </div>
  )
}
