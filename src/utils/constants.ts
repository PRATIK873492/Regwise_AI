import { Country } from '../types';

export const COUNTRIES: Country[] = [
  { id: '1', code: 'US', name: 'United States', region: 'North America' },
  { id: '2', code: 'GB', name: 'United Kingdom', region: 'Europe' },
  { id: '3', code: 'DE', name: 'Germany', region: 'Europe' },
  { id: '4', code: 'FR', name: 'France', region: 'Europe' },
  { id: '5', code: 'SG', name: 'Singapore', region: 'Asia' },
  { id: '6', code: 'JP', name: 'Japan', region: 'Asia' },
  { id: '7', code: 'AU', name: 'Australia', region: 'Oceania' },
  { id: '8', code: 'CA', name: 'Canada', region: 'North America' },
  { id: '9', code: 'CH', name: 'Switzerland', region: 'Europe' },
  { id: '10', code: 'AE', name: 'United Arab Emirates', region: 'Middle East' },
];

export const API_BASE_URL = 'http://localhost:8000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EXPLORER: '/explorer',
  ONBOARDING: '/onboarding',
  ALERTS: '/alerts',
  DASHBOARD: '/dashboard',
};

export const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
};
