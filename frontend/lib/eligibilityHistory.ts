import { EligibilityRequest, EligibleScheme } from "@/types/eligibility";
import { readLocalStorage, writeLocalStorage } from "@/lib/storage";

export const ELIGIBILITY_HISTORY_KEY = "benefitbridge.eligibilityHistory";

export interface EligibilityHistory {
  checkedAt: string;
  profile: EligibilityRequest;
  schemes: EligibleScheme[];
}

export function getEligibilityHistory(): EligibilityHistory | null {
  return readLocalStorage(ELIGIBILITY_HISTORY_KEY, (value) => {
    if (!value || typeof value !== "object") return null;
    const history = value as Partial<EligibilityHistory>;
    return typeof history.checkedAt === "string" && Array.isArray(history.schemes) && history.profile && typeof history.profile === "object"
      ? { checkedAt: history.checkedAt, profile: history.profile as EligibilityRequest, schemes: history.schemes as EligibleScheme[] }
      : null;
  });
}

export function saveEligibilityHistory(profile: EligibilityRequest, schemes: EligibleScheme[]) {
  const history: EligibilityHistory = { checkedAt: new Date().toISOString(), profile, schemes };
  return writeLocalStorage(ELIGIBILITY_HISTORY_KEY, history);
}
