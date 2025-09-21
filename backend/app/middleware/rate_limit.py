import time
from collections import defaultdict, deque
from fastapi import Request
from backend.app.config import get_settings
from backend.app.schemas.common import ErrorEnvelope
from starlette.responses import JSONResponse

_windows: dict[str, deque[float]] = defaultdict(deque)

async def rate_limit_middleware(request: Request, call_next):
    settings = get_settings()
    key = request.client.host if request.client else "unknown"
    window = settings.rate_limit_window_seconds
    now = time.time()
    bucket = _windows[key]
    # purge expired
    while bucket and now - bucket[0] > window:
        bucket.popleft()
    if len(bucket) >= settings.rate_limit_requests:
        envelope = ErrorEnvelope.from_error(code="RATE_LIMIT_EXCEEDED", message="Too many requests").model_dump()
        return JSONResponse(status_code=429, content=envelope)
    bucket.append(now)
    return await call_next(request)
