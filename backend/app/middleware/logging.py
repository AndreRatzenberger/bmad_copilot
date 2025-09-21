import json
import time
import uuid
from typing import Callable, Awaitable
from fastapi import Request

async def logging_middleware(request: Request, call_next: Callable[[Request], Awaitable]):
    trace_id = str(uuid.uuid4())
    start = time.perf_counter()
    request.state.trace_id = trace_id
    try:
        response = await call_next(request)
        duration_ms = (time.perf_counter() - start) * 1000
        log = {
            "trace_id": trace_id,
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "duration_ms": round(duration_ms, 2),
        }
        print(json.dumps(log))
        if hasattr(response, "body") and response.body:
            # ensure trace id appears in envelope if possible
            pass
        return response
    except Exception as e:  # noqa: BLE001
        duration_ms = (time.perf_counter() - start) * 1000
        error_log = {
            "trace_id": trace_id,
            "method": request.method,
            "path": request.url.path,
            "status": 500,
            "duration_ms": round(duration_ms, 2),
            "error": str(e),
        }
        print(json.dumps(error_log))
        raise
