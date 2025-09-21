"use client"

import { Button } from "@/components/ui/button"
import { ConfidenceBadge } from "@/components/ui/confidence-badge"
import { ExternalLink } from "lucide-react"

export interface EvidenceData {
  id: string
  title: string
  snippet: string
  confidence: "High" | "Med" | "Low"
  url?: string
}

interface EvidenceCardProps {
  evidence: EvidenceData
  onOpen?: (id: string) => void
}

export function EvidenceCard({ evidence, onOpen }: EvidenceCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium text-foreground text-sm leading-tight flex-1">{evidence.title}</h4>
        <ConfidenceBadge level={evidence.confidence} />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{evidence.snippet}</p>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => onOpen?.(evidence.id)} className="h-8 text-xs">
          <ExternalLink className="h-3 w-3 mr-1" />
          Open
        </Button>
      </div>
    </div>
  )
}
