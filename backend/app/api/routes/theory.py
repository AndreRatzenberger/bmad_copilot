from fastapi import APIRouter, Request, Body
from pydantic import BaseModel, Field
from backend.app.schemas.common import SuccessEnvelope, ErrorEnvelope

router = APIRouter(tags=["theory"])

class TheoryQueryBody(BaseModel):
    theory: str = Field(min_length=5)

@router.post("/theory/query", response_model=SuccessEnvelope)
async def theory_query(request: Request, body: TheoryQueryBody = Body(...)):
    trace_id = getattr(request.state, "trace_id", None)
    if len(body.theory.strip()) < 5:
        return ErrorEnvelope.from_error(code="INVALID_INPUT", message="Theory too short", trace_id=trace_id)
    # Placeholder: always return empty evidence + suggestions example
    payload = {
        "theory": body.theory,
        "supports": [],
        "contradicts": [],
        "related_suggestions": ["Refine keywords", "Alternate phrasing"],
        "timings": {"classification_ms": 0},
    }
    return SuccessEnvelope(data=payload, meta={"trace_id": trace_id})
