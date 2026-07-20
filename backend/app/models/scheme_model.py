from pydantic import BaseModel, Field
from typing import List


class Benefit(BaseModel):
    type: str
    amount: str
    description: str


class Eligibility(BaseModel):
    citizenship: str

    min_age: int

    max_age: int

    gender: List[str]

    max_family_income: int

    occupation: List[str]

    education_level: List[str]

    class_or_course: List[str]

    category: List[str]

    state_specific: bool

    disability_required: bool

    farmer_required: bool

    other_conditions: List[str]


class Application(BaseModel):
    mode: str

    portal: str

    official_url: str

    deadline: str


class Benefits(BaseModel):
    financial: str

    non_financial: List[str]


class AIMetadata(BaseModel):
    priority: int = Field(ge=1, le=5)

    difficulty: str

    estimated_processing_time: str

    tags: List[str]


class AIExplanation(BaseModel):
    summary: str

    eligibility_reason_template: str

    common_rejection_reasons: List[str]

    tips: List[str]

    frequently_asked_questions: List[str]

    next_steps: List[str]


class Source(BaseModel):
    organization: str

    official_url: str


class Scheme(BaseModel):

    id: str

    name: str

    category: str

    subcategory: str

    government_level: str

    state: str

    description: str

    benefit: Benefit

    eligibility: Eligibility

    required_documents: List[str]

    application: Application

    benefits: Benefits

    ai_metadata: AIMetadata

    ai_explanation: AIExplanation

    version: str

    last_verified: str

    source: Source