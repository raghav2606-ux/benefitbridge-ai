from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
import os

from app.routes.scheme_routes import router as scheme_router
from app.routes.eligibility_routes import router as eligibility_router
from app.routes.recommendation_routes import router as recommendation_router
from app.api import http_exception_handler, unhandled_exception_handler, validation_exception_handler

app = FastAPI(
    title="BenefitBridge AI",
    description="Government Scheme Recommendation System",
    version="1.0.0",
)

# Every validation, HTTP, and unexpected failure uses the shared JSON envelope.
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"success": True, "message": "BenefitBridge AI Backend Running", "data": {"status": "ok"}}

app.include_router(scheme_router)
app.include_router(eligibility_router)
app.include_router(recommendation_router)


@app.get("/health")
def health():
    return {"success": True, "message": "Service is healthy.", "data": {"status": "ok"}}
