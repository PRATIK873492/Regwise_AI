import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import {
  User,
  ComplianceSummary,
  OnboardingWorkflow,
  Alert,
  SearchResult,
  DashboardMetrics,
} from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Mock response for demo purposes
      if (email && password) {
        return {
          user: {
            id: '1',
            email: email,
            name: email.split('@')[0],
            role: 'admin',
          },
          token: 'mock-jwt-token-12345',
        };
      }
      throw new Error('Invalid credentials');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};

// Compliance Explorer API
export const complianceAPI = {
  search: async (country: string, query: string): Promise<SearchResult> => {
    try {
      const response = await api.post('/search', { country, query });
      return response.data;
    } catch (error) {
      // Mock response for demo
      return {
        query,
        country,
        summary: `Based on ${country}'s regulatory framework, ${query.toLowerCase()} requires compliance with several key regulations including AML/CTF requirements, data protection laws, and financial services licensing. Organizations must implement robust KYC procedures, maintain transaction monitoring systems, and report suspicious activities to relevant authorities.`,
        citations: [
          {
            id: '1',
            title: 'Anti-Money Laundering Act 2024',
            url: 'https://example.com/aml-act',
            source: 'Government Portal',
            date: '2024-01-15',
          },
          {
            id: '2',
            title: 'Financial Services Regulations',
            url: 'https://example.com/fin-regs',
            source: 'Regulatory Authority',
            date: '2023-11-20',
          },
          {
            id: '3',
            title: 'Data Protection Guidelines',
            url: 'https://example.com/data-protection',
            source: 'Data Commissioner',
            date: '2024-03-01',
          },
        ],
        relatedTopics: ['KYC Requirements', 'Transaction Monitoring', 'Risk Assessment', 'Customer Due Diligence'],
      };
    }
  },

  getSummaries: async (country: string): Promise<ComplianceSummary[]> => {
    try {
      const response = await api.get(`/country/${country}/summaries`);
      return response.data;
    } catch (error) {
      // Mock response
      return [
        {
          id: '1',
          country,
          category: 'AML/CTF',
          title: 'Anti-Money Laundering Requirements',
          summary: 'Comprehensive AML framework requiring risk-based approach to customer due diligence, transaction monitoring, and suspicious activity reporting.',
          citations: [
            {
              id: '1',
              title: 'AML Act 2024',
              url: 'https://example.com',
              source: 'Government',
              date: '2024-01-15',
            },
          ],
          lastUpdated: '2024-11-15',
          riskLevel: 'high',
        },
        {
          id: '2',
          country,
          category: 'Data Protection',
          title: 'Personal Data Processing Rules',
          summary: 'Strict data protection requirements including consent management, data minimization, and breach notification obligations.',
          citations: [
            {
              id: '2',
              title: 'Data Protection Regulation',
              url: 'https://example.com',
              source: 'Data Authority',
              date: '2024-02-20',
            },
          ],
          lastUpdated: '2024-10-30',
          riskLevel: 'medium',
        },
        {
          id: '3',
          country,
          category: 'Licensing',
          title: 'Financial Services Licensing',
          summary: 'All financial service providers must obtain appropriate licensing and meet ongoing capital and compliance requirements.',
          citations: [
            {
              id: '3',
              title: 'Financial Services Act',
              url: 'https://example.com',
              source: 'Financial Regulator',
              date: '2023-12-10',
            },
          ],
          lastUpdated: '2024-09-05',
          riskLevel: 'high',
        },
      ];
    }
  },
};

