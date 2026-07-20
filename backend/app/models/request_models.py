from typing import Any, Dict
from pydantic import BaseModel, ConfigDict, Field, field_validator


# ==========================
# Scheme Request
# ==========================
class SchemeRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    filepath: str = "data/education.json"
    category: str = Field(min_length=1, max_length=100)
    scheme_data: Dict[str, Any]


# ==========================
# User Profile
# ==========================
class UserProfile(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    age: int = Field(ge=0, le=150)
    gender: str = Field(min_length=1, max_length=50)
    income: int = Field(ge=0)
    state: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=100)
    citizenship: str = "Indian"
    occupation: str | None = None
    education_level: str | None = None
    class_or_course: str | None = None
    has_disability: bool = False
    is_farmer: bool = False
    available_documents: list[str] = Field(default_factory=list, max_length=50)

    @field_validator("available_documents")
    @classmethod
    def validate_documents(cls, documents: list[str]) -> list[str]:
        if any(not document.strip() for document in documents):
            raise ValueError("Document names cannot be blank.")
        return documents
