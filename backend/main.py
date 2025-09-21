from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from backend.app.middleware.logging import logging_middleware
from backend.app.middleware.rate_limit import rate_limit_middleware
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.admin_models import router as admin_models_router
from backend.app.api.routes.search import router as search_router
from backend.app.api.routes.clusters import router as clusters_router
from backend.app.api.routes.theory import router as theory_router
from backend.app.storage.repository import seed_demo_items
from backend.app.schemas.common import ErrorEnvelope
from backend.app.observability.metrics import metrics_router
from backend.app.security.auth import AuthError

app = FastAPI(title="MVP Backend", version="0.1.0")

@app.exception_handler(AuthError)
async def auth_error_handler(_: Request, exc: AuthError):
    return JSONResponse(status_code=exc.status_code, content=ErrorEnvelope.from_error(code=exc.code, message=exc.message).model_dump())

@app.middleware("http")
async def root_middleware(request: Request, call_next):
    response = await logging_middleware(request, call_next)
    return response

@app.middleware("http")
async def rl_middleware(request: Request, call_next):
    return await rate_limit_middleware(request, call_next)

@app.on_event("startup")
async def _startup():  # noqa: D401
    seed_demo_items()

app.include_router(health_router)
app.include_router(search_router)
app.include_router(clusters_router)
app.include_router(theory_router)
app.include_router(admin_models_router, prefix="/admin/models", tags=["admin-models"])
app.include_router(metrics_router)

