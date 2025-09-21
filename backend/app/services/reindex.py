"""Reindex / Embedding Dimension Change Specification (Implementation Stub)

Phases:
1. PRECHECK
   - Compare current embedding dimension vs target dimension.
   - If unchanged and force flag false -> exit.
2. SNAPSHOT (logical list of document IDs + metadata hash) for idempotency.
3. EMBEDDING REBUILD (paged):
   - Stream documents in batches (default 64) -> compute new vectors.
   - Persist temp vectors (e.g., embeddings_new/) with atomic write per batch.
   - Track progress metrics (completed_docs_total, percent float).
4. SWITCHOVER:
   - Move old embeddings to embeddings_prev/ (retain for rollback N hours).
   - Rename embeddings_new -> embeddings/.
   - Increment projection_version & set reindex_required=false.
5. POST:
   - Trigger projection / clustering recalculation job (async).
   - Emit audit log event.

Idempotency: If interrupted, restart reads snapshot & resumes from persisted batch markers.
Rollback: If severe failure before SWITCHOVER complete -> discard embeddings_new. After SWITCHOVER -> fast rollback by swapping directories back within retention window.

This module will later expose:
  async def plan_reindex(target_embedding_dim: int, force: bool = False) -> dict
  async def execute_reindex(plan_id: str) -> dict
  async def reindex_status(plan_id: str) -> dict

Current stub returns NotImplemented when invoked.
"""

class ReindexNotImplementedError(Exception):
    pass

async def plan_reindex(*_, **__):  # noqa: D401,E501
    raise ReindexNotImplementedError("Reindex planning not yet implemented")
