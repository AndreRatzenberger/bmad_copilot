# Error & Response Schema

Standard envelopes ensure consistent client handling.

## Success
```json
{
  "ok": true,
  "data": {"...": "domain payload"},
  "meta": {"trace_id": "uuid", "pagination": {"next": null}}
}
```

## Error
```json
{
  "ok": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "trace_id": "uuid"
  }
}
```

| Field | Purpose |
|-------|---------|
| ok | Boolean gate for success vs error branch |
| data | Domain payload (present only when ok=true) |
| meta | Non-domain metadata (trace, paging, versioning) |
| error.code | Stable machine-readable code (SCREAMING_SNAKE_CASE) |
| error.message | Human-friendly summary |
| error.trace_id | Correlates with server logs |

## Initial Error Code Set
| Code | Semantics |
|------|-----------|
| UNAUTHORIZED | Missing/invalid admin key |
| RATE_LIMIT_EXCEEDED | Token bucket capacity exceeded |
| NOT_FOUND | Resource not present |
| VALIDATION_ERROR | Input failed validation rules |
| INTERNAL_ERROR | Unhandled server fault |
| REINDEX_IN_PROGRESS | Conflicting operation while reindex running |

## Conventions
1. Never mix domain + control metadata in `data`.
2. Always include `trace_id` in responses (success via meta, error inside error).
3. Pagination: `meta.pagination = {"cursor": "...", "next": "..."}`.
4. Version headers: future addition `X-Projection-Version`.
