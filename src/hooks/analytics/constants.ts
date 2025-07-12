import type { AnalyticsFilters } from './types';

// Helper function to get date from N days ago
const getDateDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const DEFAULT_FILTERS: AnalyticsFilters = {
  startDate: getDateDaysAgo(30), // Default to past 30 days
  endDate: new Date(),
  documentType: null,
  institutionId: null,
};

// Common filter presets that can be reused
export const FILTER_PRESETS = {
  LAST_7_DAYS: {
    startDate: getDateDaysAgo(7),
    endDate: new Date(),
    label: 'Last 7 days',
  },
  LAST_30_DAYS: {
    startDate: getDateDaysAgo(30),
    endDate: new Date(),
    label: 'Last 30 days',
  },
  THIS_MONTH: {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
    label: 'This month',
  },
  LAST_MONTH: {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    label: 'Last month',
  },
};
