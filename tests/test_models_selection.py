from fastapi.testclient import TestClient
from backend.main import app

ADMIN_KEY = "changeme-admin"
client = TestClient(app)

def _headers():
    return {"X-Admin-Key": ADMIN_KEY}

def test_list_models():
    r = client.get("/admin/models/llm", headers=_headers())
    assert r.status_code == 200
    assert "llm_models" in r.json()["data"]

def test_active_models():
    r = client.get("/admin/models/active", headers=_headers())
    assert r.status_code == 200
    assert "active" in r.json()["data"]

def test_select_llm_model():
    r = client.post("/admin/models/llm/select", headers=_headers(), json={"model_id": "gpt-4o"})
    assert r.status_code == 200
    active = r.json()["data"]["active"]
    assert active["llm_id"] == "gpt-4o"

def test_embedding_dimension_mismatch_error():
    # first ensure active embedding is large (default), then try switching to small without force to simulate mismatch.
    r = client.post("/admin/models/embeddings/select", headers=_headers(), json={"model_id": "text-embedding-3-small"})
    body = r.json()
    assert body["ok"] is False
    assert body["error"]["code"] == "DIMENSION_MISMATCH"

def test_embedding_force_switch():
    r = client.post("/admin/models/embeddings/select", headers=_headers(), json={"model_id": "text-embedding-3-small", "force": True})
    assert r.status_code == 200
    active = r.json()["data"]["active"]
    assert active["embedding_id"] == "text-embedding-3-small"
    assert active["reindex_required"] is True
