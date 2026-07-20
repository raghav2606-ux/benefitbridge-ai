"""Shared API response and error-handling helpers.

Every route uses the same JSON envelope so clients can handle success and
failure consistently without relying on endpoint-specific shapes.
"""

from typing import Any

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def success(data: Any = None, message: str = "Request completed successfully.") -> dict[str, Any]:
    return {"success": True, "message": message, "data": data}


def failure(message: str, errors: Any = None) -> dict[str, Any]:
    payload: dict[str, Any] = {"success": False, "message": message, "data": None}
    if errors is not None:
        payload["errors"] = errors
    return payload


async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail
    message = detail if isinstance(detail, str) else "Request could not be completed."
    errors = detail if isinstance(detail, list) else None
    return JSONResponse(status_code=exc.status_code, content=failure(message, errors))


async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    errors = [
        {"field": ".".join(str(part) for part in error["loc"] if part != "body"), "message": error["msg"]}
        for error in exc.errors()
    ]
    return JSONResponse(status_code=422, content=failure("Validation failed.", errors))


async def unhandled_exception_handler(_: Request, __: Exception) -> JSONResponse:
    # Do not expose stack traces or implementation details to API consumers.
    return JSONResponse(status_code=500, content=failure("An unexpected server error occurred."))
