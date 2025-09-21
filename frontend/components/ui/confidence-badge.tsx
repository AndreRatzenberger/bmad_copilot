import { cn } from "@/lib/utils"

interface ConfidenceBadgeProps {
  level: "High" | "Med" | "Low"
  className?: string
}

export function ConfidenceBadge({ level, className }: ConfidenceBadgeProps) {
  const getVariant = (level: string) => {
    switch (level) {
      case "High":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Med":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "Low":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
        getVariant(level),
        className,
      )}
    >
      {level}
    </span>
  )
}
