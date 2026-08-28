from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
async def health() -> dict[str, object]:
    return {
        "success": True,
        "message": "Backend Running",
    }
