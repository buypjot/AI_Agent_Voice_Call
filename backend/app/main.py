from fastapi import FastAPI

from app.api.health import router as health_router

app = FastAPI(
    title="AI Agent Voice Call API",
    version="1.0.0",
)

app.include_router(health_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "status": "running",
        "service": "AI Agent Voice Call Backend",
    }
