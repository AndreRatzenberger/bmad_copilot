from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    admin_api_key: str = "changeme-admin"
    rate_limit_requests: int = 60
    rate_limit_window_seconds: int = 60
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache
def get_settings() -> Settings:
    return Settings()
