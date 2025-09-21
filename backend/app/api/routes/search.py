from fastapi import APIRouter, Request, Query
from backend.app.schemas.common import SuccessEnvelope
from backend.app.storage import repository

router = APIRouter(tags=["search"])

@router.get("/search", response_model=SuccessEnvelope)
async def search(
    request: Request,
    q: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    cluster_id: int | None = None,
):
    trace_id = getattr(request.state, "trace_id", None)
    items = repository.papers.all() + repository.repos.all()
    if q:
        items = [i for i in items if q.lower() in i.get("title", "").lower()]
    if cluster_id is not None:
        items = [i for i in items if i.get("cluster_id") == cluster_id]
    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    page_items = items[start:end]
    results = [
        {
            "id": it["_id"],
            "type": it["type"],
            "title": it.get("title"),
            "summary": it.get("summary"),
            "tags": it.get("tags", []),
            "scores": it.get("scores", {}),
            "cluster_id": it.get("cluster_id"),
        }
        for it in page_items
    ]
    return SuccessEnvelope(
        data={
            "page": page,
            "page_size": page_size,
            "total": total,
            "results": results,
            "clusters": [],
            "timings": {"query_ms": 0},
        },
        meta={"trace_id": trace_id},
    )
