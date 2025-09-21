from fastapi import Header, Depends

from backend.app.config import get_settings

class AuthError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 401):
        self.code = code
        self.message = message
        self.status_code = status_code

def admin_key_dependency(x_admin_key: str | None = Header(default=None), settings=Depends(get_settings)):
    if not x_admin_key or x_admin_key != settings.admin_api_key:
        raise AuthError(code="UNAUTHORIZED", message="Invalid or missing admin key", status_code=401)
    return True
