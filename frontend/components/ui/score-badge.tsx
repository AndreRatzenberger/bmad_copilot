"use client"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ScoreBadgeProps {
  score: number
  type: "relevance" | "interestingness"
  className?: string
}

export function ScoreBadge({ score, type, className }: ScoreBadgeProps) {
  // Calculate color based on score (high=green, medium=yellow, low=red)
  const getScoreColor = (score: number) => {
    if (score >= 7) return "from-green-500 to-green-400"
    if (score >= 4) return "from-yellow-500 to-yellow-400"
    return "from-red-500 to-red-400"
  }

  const gradientClass = getScoreColor(score)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("relative inline-flex items-center justify-center", className)}>
            {/* Gradient ring */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradientClass} p-0.5`}>
              <div className="h-full w-full rounded-full bg-card" />
            </div>

            {/* Score content */}
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card text-xs font-medium text-foreground">
              {score}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">
            {type} score {score} out of 10
          </p>
          <p className="text-xs text-muted-foreground">Rationale: AI-generated assessment</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
