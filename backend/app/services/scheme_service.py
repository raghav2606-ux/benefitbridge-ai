"""Scheme catalogue operations kept independent from FastAPI response formatting."""

import csv
import io
from collections import Counter
from typing import Any

from openpyxl import Workbook
from app.builders.scheme_builder import SchemeBuilder
from app.models.scheme_model import Scheme


class SchemeService:
    """Read, write, query, and export a single validated scheme catalogue."""

    EXPORT_HEADERS = ["ID", "Name", "Category", "Government Level", "State"]

    def __init__(self) -> None:
        self.builder = SchemeBuilder()

    def _load(self, filepath: str) -> list[dict[str, Any]]:
        """Load a list defensively; JSONWriter already validates the root shape."""
        return self.builder.writer.load(filepath)

    @staticmethod
    def _text(value: Any) -> str:
        return value.strip() if isinstance(value, str) else ""

    @classmethod
    def _matches(cls, scheme: dict[str, Any], field: str, value: str) -> bool:
        return cls._text(scheme.get(field)).casefold() == value.strip().casefold()

    @staticmethod
    def _row(scheme: dict[str, Any]) -> list[Any]:
        return [scheme.get("id", ""), scheme.get("name", ""), scheme.get("category", ""), scheme.get("government_level", ""), scheme.get("state", "")]

    def add_scheme(self, filepath: str, category: str, scheme_data: dict[str, Any]) -> dict[str, Any]:
        return self.builder.build(filepath, category, scheme_data)

    def get_schemes(self, filepath: str) -> list[dict[str, Any]]:
        return self._load(filepath)

    def get_scheme_by_id(self, filepath: str, scheme_id: str) -> dict[str, Any] | None:
        return next((scheme for scheme in self._load(filepath) if scheme.get("id") == scheme_id), None)

    def get_schemes_by_category(self, filepath: str, category: str) -> list[dict[str, Any]]:
        return [scheme for scheme in self._load(filepath) if self._matches(scheme, "category", category)]

    def update_scheme(self, filepath: str, scheme_id: str, scheme_data: dict[str, Any]) -> dict[str, Any] | None:
        schemes = self._load(filepath)
        for index, scheme in enumerate(schemes):
            if scheme.get("id") == scheme_id:
                validated = Scheme(**{**scheme_data, "id": scheme_id})
                schemes[index] = validated.model_dump()
                self.builder.writer.save(filepath, schemes)
                return schemes[index]
        return None

    def delete_scheme(self, filepath: str, scheme_id: str) -> dict[str, Any] | None:
        schemes = self._load(filepath)
        for index, scheme in enumerate(schemes):
            if scheme.get("id") == scheme_id:
                deleted = schemes.pop(index)
                self.builder.writer.save(filepath, schemes)
                return deleted
        return None

    def search_schemes(self, filepath: str, keyword: str) -> list[dict[str, Any]]:
        query = keyword.casefold().strip()
        def searchable(scheme: dict[str, Any]) -> str:
            benefit = scheme.get("benefit") if isinstance(scheme.get("benefit"), dict) else {}
            source = scheme.get("source") if isinstance(scheme.get("source"), dict) else {}
            metadata = scheme.get("ai_metadata") if isinstance(scheme.get("ai_metadata"), dict) else {}
            values = [scheme.get(key, "") for key in ("name", "description", "category", "subcategory", "government_level", "state")]
            values += [benefit.get("type", ""), benefit.get("description", ""), source.get("organization", "")]
            values += list(scheme.get("required_documents") or []) + list(metadata.get("tags") or [])
            return " ".join(str(value) for value in values).casefold()
        return [scheme for scheme in self._load(filepath) if query in searchable(scheme)]

    def filter_by_government(self, filepath: str, government_level: str) -> list[dict[str, Any]]:
        return [scheme for scheme in self._load(filepath) if self._matches(scheme, "government_level", government_level)]

    def filter_by_state(self, filepath: str, state: str) -> list[dict[str, Any]]:
        return [scheme for scheme in self._load(filepath) if self._matches(scheme, "state", state)]

    def get_schemes_paginated(self, filepath: str, page: int, limit: int) -> dict[str, Any]:
        schemes = self._load(filepath)
        total = len(schemes)
        start = (page - 1) * limit
        return {"page": page, "limit": limit, "total_schemes": total, "total_pages": (total + limit - 1) // limit, "data": schemes[start:start + limit]}

    def get_statistics(self, filepath: str) -> dict[str, Any]:
        schemes = self._load(filepath)
        def count(field: str) -> dict[str, int]:
            return dict(Counter(self._text(scheme.get(field)) or "Unknown" for scheme in schemes))
        return {"total_schemes": len(schemes), "government_levels": count("government_level"), "categories": count("category"), "states": count("state")}

    def _sort(self, filepath: str, field: str) -> list[dict[str, Any]]:
        return sorted(self._load(filepath), key=lambda scheme: self._text(scheme.get(field)).casefold())

    def sort_by_name(self, filepath: str) -> list[dict[str, Any]]: return self._sort(filepath, "name")
    def sort_by_category(self, filepath: str) -> list[dict[str, Any]]: return self._sort(filepath, "category")
    def sort_by_government(self, filepath: str) -> list[dict[str, Any]]: return self._sort(filepath, "government_level")
    def sort_by_state(self, filepath: str) -> list[dict[str, Any]]: return self._sort(filepath, "state")

    def export_csv(self, filepath: str) -> str:
        output = io.StringIO(newline="")
        writer = csv.writer(output)
        writer.writerow(self.EXPORT_HEADERS)
        writer.writerows(self._row(scheme) for scheme in self._load(filepath))
        return output.getvalue()

    def export_excel(self, filepath: str) -> bytes:
        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "Schemes"
        sheet.append(self.EXPORT_HEADERS)
        for scheme in self._load(filepath):
            sheet.append(self._row(scheme))
        output = io.BytesIO()
        workbook.save(output)
        return output.getvalue()
