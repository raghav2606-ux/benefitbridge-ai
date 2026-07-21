export interface SchemeBenefit {
  type: string;
  amount: string;
  description: string;
}

export interface SchemeEligibility {
  citizenship: string;
  min_age: number;
  max_age: number;
  gender: string[];
  max_family_income: number;
  occupation: string[];
  education_level: string[];
  class_or_course: string[];
  category: string[];
  state_specific: boolean;
  disability_required: boolean;
  farmer_required: boolean;
  other_conditions: string[];
}

export interface SchemeApplication {
  mode: string;
  portal: string;
  official_url: string;
  deadline: string;
}

export interface Scheme {
  id: string;
  name: string;
  category: string;
  description: string;
  last_verified: string;
  source: { organization: string; official_url: string };
  benefit: SchemeBenefit;
  benefits: { financial: string; non_financial: string[] };
  eligibility: SchemeEligibility;
  required_documents: string[];
  application: SchemeApplication;
}
