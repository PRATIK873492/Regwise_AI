// Core Types for RegWise AI

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Country {
  id: string;
  code: string;
  name: string;
  region: string;
}

export interface ComplianceSummary {
  id: string;
  country: string;
  category: string;
  title: string;
  summary: string;
  citations: Citation[];
  lastUpdated: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  source: string;
  date: string;
}

export interface OnboardingStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  required: boolean;
  documents: string[];
  threshold?: string;
  conditions?: string[];
}

export interface OnboardingWorkflow {
  country: string;
  steps: OnboardingStep[];
  estimatedTime: string;
  complianceLevel: string;
}

export interface Alert {
  id: string;
  country: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  isRead: boolean;
  sourceUrl?: string;
}

export interface SearchResult {
  query: string;
  country: string;
  summary: string;
  citations: Citation[];
  relatedTopics: string[];
}

export interface DashboardMetrics {
  totalCountries: number;
  activeAlerts: number;
  complianceScore: number;
  lastUpdated: string;
  riskBreakdown: {
    low: number;
    medium: number;
    high: number;
  };
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'search' | 'alert' | 'update';
  description: string;
  timestamp: string;
  country?: string;
}
