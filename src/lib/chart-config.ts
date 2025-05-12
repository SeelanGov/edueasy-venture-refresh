
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
  
  // Extended chart colors with semantic meaning
  positive: "var(--color-success)",
  negative: "var(--color-error)",
  neutral1: "var(--chart-neutral)",
  neutral2: "hsl(225, 10%, 75%)",
  highlight: "var(--color-info)",
  accent1: "var(--chart-primary)",
  accent2: "var(--chart-secondary)",
};

// Status configuration with labels and colors
export const STATUS_CONFIG = {
  approved: { label: "Approved", color: CHART_COLORS.approved },
  rejected: { label: "Rejected", color: CHART_COLORS.rejected },
  pending: { label: "Pending", color: CHART_COLORS.pending },
  request_resubmission: { label: "Resubmission", color: CHART_COLORS.request_resubmission },
};

/**
 * Format camelCase or PascalCase string to readable text
 * e.g. "documentType" → "Document Type"
 */
export const formatDisplayName = (name: string): string => {
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

/**
 * Get color based on value comparison
 * Useful for delta indicators, trend analysis, etc.
 */
export const getComparisonColor = (value: number): string => {
  if (value > 0) return CHART_COLORS.positive;
  if (value < 0) return CHART_COLORS.negative;
  return CHART_COLORS.neutral;
};

/**
 * Interpolate color between two values based on percentage
 * Useful for gradient-based visualizations
 * Example: interpolateColor(0, 100, 50) will return color halfway between min and max
 */
export const interpolateColor = (
  min: number,
  max: number,
  value: number,
  minColor: string = CHART_COLORS.negative,
  maxColor: string = CHART_COLORS.positive
): string => {
  // Simple placeholder implementation - would need proper HSL interpolation in real code
  const percentage = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return `color-mix(in hsl, ${minColor} ${(1 - percentage) * 100}%, ${maxColor})`;
};
