# Logging & Observability Baseline

## Logging
- Format: single-line JSON
- Fields: trace_id, method, path, status, duration_ms, (error)
- Trace correlation: trace_id injected at request entry

## Metrics (Prometheus)
| Name | Type | Purpose |
|------|------|---------|
| ingestion_items_total | Counter | Total items ingested |
| embedding_calls_total | Counter | Embedding API calls |
| embedding_cost_usd_total | Gauge | Approximate cumulative cost |
| request_latency_seconds | Histogram | Request latency profile |
| projection_version | Gauge | Current 2D projection version |
| reindex_in_progress | Gauge | 0/1 reindex running |

Future: add per-endpoint latency labels, cost per model, cluster_map_refresh_total.

## Dashboards (Future)
1. ingestion panel
2. embedding cost monitor
3. reindex progress panel

## Alert Seeds (Future)
- High error rate (>5% over 5 min)
- Embedding cost spike vs baseline
- Reindex stuck (no progress events in N minutes)

## Tracing (Deferred)
OpenTelemetry integration reserved for post-MVP.
