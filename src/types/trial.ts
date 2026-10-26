export interface TrialLocation {
  facility: string;
  city: string;
  country: string;
  status?: string;
  lat?: number;
  lng?: number;
}
export interface TrialSummary {
  id: string;
  title: string;
  status: string;
  phases: string[];
  studyType: string;
  conditions: string[];
  sponsor: string;
  summary: string;
  updated: string;
  locations: TrialLocation[];
}
export interface TrialDetail extends TrialSummary {
  description: string;
  eligibility: string;
  minAge: string;
  maxAge: string;
  sex: string;
  healthyVolunteers?: boolean;
  enrollment?: number;
  enrollmentType?: string;
  startDate: string;
  completionDate: string;
  design: string[];
  interventions: { name: string; type: string; description: string }[];
  outcomes: { measure: string; description: string; timeFrame: string }[];
  references: { pmid: string; type: string }[];
}
export interface PaginatedTrials {
  studies: TrialSummary[];
  nextPageToken?: string;
  totalCount?: number;
}
export interface PubMedCitation {
  pmid: string;
  title: string;
  journal: string;
  date: string;
  authors: string[];
  source: "registry" | "identifier-search";
}
export interface ComparisonExport {
  trials: TrialDetail[];
  generatedAt: string;
  source: string;
}
