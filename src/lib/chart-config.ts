
// Common chart configuration for consistent styling and colors across analytics
export const CHART_COLORS = {
  approved: "var(--chart-approved)",
  rejected: "var(--chart-rejected)",
  pending: "var(--chart-pending)",
  request_resubmission: "var(--chart-request-resubmission)",
  count: "var(--chart-count)",
  primary: "var(--chart-primary)",
  secondary: "var(--chart-secondary)",
  neutral: "var(--chart-neutral)",
  lightGray: "var(--chart-light-gray)",
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

export type ChartConfig = Record<string, StatusChartConfig>;

export type StatusConfigType = Record<string, StatusChartConfig>;