// Onboarding API
export const onboardingAPI = {
  getWorkflow: async (country: string): Promise<OnboardingWorkflow> => {
    try {
      const response = await api.get(`/country/${country}/onboarding`);
      return response.data;
    } catch (error) {
      // Mock response
      return {
        country,
        estimatedTime: '15-20 minutes',
        complianceLevel: 'Standard',
        steps: [
          {
            id: '1',
            stepNumber: 1,
            title: 'Personal Information Collection',
            description: 'Collect basic personal information from the customer',
            required: true,
            documents: ['Full Legal Name', 'Date of Birth', 'Nationality', 'Residential Address'],
          },
          {
            id: '2',
            stepNumber: 2,
            title: 'Identity Verification',
            description: 'Verify customer identity using government-issued documents',
            required: true,
            documents: ['Government ID (Passport/Drivers License)', 'Proof of Address (Utility Bill)'],
            threshold: 'All customers',
          },
          {
            id: '3',
            stepNumber: 3,
            title: 'Source of Funds Declaration',
            description: 'Understand the source of customer funds',
            required: true,
            documents: ['Employment Letter', 'Bank Statements (Last 3 months)', 'Tax Returns'],
            threshold: 'Transactions > $10,000',
            conditions: ['High-risk jurisdictions', 'PEP status', 'Large transactions'],
          },
          {
            id: '4',
            stepNumber: 4,
            title: 'Risk Assessment',
            description: 'Conduct customer risk assessment based on profile',
            required: true,
            documents: ['Risk Assessment Form', 'Enhanced Due Diligence (if high-risk)'],
            conditions: ['Based on risk scoring model'],
          },
          {
            id: '5',
            stepNumber: 5,
            title: 'Biometric Verification',
            description: 'Complete biometric verification for enhanced security',
            required: false,
            documents: ['Liveness Check', 'Facial Recognition'],
            threshold: 'Transactions > $50,000',
          },
          {
            id: '6',
            stepNumber: 6,
            title: 'Final Approval',
            description: 'Review and approve customer onboarding',
            required: true,
            documents: ['Compliance Officer Sign-off', 'Terms & Conditions Acceptance'],
          },
        ],
      };
    }
  },

  exportWorkflow: async (country: string, format: 'pdf' | 'json'): Promise<Blob> => {
    try {
      const response = await api.get(`/country/${country}/onboarding/export`, {
        params: { format },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error('Export failed');
    }
  },
};

// Alerts API
export const alertsAPI = {
  getAlerts: async (country?: string): Promise<Alert[]> => {
    try {
      const response = await api.get('/alerts', { params: { country } });
      return response.data;
    } catch (error) {
      // Mock response
      return [
        {
          id: '1',
          country: 'United States',
          title: 'New AML Reporting Requirements Effective Q1 2025',
          description: 'FinCEN announces enhanced beneficial ownership reporting requirements for financial institutions.',
          severity: 'high',
          date: '2024-11-20',
          isRead: false,
          sourceUrl: 'https://example.com/alert1',
        },
        {
          id: '2',
          country: 'European Union',
          title: 'GDPR Amendment: Cookie Consent Updates',
          description: 'New guidelines on cookie consent mechanisms requiring explicit user interaction.',
          severity: 'medium',
          date: '2024-11-18',
          isRead: false,
          sourceUrl: 'https://example.com/alert2',
        },
        {
          id: '3',
          country: 'United Kingdom',
          title: 'FCA Publishes Updated Crypto Asset Guidelines',
          description: 'Financial Conduct Authority releases comprehensive framework for crypto asset regulation.',
          severity: 'high',
          date: '2024-11-15',
          isRead: true,
          sourceUrl: 'https://example.com/alert3',
        },
        {
          id: '4',
          country: 'Singapore',
          title: 'MAS Implements Real-time Payment Fraud Monitoring',
          description: 'Mandatory fraud surveillance for all payment service providers by Dec 2024.',
          severity: 'critical',
          date: '2024-11-10',
          isRead: false,
          sourceUrl: 'https://example.com/alert4',
        },
        {
          id: '5',
          country: 'Australia',
          title: 'AUSTRAC Updates Transaction Reporting Thresholds',
          description: 'Minor adjustments to international funds transfer reporting requirements.',
          severity: 'low',
          date: '2024-11-05',
          isRead: true,
          sourceUrl: 'https://example.com/alert5',
        },
      ];
    }
  },

  markAsRead: async (alertId: string): Promise<void> => {
    try {
      await api.patch(`/alerts/${alertId}/read`);
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const response = await api.get('/dashboard/metrics');
      return response.data;
    } catch (error) {
      // Mock response
      return {
        totalCountries: 10,
        activeAlerts: 12,
        complianceScore: 87,
        lastUpdated: new Date().toISOString(),
        riskBreakdown: {
          low: 45,
          medium: 35,
          high: 20,
        },
        recentActivity: [
          {
            id: '1',
            type: 'search',
            description: 'Searched compliance requirements for United States',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            country: 'United States',
          },
          {
            id: '2',
            type: 'alert',
            description: 'New regulatory alert for Singapore',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            country: 'Singapore',
          },
          {
            id: '3',
            type: 'update',
            description: 'Onboarding workflow updated for Germany',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            country: 'Germany',
          },
        ],
      };
    }
  },
};

export default api;
