from pydantic import BaseModel
from typing import Any, List, Optional


class SchemeResponse(BaseModel):
    success: bool
    message: str
    scheme_id: Optional[str] = None
    errors: Optional[List[str]] = None


class ErrorResponse(BaseModel):
    detail: str


class PaginatedSchemeResponse(BaseModel):
    page: int
    limit: int
    total_schemes: int
    total_pages: int
    data: List[dict[str, Any]]
