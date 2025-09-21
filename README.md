# Project Scaffold (MVP Foundations)

This repository now contains the initial greenfield scaffolding implementing the previously identified MUST-FIX baseline before core feature development (search, clustering, model switching) begins.

## Contents Added

Backend (FastAPI): `backend/`
Frontend (React + Vite + TS + Tailwind): `frontend/`
Documentation specs: `docs/error-schema.md`, `docs/reindex-spec.md`, `docs/logging-observability.md`
CI: `.github/workflows/ci.yml`
Tests: `tests/` (health check + fixtures)

## Quick Start

### 1. Backend (uv managed)

We use [uv](https://github.com/astral-sh/uv) for dependency and virtualenv management (fast, lockfile‑less by default, PEP 582 compatible).

Install uv if you don't already have it:
```powershell
pip install uv
```

Sync dependencies (base + test extras):
```powershell
uv sync --extra test
```

(Optional) include ML stack when starting clustering work:
```powershell
uv sync --extra ml --extra test
```

Copy environment template:
```powershell
Copy-Item .env.example .env
```
Edit `.env` and set at minimum:
```
ADMIN_API_KEY=replace-with-secure-admin-key
```

Run API via uv (isolated environment):
```powershell
uv run uvicorn backend.main:app --reload
```
Health endpoint: http://localhost:8000/health

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### 3. Tests

```powershell
uv run pytest -q
```

## Standard Response Envelope (Summary)
Success:
```json
{ "ok": true, "data": {"...": "..."}, "meta": {"trace_id": "..."} }
```
Error:
```json
{ "ok": false, "error": {"code": "RATE_LIMIT_EXCEEDED", "message": "...", "trace_id": "..."} }
```
Details: see `docs/error-schema.md`.

## Observability (Initial)
Structured JSON logging + placeholder Prometheus metrics (in-memory). Specification: `docs/logging-observability.md`.

## Reindex / Embedding Dimension Change
Specification & phases: `docs/reindex-spec.md` (idempotent, resumable, progress metrics). Implementation stub in `backend/app/services/reindex.py`.

## Security Baseline
- Admin-only routes require `X-Admin-Key` header (exact match `ADMIN_API_KEY`).
- Rate limiting middleware (token bucket) with default window tuned via environment.

## Next Candidate Steps (After Review)
1. Implement embedding + LLM provider abstraction + mock providers.
2. Add ingestion & enrichment skeleton services.
3. Extend admin endpoints for model listing & switching logic.
4. Introduce clustering / projection job stubs (returns placeholder coordinates).
5. Accessibility & performance test harness (Lighthouse / axe).

## Notes
Heavy ML dependencies are optional under the `ml` extra in `pyproject.toml` and not installed by default to keep early iteration lightweight.

---
Review the added artifacts and provide feedback on any adjustments before we proceed to feature implementation.

### Why uv?
* Fast, parallel resolver & installer
* Native extras support (e.g., `uv sync --extra ml --extra test`)
* Simplifies reproducibility without maintaining a separate requirements file

