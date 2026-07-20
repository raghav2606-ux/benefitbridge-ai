from fastapi import APIRouter

from app.models.request_models import UserProfile
from app.services.eligibility_service import EligibilityService
from app.api import success

router = APIRouter(prefix="/recommendations", tags=["recommendations"])
service = EligibilityService()


@router.post("/search")
def recommendation_search(user: UserProfile):
    return success(service.check_eligibility(user), "Recommendations retrieved successfully.")
