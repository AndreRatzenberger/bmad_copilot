"""arXiv fetcher stub.

Responsible later for:
 - Polling arXiv API with category filters
 - Converting results to internal RawPaperMetadata objects
 - Deduplication (version aware)
"""
from typing import Any, AsyncIterator

async def fetch_new_papers(categories: list[str]) -> AsyncIterator[dict[str, Any]]:
    """Yield placeholder paper metadata.

    Eventually will call arXiv API. For now yields empty iterator.
    """
    if False:  # placeholder to make this an async generator
        yield {}
