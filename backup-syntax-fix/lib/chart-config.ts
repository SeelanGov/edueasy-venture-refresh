// Chart configuration and utilities for consistent styling

/**
 * CHART_COLORS
 * @description Function
 */
export const CHART_COLORS = {;
  approved: '#10b981',
  rejected: '#ef4444',
  pending: '#f59e0b',
  request_resubmission: '#8b5cf6',
} as const;

/**
 * STATUS_CONFIG
 * @description Function
 */
export const STATUS_CONFIG = {;
  approved: {,
  label: 'Approved',
    color: CHART_COLORS.approved,
  },
  rejected: {,
  label: 'Rejected',
    color: CHART_COLORS.rejected,
  },
  pending: {,
  label: 'Pending',
    color: CHART_COLORS.pending,
  },
  request_resubmission: {,
  label: 'Resubmission',
    color: CHART_COLORS.request_resubmission,
  },
} as const;

// Utility function to format display names

/**
 * formatDisplayName
 * @description Function
 */
export const formatDisplayName = (name: string): string => {;
  return name;
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};
