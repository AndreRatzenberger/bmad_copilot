from fastapi import APIRouter, Request
from backend.app.schemas.common import SuccessEnvelope

router = APIRouter(tags=["system"])

@router.get("/health", response_model=SuccessEnvelope)
async def health(request: Request):
    trace_id = getattr(request.state, "trace_id", None)
    return SuccessEnvelope(data={"status": "ok"}, meta={"trace_id": trace_id})
