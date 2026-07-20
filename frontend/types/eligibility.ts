// ================================
// Request Sent to Backend
// ================================

export interface EligibilityRequest {
  age: number;
  gender: string;
  income: number;
  state: string;
  category: string;
  citizenship?: string;
  occupation?: string;
  education_level?: string;
  class_or_course?: string;
  has_disability?: boolean;
  is_farmer?: boolean;
  available_documents?: string[];
}

// ================================
// Benefit
// ================================

export interface Benefit {
  type: string;
  amount: string;
  description: string;
}
export interface DocumentStatus {
  name: string;
  status: "Ready" | "Missing";
  source?: "self_reported" | "ocr" | "manual_review";
}

export interface DocumentReadiness {
  ready_count: number;
  missing_count: number;
  recommendation: string;
}

// ================================
// Application
// ================================

export interface Application {
  mode: string;
  portal: string;
  official_url: string;
  deadline: string;
}

// ================================
// AI Explanation
// ================================

export interface AIExplanation {
  summary: string;
  why_eligible: string[];
  confidence: number;
}

export interface EligibilityBreakdown {
  title: string;
  score: number;
  matched: boolean;
}


// ================================
// Eligibility Criteria
// ================================

export interface EligibilityCriteria {
  citizenship: string;

  min_age: number;
  max_age: number;

  gender: string[];

  category: string[];

  max_family_income: number;

  occupation: string[];

  education_level: string[];

  class_or_course: string[];

  state_specific: boolean;

  disability_required: boolean;

  farmer_required: boolean;

  other_conditions: string[];
}

// ================================
// Scheme
// ================================

export interface EligibleScheme {
  scheme_id: string;

  scheme_name: string;

  category: string;

  government_level: string;

  state: string;

  summary: string;

  eligibility: EligibilityCriteria;

  required_documents: string[];

  benefit: Benefit;

  application: Application;

  action_plan: string[];

  recommended_next_steps?: string[];

  eligibility_score: number;

  eligibility_confidence?: number;

estimated_benefit: string;

difficulty: string;

processing_time: string;

  ai_explanation: AIExplanation;

  eligibility_breakdown: EligibilityBreakdown[];

  document_status: DocumentStatus[];

  document_readiness?: DocumentReadiness;
}


// ================================
// Response from Backend
// ================================

export interface EligibilityResponse {
  success: boolean;

  total_eligible: number;

  eligible_schemes: EligibleScheme[];
}
