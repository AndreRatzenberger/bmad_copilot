from fastapi import APIRouter, Depends, Request, Body
from pydantic import BaseModel
from backend.app.security.auth import admin_key_dependency
from backend.app.schemas.common import SuccessEnvelope, ErrorEnvelope
from backend.app.services import model_config

router = APIRouter()

class SelectModelBody(BaseModel):
    model_id: str
    force: bool | None = None  # for embedding only

    model_config = {"protected_namespaces": ()}

@router.get("/llm", response_model=SuccessEnvelope | ErrorEnvelope, dependencies=[Depends(admin_key_dependency)])
async def list_llm(request: Request):
    trace_id = getattr(request.state, "trace_id", None)
    models = [m.model_dump() for m in model_config.list_llm_models()]
    return SuccessEnvelope(data={"llm_models": models}, meta={"trace_id": trace_id})

@router.get("/embeddings", response_model=SuccessEnvelope | ErrorEnvelope, dependencies=[Depends(admin_key_dependency)])
async def list_embeddings(request: Request):
    trace_id = getattr(request.state, "trace_id", None)
    models = [m.model_dump() for m in model_config.list_embedding_models()]
    return SuccessEnvelope(data={"embedding_models": models}, meta={"trace_id": trace_id})

@router.get("/active", response_model=SuccessEnvelope | ErrorEnvelope, dependencies=[Depends(admin_key_dependency)])
async def active_models(request: Request):
    trace_id = getattr(request.state, "trace_id", None)
    active = model_config.get_active().model_dump()
    return SuccessEnvelope(data={"active": active}, meta={"trace_id": trace_id})

@router.post("/llm/select", response_model=SuccessEnvelope | ErrorEnvelope, dependencies=[Depends(admin_key_dependency)])
async def select_llm(request: Request, body: SelectModelBody = Body(...)):
    trace_id = getattr(request.state, "trace_id", None)
    try:
        active = model_config.select_llm(body.model_id).model_dump()
    except ValueError as e:  # noqa: BLE001
        return ErrorEnvelope.from_error(code="MODEL_NOT_FOUND", message=str(e), trace_id=trace_id)
    return SuccessEnvelope(data={"active": active}, meta={"trace_id": trace_id})

@router.post("/embeddings/select", response_model=SuccessEnvelope | ErrorEnvelope, dependencies=[Depends(admin_key_dependency)])
async def select_embedding(request: Request, body: SelectModelBody = Body(...)):
    trace_id = getattr(request.state, "trace_id", None)
    try:
        active = model_config.select_embedding(body.model_id, force=bool(body.force)).model_dump()
    except model_config.DimensionMismatchError as dm:
        return ErrorEnvelope.from_error(
            code="DIMENSION_MISMATCH",
            message=f"current={dm.current} new={dm.new} set force=true to override",
            trace_id=trace_id,
        )
    except ValueError as e:  # noqa: BLE001
        return ErrorEnvelope.from_error(code="MODEL_NOT_FOUND", message=str(e), trace_id=trace_id)
    return SuccessEnvelope(data={"active": active}, meta={"trace_id": trace_id})

