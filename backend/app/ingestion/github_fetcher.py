"""GitHub repository discovery stub.

Future responsibilities:
 - Keyword/topic search queries
 - Rate limit respectful pagination
 - Heuristics for filtering repos (stars / recency)
"""
from typing import Any, AsyncIterator

async def fetch_candidate_repos(keywords: list[str]) -> AsyncIterator[dict[str, Any]]:
    if False:  # placeholder to keep generator form
        yield {}
