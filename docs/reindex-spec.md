# Reindex / Embedding Dimension Change Specification

## Goals
- Safely migrate embeddings when model or dimension changes.
- Avoid downtime; allow rollback within retention window.
- Provide observable progress + idempotency.

## Triggers
| Trigger | Condition | Action |
|---------|-----------|--------|
| Admin model selection (dimension change) | new_dim != current_dim | Start planned reindex |
| Force reindex | admin flag force=true | Rebuild even if same dim |
| Drift detection (future) | hash mismatch set | Plan reindex |

## Phases
1. PRECHECK & SNAPSHOT
2. EMBEDDING REBUILD (batched)
3. VALIDATE (count parity + sample cosine sanity)
4. SWITCHOVER (atomic directory rename)
5. POST (projection job trigger + audit log)

## Idempotency
- Snapshot file persisted (JSON lines of IDs + content hash)
- Batch marker file every N documents
- Resume logic skips completed batches

## Rollback
- Keep previous embeddings folder until TTL (default 24h)
- If fatal error before SWITCHOEVER -> delete temp folder
- After SWITCHOEVER rollback uses reverse rename & version decrement

## Progress Metrics
| Metric | Type | Description |
|--------|------|-------------|
| reindex_in_progress | gauge | 0/1 status |
| reindex_batches_total | counter | Total planned batches |
| reindex_batches_completed | counter | Completed batches |
| reindex_docs_processed_total | counter | Documents processed |

## API (Planned)
| Method | Path | Purpose |
|--------|------|---------|
| POST | /admin/reindex/plan | Return plan_id + diff summary |
| POST | /admin/reindex/execute | Start execution of plan |
| GET | /admin/reindex/status/{plan_id} | Progress + ETA |

## Concurrency Rules
- Only one active reindex at a time.
- Model switching while reindex active returns REINDEX_IN_PROGRESS error.

## Filesystem Layout (Conceptual)
```
embeddings/
  current/*.npy
  prev-<timestamp>/*.npy
  new-tmp-<plan_id>/*.npy
snapshots/
  <plan_id>-snapshot.jsonl
progress/
  <plan_id>-batches.json
```

## Open Questions (Deferred)
- Partial ANN index rebuild vs full.
- Streaming progress events over SSE.
