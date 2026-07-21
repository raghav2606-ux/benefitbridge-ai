import { readLocalStorage, removeLocalStorage, writeLocalStorage } from "@/lib/storage";

export const COMPARE_SCHEME_IDS_KEY = "benefitbridge.compareSchemeIds";
const MAX_COMPARE_SCHEMES = 2;

export function getComparisonSchemeIds(): string[] {
  return readLocalStorage(COMPARE_SCHEME_IDS_KEY, (value) => Array.isArray(value)
      ? Array.from(new Set(value.filter((id): id is string => typeof id === "string"))).slice(0, MAX_COMPARE_SCHEMES)
      : []) ?? [];
}

export function saveComparisonSchemeIds(ids: string[]) {
  return writeLocalStorage(COMPARE_SCHEME_IDS_KEY, Array.from(new Set(ids)).slice(0, MAX_COMPARE_SCHEMES));
}

export function clearComparisonSchemeIds() {
  return removeLocalStorage(COMPARE_SCHEME_IDS_KEY);
}
