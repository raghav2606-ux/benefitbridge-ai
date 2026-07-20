import axios from "axios";
import { API_CONFIG } from "@/config/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  if (error.code === "ECONNABORTED") return "The request timed out. Please try again.";
  if (!error.response) return "Unable to reach BenefitBridge AI. Check your connection and try again.";
  const message = error.response.data?.message ?? error.response.data?.detail;
  return typeof message === "string" ? message : fallback;
}

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
