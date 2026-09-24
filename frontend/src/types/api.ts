import type { ComponentType } from 'react';

// Domain types shared across candidate + recruiter flows.
// Type-only module: no runtime code, safe to import anywhere.

export interface Job {
  id: number;
  title: string;
  description?: string;
  expected_outcomes?: string;
  specific_skills?: string;
  compliance_criteria?: string;
  department?: string;
  language?: string;
  location?: string;
  salary_range?: string;
  job_type?: string;
  max_questions?: number;
  archetype?: 'teknis' | 'lapangan' | 'kreatif' | string;
  kkm_score?: number;
  candidate_count?: number;
  status: 'open' | 'closed';
  deadline?: string | null;
  magic_link_token?: string | null;
  company_name?: string;
  created_at: string;
}

export interface ApiUser {
  id?: number;
  full_name?: string;
  email?: string;
  role?: string;
  profile?: { resume_url?: string | null } | null;
}

export interface AssessmentResultItem {
  overall_score?: number | null;
  ai_cheating_detected?: boolean;
  tab_switches?: number;
  copy_paste_attempts?: number;
  claim_vs_evidence_label?: string | null;
}

export interface AssessmentResultDetail extends AssessmentResultItem {
  score_problem_understanding?: number | null;
  score_solution_approach?: number | null;
  score_logic_execution?: number | null;
  score_communication?: number | null;
  score_response_quality?: number | null;
  candidate_answer?: string | null;
  keystroke_metrics?: string | null;
  replay_history?: string | null;
  evaluation_feedback?: string | null;
  interview_questions?: string | null;
}

export interface ApplicationSummary {
  id: number;
  job_id: number;
  user_id?: number;
  status: string;
  created_at?: string;
  job?: { title?: string } | null;
  user?: { full_name?: string; email?: string } | null;
  assessment_results?: AssessmentResultItem[];
}

export interface ApplicationDetail extends ApplicationSummary {
  resume_url?: string | null;
  resume_text?: string | null;
  resume_images?: string | null;
  assessment_results?: AssessmentResultDetail[];
  job?: { id?: number; title?: string } | null;
}

export interface CvAnalysis {
  summary?: string;
  cv_quality_score?: number | null;
  years_experience_estimate?: number | null;
  extracted_skills?: string[];
  notable_strengths?: string[];
  missing_evidence?: string[];
  red_flags?: string[];
  interview_focus_areas?: string[];
}

export interface Fingerprint {
  [dimension: string]: number;
}

export interface TeamApiItem {
  application_id?: number;
  candidate_name?: string;
  role?: string;
  fingerprint?: Fingerprint | null;
}

export interface ChatMessage {
  role: string;
  content: string;
  [key: string]: unknown;
}

export interface ReplayEntry {
  time: number;
  chat: ChatMessage[];
  input: string;
}

export type IconComponent = ComponentType<{ className?: string }>;

export interface ApiErrorShape {
  message?: string;
  response?: { data?: { detail?: string } };
}
