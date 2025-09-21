"""Enrichment pipeline skeleton.

Stages (future):
 1. Summarize content (LLM)
 2. Generate tags / questions / findings
 3. Score relevance & interestingness
 4. Embed text
 5. Persist enriched document & emit events

Current implementation provides synchronous placeholders only.
"""
from dataclasses import dataclass
from typing import Any, Dict

@dataclass
class EnrichmentResult:
    summary: str
    tags: list[str]
    scores: dict

async def summarize_item(raw: Dict[str, Any]) -> str:  # noqa: D401
    return raw.get("title", "")[:120]

async def classify_scores(raw: Dict[str, Any]) -> dict:
    return {"relevance": 0, "interesting": 0, "rationale": {}}

async def embed_item(raw: Dict[str, Any]) -> list[float]:
    return []  # placeholder empty vector

async def enrich(raw: Dict[str, Any]) -> EnrichmentResult:
    summary = await summarize_item(raw)
    scores = await classify_scores(raw)
    _ = await embed_item(raw)
    return EnrichmentResult(summary=summary, tags=[], scores=scores)
