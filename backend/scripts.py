"""Helper console script entrypoints for uv project scripts.

These provide ergonomic shortcuts so agents / developers can run common
tasks without remembering longer commands.

Available scripts (declared in pyproject.toml):
  uv run mvp-backend   -> backend.main:run (honors PORT, HOST, RELOAD)
  uv run dev-backend   -> run_dev() sets RELOAD=1 automatically
  uv run tests         -> run_tests() executes pytest (needs test extra)

Environment Flags:
  NO_SERVER=1  -> `run()` in backend.main exits early (used during tests)
  PORT / HOST  -> override listening interface
  RELOAD=1     -> enable autoreload (dev only)
"""
from __future__ import annotations

import os
import sys


def run_dev() -> None:  # pragma: no cover - thin wrapper
    """Launch backend in development mode (reload enabled)."""
    os.environ.setdefault("RELOAD", "1")
    from backend.main import run  # local import to avoid side effects during build

    run()


def run_tests() -> None:  # pragma: no cover - delegates to pytest
    """Execute pytest inside the uv-managed environment.

    Exits with pytest's return code. Requires test extras to be installed:
        uv sync --extra test
    """
    try:
        import pytest  # type: ignore
    except ImportError as exc:  # pragma: no cover
        print("pytest not installed. Run: uv sync --extra test", file=sys.stderr)
        raise SystemExit(1) from exc

    # Ensure server auto-start avoidance for any accidental console script calls
    os.environ.setdefault("NO_SERVER", "1")
    code = pytest.main()
    raise SystemExit(code)


__all__ = ["run_dev", "run_tests"]