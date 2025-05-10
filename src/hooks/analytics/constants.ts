
import { AnalyticsFilters } from "./types";

export const DEFAULT_FILTERS: AnalyticsFilters = {
  startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
  endDate: new Date(),
  documentType: null,
  institutionId: null,
};
