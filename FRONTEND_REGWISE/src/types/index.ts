// Core Types for RegWise AI

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "auditor"; // more explicit roles
  country?: string; // optional: user-specific country
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Country {
  id: string;
  code: string;
  name: string;
  region: string;
  currency?: string; // optional additional info
  population?: number;
  regulators?: string[];
  laws?: string[];
  workflow?: CountryWorkflow;
}

export interface ComplianceSummary {
  id: string;
  country: string;
  category: string;
  title: string;
  summary: string;
  citations: Citation[];
  lastUpdated: Date;
  riskLevel: "low" | "medium" | "high";
  relatedRegulations?: string[]; // optional links to other regulations
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  source: string;
  date: Date;
}

export interface OnboardingStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  required: boolean;
  documents?: string[]; // optional
  threshold?: string;
  conditions?: string[];
  estimatedTime?: string; // optional time per step
}

export interface OnboardingWorkflow {
  country: string;
  steps: OnboardingStep[];
  estimatedTime: string;
  complianceLevel: "basic" | "intermediate" | "advanced"; // more explicit levels
  lastUpdated?: Date;
}

export interface CountryWorkflow {
  kyc_steps: string[];
  documents: string[];
  aml_checks: string[];
  risk_scoring: string[];
  reporting: string[];
  ongoing_monitoring: string[];
}

export interface Alert {
  id: string;
  country: string;
  title: string;
  category?: string; // optional category for filtering
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  date: Date;
  isRead: boolean;
  sourceUrl?: string;
}

export interface SearchResult {
  query: string;
  country: string;
  category?: string;
  summary: string;
  citations: Citation[];
  relatedTopics: string[];
  timestamp?: Date;
}

export interface DashboardMetrics {
  totalCountries: number;
  activeAlerts: number;
  complianceScore: number; // percentage 0-100
  lastUpdated: Date;
  riskBreakdown: {
    low: number;
    medium: number;
    high: number;
  };
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "search" | "alert" | "update";
  description: string;
  timestamp: Date;
  country?: string;
  relatedId?: string; // optional, e.g., alert or search ID
}
