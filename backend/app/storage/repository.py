"""TinyDB repository abstraction (placeholder).

For now we keep everything in memory until real persistence wired.
"""
from __future__ import annotations
from typing import Any, Dict, List
import time

class InMemoryCollection:
    def __init__(self):
        self._items: dict[str, Dict[str, Any]] = {}

    def upsert(self, item: Dict[str, Any]):
        self._items[item["_id"]] = item

    def all(self) -> List[Dict[str, Any]]:
        return list(self._items.values())

    def get(self, _id: str) -> Dict[str, Any] | None:
        return self._items.get(_id)

papers = InMemoryCollection()
repos = InMemoryCollection()

def seed_demo_items():  # minimal seed for search placeholder
    if papers.all():
        return
    now = int(time.time())
    for i in range(3):
        papers.upsert({
            "_id": f"p_demo_{i}",
            "type": "paper",
            "title": f"Demo Paper {i}",
            "summary": "Placeholder summary",
            "tags": ["demo"],
            "scores": {"relevance": 0, "interesting": 0, "rationale": {}},
            "cluster_id": 0,
            "ingested_at": now,
        })
