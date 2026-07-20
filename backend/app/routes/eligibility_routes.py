from fastapi import APIRouter

from app.models.request_models import UserProfile
from app.services.eligibility_service import EligibilityService
from app.api import success

router = APIRouter()

service = EligibilityService()


# ==========================
# Check Eligibility
# ==========================
@router.post("/eligibility/check")
def check_eligibility(user: UserProfile):
    """
    Check eligible schemes for a user.
    """
    result = service.check_eligibility(user)
    return success(result, "Eligibility check completed successfully.")
