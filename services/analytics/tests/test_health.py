from fastapi.testclient import TestClient

from analytics.main import app


def test_health_and_no_upload_surface() -> None:
    with TestClient(app) as client:
        response = client.get("/healthz")
        assert response.status_code == 200
        assert response.json() == {
            "service": "maple-analytics",
            "status": "ok",
            "portfolio_data_supported": False,
        }
        assert client.post("/upload", content="synthetic").status_code == 404
        assert client.get("/docs").status_code == 404
