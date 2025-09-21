"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScoreBadge } from "@/components/ui/score-badge"
import { ExternalLink, Copy, FileText, GitBranch, Bookmark, Share } from "lucide-react"

export interface EntityData {
  id: string
  title: string
  type: "Paper" | "Repo"
  summary: string
  tags: string[]
  relevanceScore: number
  interestingnessScore: number
  url?: string
}

interface EntityCardProps {
  entity: EntityData
  className?: string
  onDetailClick?: (id: string) => void
}

export function EntityCard({ entity, className, onDetailClick }: EntityCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPrefetching, setIsPrefetching] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const router = useRouter()

  const prefetchDetailData = async () => {
    if (isPrefetching) return
    setIsPrefetching(true)

    try {
      // Simulate prefetching detail data
      await new Promise((resolve) => setTimeout(resolve, 100))
      // In a real app, this would prefetch the detail page data
      router.prefetch(`/items/${entity.id}`)
    } catch (error) {
      console.warn("Failed to prefetch detail data:", error)
    }
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(entity.id)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (error) {
      console.warn("Failed to copy ID:", error)
    }
  }

  const handleDetailClick = () => {
    if (onDetailClick) {
      onDetailClick(entity.id)
    } else {
      router.push(`/items/${entity.id}`)
    }
  }

  const handleBookmark = () => {
    // Placeholder for bookmark functionality
    console.log("Bookmark item:", entity.id)
  }

  const handleShare = () => {
    // Placeholder for share functionality
    if (navigator.share) {
      navigator.share({
        title: entity.title,
        text: entity.summary,
        url: `/items/${entity.id}`,
      })
    } else {
      handleCopyId()
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    prefetchDetailData()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      className={cn(
        "group relative bg-card border border-border rounded-lg p-4 transition-all duration-200 hover:bg-card-elevated hover:shadow-md hover:border-primary/20 cursor-pointer focus-ring",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleDetailClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${entity.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {entity.type === "Paper" ? (
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <GitBranch className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
          <Badge variant="secondary" className="text-xs">
            {entity.type}
          </Badge>
        </div>

        <div
          className={cn(
            "flex items-center gap-1 transition-all duration-200 transform",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation()
              handleDetailClick()
            }}
            aria-label="Open detail view"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0 hover:bg-primary/10 transition-colors",
              copyFeedback && "bg-green-500/20 text-green-400",
            )}
            onClick={(e) => {
              e.stopPropagation()
              handleCopyId()
            }}
            aria-label={copyFeedback ? "Copied!" : "Copy ID"}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation()
              handleBookmark()
            }}
            aria-label="Bookmark item"
          >
            <Bookmark className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation()
              handleShare()
            }}
            aria-label="Share item"
          >
            <Share className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-medium text-foreground mb-2 text-balance leading-tight group-hover:text-primary transition-colors">
        {entity.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-muted-foreground mb-3 text-clamp-2 leading-relaxed">{entity.summary}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {entity.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-tag-bg text-foreground hover:bg-tag-hover transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              // Placeholder for tag filtering
              console.log("Filter by tag:", tag)
            }}
          >
            {tag}
          </span>
        ))}
        {entity.tags.length > 4 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-tag-bg text-muted-foreground">
            +{entity.tags.length - 4}
          </span>
        )}
      </div>

      {/* Score badges */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <ScoreBadge score={entity.relevanceScore} type="relevance" />
          <span className="text-xs text-muted-foreground">Relevance</span>
        </div>
        <div className="flex items-center gap-1">
          <ScoreBadge score={entity.interestingnessScore} type="interestingness" />
          <span className="text-xs text-muted-foreground">Interest</span>
        </div>
      </div>

      {isPrefetching && <div className="absolute top-2 right-2 w-1 h-1 bg-primary rounded-full animate-pulse" />}

      {copyFeedback && (
        <div className="absolute -top-8 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-in fade-in-0 slide-in-from-bottom-2">
          Copied!
        </div>
      )}
    </div>
  )
}
