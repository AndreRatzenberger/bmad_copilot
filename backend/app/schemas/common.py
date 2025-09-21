from pydantic import BaseModel
from typing import Any, Optional

class ErrorDetail(BaseModel):
    code: str
    message: str
    trace_id: Optional[str] = None

class ErrorEnvelope(BaseModel):
    ok: bool = False
    error: ErrorDetail

    @classmethod
    def from_error(cls, code: str, message: str, trace_id: str | None = None):
        return cls(error=ErrorDetail(code=code, message=message, trace_id=trace_id))

class SuccessEnvelope(BaseModel):
    ok: bool = True
    data: Any
    meta: dict[str, Any] | None = None
