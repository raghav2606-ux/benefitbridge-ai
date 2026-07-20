"""Validated builder endpoints. URLs are intentionally kept stable."""

import base64

from fastapi import APIRouter, HTTPException, Path, Query
from pydantic import ValidationError

from app.api import success
from app.config import resolve_scheme_file
from app.data_loader import load_all_schemes
from app.models.request_models import SchemeRequest
from app.services.scheme_service import SchemeService

router = APIRouter()
service = SchemeService()
DEFAULT_FILE = "data/education.json"


def data_file(filepath: str = DEFAULT_FILE) -> str:
    """Resolve legacy file input once, returning a safe absolute data path."""
    try:
        return str(resolve_scheme_file(filepath))
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


def scheme_or_404(scheme_id: str) -> dict:
    scheme = service.get_scheme_by_id(data_file(), scheme_id)
    if scheme is None:
        raise HTTPException(status_code=404, detail="Scheme not found.")
    return scheme


@router.post("/builder/scheme", status_code=201)
def create_scheme(request: SchemeRequest):
    result = service.add_scheme(data_file(request.filepath), request.category, request.scheme_data)
    if not result["success"]:
        raise HTTPException(status_code=422, detail=result.get("errors", ["Invalid scheme data."]))
    return success({"scheme_id": result["scheme_id"]}, result["message"])


@router.get("/builder/schemes")
def get_schemes(
    category: str | None = Query(default=None, min_length=1, max_length=100),
    query: str | None = Query(default=None, min_length=1, max_length=100),
):
    """Return the complete catalogue for discovery; legacy detail routes stay unchanged."""
    schemes = load_all_schemes()
    if category:
        schemes = [scheme for scheme in schemes if str(scheme.get("category", "")).casefold() == category.casefold()]
    if query:
        normalized_query = query.casefold()
        schemes = [scheme for scheme in schemes if normalized_query in " ".join(str(scheme.get(field, "")) for field in ("name", "description", "category", "subcategory")).casefold()]
    return success(schemes, "Schemes retrieved successfully.")


@router.get("/builder/schemes/page")
def get_schemes_paginated(page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    return success(service.get_schemes_paginated(data_file(), page, limit), "Schemes retrieved successfully.")


@router.get("/builder/scheme/{scheme_id}")
def get_scheme_by_id(scheme_id: str = Path(min_length=1, max_length=50)):
    return success(scheme_or_404(scheme_id), "Scheme retrieved successfully.")


@router.get("/builder/category/{category}")
def get_schemes_by_category(category: str = Path(min_length=1, max_length=100)):
    return success(service.get_schemes_by_category(data_file(), category), "Schemes retrieved successfully.")


@router.get("/builder/search/{keyword}")
def search_schemes(keyword: str = Path(min_length=1, max_length=100)):
    return success(service.search_schemes(data_file(), keyword), "Search completed successfully.")


@router.get("/builder/filter/government/{government_level}")
def filter_by_government(government_level: str = Path(min_length=1, max_length=100)):
    return success(service.filter_by_government(data_file(), government_level), "Schemes filtered successfully.")


@router.get("/builder/filter/state/{state}")
def filter_by_state(state: str = Path(min_length=1, max_length=100)):
    return success(service.filter_by_state(data_file(), state), "Schemes filtered successfully.")


@router.get("/builder/stats")
def get_statistics():
    return success(service.get_statistics(data_file()), "Statistics retrieved successfully.")


@router.get("/builder/sort/{field}")
def sort_schemes(field: str = Path(pattern="^(name|category|government|state)$")):
    sorters = {"name": service.sort_by_name, "category": service.sort_by_category, "government": service.sort_by_government, "state": service.sort_by_state}
    return success(sorters[field](data_file()), "Schemes sorted successfully.")


# Preserve the original sort URLs alongside the shared implementation.
@router.get("/builder/sort/name")
def sort_by_name(): return success(service.sort_by_name(data_file()), "Schemes sorted successfully.")


@router.get("/builder/sort/category")
def sort_by_category(): return success(service.sort_by_category(data_file()), "Schemes sorted successfully.")


@router.get("/builder/sort/government")
def sort_by_government(): return success(service.sort_by_government(data_file()), "Schemes sorted successfully.")


@router.get("/builder/sort/state")
def sort_by_state(): return success(service.sort_by_state(data_file()), "Schemes sorted successfully.")


@router.get("/builder/export/csv")
def export_csv():
    content = service.export_csv(data_file()).encode("utf-8")
    return success({"filename": "schemes.csv", "content_type": "text/csv", "content_base64": base64.b64encode(content).decode("ascii")}, "CSV export generated successfully.")


@router.get("/builder/export/excel")
def export_excel():
    content = service.export_excel(data_file())
    return success({"filename": "schemes.xlsx", "content_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "content_base64": base64.b64encode(content).decode("ascii")}, "Excel export generated successfully.")


@router.put("/builder/scheme/{scheme_id}")
def update_scheme(request: SchemeRequest, scheme_id: str = Path(min_length=1, max_length=50)):
    try:
        result = service.update_scheme(data_file(request.filepath), scheme_id, request.scheme_data)
    except ValidationError as error:
        raise HTTPException(status_code=422, detail=error.errors()) from error
    if result is None:
        raise HTTPException(status_code=404, detail="Scheme not found.")
    return success({"scheme_id": scheme_id}, "Scheme updated successfully.")


@router.delete("/builder/scheme/{scheme_id}")
def delete_scheme(scheme_id: str = Path(min_length=1, max_length=50)):
    deleted_scheme = service.delete_scheme(data_file(), scheme_id)
    if deleted_scheme is None:
        raise HTTPException(status_code=404, detail="Scheme not found.")
    return success(deleted_scheme, "Scheme deleted successfully.")
