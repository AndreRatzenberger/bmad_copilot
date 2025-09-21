from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_search_endpoint_basic():
    r = client.get("/search")
    assert r.status_code == 200
    data = r.json()["data"]
    assert set(data.keys()) >= {"page", "page_size", "total", "results"}
