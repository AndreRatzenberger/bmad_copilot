from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_theory_query():
    r = client.post("/theory/query", json={"theory": "Transformer architectures for long context"})
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["theory"].startswith("Transformer")
    assert "supports" in data and "contradicts" in data
