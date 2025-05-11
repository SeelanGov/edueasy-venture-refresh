
// Common chart configuration for consistent styling and colors across analytics
export const CHART_COLORS = {
  approved: "#16A34A",
  rejected: "#DC2626",
  pending: "#2563EB",
  request_resubmission: "#EAB308",
  count: "#7E69AB",
  primary: "#9b87f5",
  secondary: "#6E59A5",
  neutral: "#8E9196",
  lightGray: "#F1F0FB",
};

export const STATUS_CONFIG = {
  approved: { label: "Approved", color: CHART_COLORS.approved },
  rejected: { label: "Rejected", color: CHART_COLORS.rejected },
  pending: { label: "Pending", color: CHART_COLORS.pending },
  request_resubmission: { label: "Resubmission", color: CHART_COLORS.request_resubmission },
};

export const formatDisplayName = (name: string): string => {
  // Format camelCase or PascalCase to readable text (e.g. "documentType" → "Document Type")
  return name.replace(/([A-Z])/g, ' $1').trim();
};

export type ChartDataPoint = {
  [key: string]: string | number;
};

export interface StatusChartConfig {
  label: string;
  color: string;
}

export type StatusConfigType = Record<string, StatusChartConfig>;
