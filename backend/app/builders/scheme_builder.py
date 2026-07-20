from app.builders.json_writer import JSONWriter
from app.builders.validator import SchemeValidator
from app.builders.id_generator import IDGenerator
from app.models.scheme_model import Scheme
from pydantic import ValidationError


class SchemeBuilder:

    def __init__(self):
        self.writer = JSONWriter()

    def build(
        self,
        filepath: str,
        category: str,
        scheme_data: dict
    ):
        # Load existing schemes
        existing = self.writer.load(filepath)

        # Collect existing IDs safely
        existing_ids = [
            item["id"]
            for item in existing
            if "id" in item
        ]

        # Generate a new unique ID
        if scheme_data.get("category") != category:
            return {"success": False, "errors": ["Request category must match scheme_data.category."]}

        scheme_data = {**scheme_data}
        try:
            scheme_data["id"] = IDGenerator.generate_id(category, existing_ids)
            scheme = Scheme(**scheme_data)
        except (ValidationError, ValueError) as error:
            errors = [item["msg"] for item in error.errors()] if isinstance(error, ValidationError) else [str(error)]
            return {"success": False, "errors": errors}

        # Validate scheme
        errors = SchemeValidator.validate_scheme(scheme)

        if errors:
            return {
                "success": False,
                "errors": errors
            }

        # Add scheme to existing data
        existing.append(
            scheme.model_dump()
        )

        # Save updated data
        self.writer.save(
            filepath,
            existing
        )

        return {
            "success": True,
            "scheme_id": scheme.id,
            "message": "Scheme added successfully."
        }
