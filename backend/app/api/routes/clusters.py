from fastapi import APIRouter, Request
from backend.app.schemas.common import SuccessEnvelope

router = APIRouter(tags=["clusters"])

@router.get("/clusters/map", response_model=SuccessEnvelope)
async def cluster_map(request: Request):
    trace_id = getattr(request.state, "trace_id", None)
    return SuccessEnvelope(
        data={
            "projection_version": 0,
            "generated_at": None,
            "points": [],
            "bounds": {"minX": -1, "maxX": 1, "minY": -1, "maxY": 1},
            "meta": {"total": 0, "clusters": 0},
        },
        meta={"trace_id": trace_id},
    )
