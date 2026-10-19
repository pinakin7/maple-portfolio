from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict

app = FastAPI(title="Maple Analytics", docs_url=None, redoc_url=None, openapi_url=None)


class HealthStatus(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    service: Literal["maple-analytics"] = "maple-analytics"
    status: Literal["ok"] = "ok"
    portfolio_data_supported: Literal[False] = False


@app.get("/healthz", response_model=HealthStatus)
def health() -> HealthStatus:
    return HealthStatus()
