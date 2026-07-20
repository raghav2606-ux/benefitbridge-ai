import api, { ApiResponse } from "./api";
import {
  EligibilityRequest,
  EligibilityResponse,
} from "@/types/eligibility";

export async function checkEligibility(
  data: EligibilityRequest
): Promise<EligibilityResponse> {
  const response = await api.post<ApiResponse<EligibilityResponse>>(
    "/eligibility/check",
    data
  );

  return response.data.data;
}
