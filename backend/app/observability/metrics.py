from fastapi import APIRouter
from prometheus_client import Counter, Gauge, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi.responses import Response

router = APIRouter(tags=["metrics"])  # not exposed yet under /metrics for potential protection

ingestion_items_total = Counter("ingestion_items_total", "Total number of items ingested")
embedding_calls_total = Counter("embedding_calls_total", "Total embedding API calls")
embedding_cost_usd_total = Gauge("embedding_cost_usd_total", "Estimated USD cost of embedding calls")
request_latency_seconds = Histogram("request_latency_seconds", "Request latency distribution")
projection_version = Gauge("projection_version", "Current projection version")
reindex_in_progress = Gauge("reindex_in_progress", "Whether a reindex is in progress (0/1)")

@router.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
