"use client"

import { useState, useEffect } from "react"
import type { EntityData } from "@/components/ui/entity-card"
import type { EvidenceData } from "@/components/ui/evidence-card"

// Mock data generators
export function useMockEntities(count = 10): { entities: EntityData[]; loading: boolean } {
  const [entities, setEntities] = useState<EntityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockEntities: EntityData[] = Array.from({ length: count }, (_, i) => ({
        id: `entity-${i + 1}`,
        title: `${i % 2 === 0 ? "Attention Is All You Need" : "Deep Residual Learning for Image Recognition"} ${i + 1}`,
        type: i % 3 === 0 ? "Repo" : "Paper",
        summary:
          "This groundbreaking research introduces novel approaches to machine learning that significantly advance the state of the art in artificial intelligence applications.",
        tags: ["machine-learning", "neural-networks", "attention", "transformers"].slice(
          0,
          Math.floor(Math.random() * 4) + 1,
        ),
        relevanceScore: Math.floor(Math.random() * 10) + 1,
        interestingnessScore: Math.floor(Math.random() * 10) + 1,
        url: `https://example.com/paper-${i + 1}`,
      }))
      setEntities(mockEntities)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [count])

  return { entities, loading }
}

export function useMockEvidence(): {
  supportingEvidence: EvidenceData[]
  contradictingEvidence: EvidenceData[]
  loading: boolean
} {
  const [supportingEvidence, setSupportingEvidence] = useState<EvidenceData[]>([])
  const [contradictingEvidence, setContradictingEvidence] = useState<EvidenceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const supporting: EvidenceData[] = [
        {
          id: "support-1",
          title: "Empirical Study on Transformer Architectures",
          snippet:
            "Our experiments demonstrate that attention mechanisms consistently outperform traditional approaches across multiple benchmarks.",
          confidence: "High",
        },
        {
          id: "support-2",
          title: "Large-Scale Analysis of Neural Network Performance",
          snippet:
            "Statistical analysis reveals significant improvements in accuracy when using the proposed methodology.",
          confidence: "Med",
        },
      ]

      const contradicting: EvidenceData[] = [
        {
          id: "contra-1",
          title: "Limitations of Current Approaches",
          snippet:
            "However, recent findings suggest that these methods may not generalize well to certain edge cases and specialized domains.",
          confidence: "Med",
        },
        {
          id: "contra-2",
          title: "Alternative Perspectives on Model Architecture",
          snippet:
            "Some researchers argue that simpler models can achieve comparable results with significantly less computational overhead.",
          confidence: "Low",
        },
      ]

      setSupportingEvidence(supporting)
      setContradictingEvidence(contradicting)
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  return { supportingEvidence, contradictingEvidence, loading }
}

export function useMockData(count = 10) {
  const { entities, loading: entitiesLoading } = useMockEntities(count)
  const { supportingEvidence, contradictingEvidence, loading: evidenceLoading } = useMockEvidence()

  return {
    entities,
    supportingEvidence,
    contradictingEvidence,
    loading: entitiesLoading || evidenceLoading,
  }
}
