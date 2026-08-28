from fastapi import FastAPI

app = FastAPI(
    title="AI Agent Voice Call API",
    version="1.0.0",
)


@app.get("/")
async def root():
    return {
        "status": "running",
        "service": "AI Agent Voice Call Backend",
    }


@app.get("/api/health")
async def health():
    return {
        "success": True,
        "message": "Backend Running",
    }
