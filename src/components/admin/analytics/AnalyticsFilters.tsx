
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalyticsFilters } from "@/hooks/useDocumentAnalytics";
import { format } from "date-fns";

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilters;
  onUpdateFilters: (filters: Partial<AnalyticsFilters>) => void;
  onResetFilters: () => void;
  documentTypes: string[];
  institutions: { id: string; name: string }[];
}

export const AnalyticsFilterBar = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  documentTypes,
  institutions,
}: AnalyticsFilterBarProps) => {
  const [startDate, setStartDate] = useState<Date | null>(filters.startDate);
  const [endDate, setEndDate] = useState<Date | null>(filters.endDate);

  useEffect(() => {
    if (startDate && endDate) {
      onUpdateFilters({ startDate, endDate });
    }
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              {filters.startDate ? format(filters.startDate, "PP") : "Start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="single"
              selected={startDate || undefined}
              onSelect={setStartDate}
              disabled={(date) => endDate ? date > endDate : false}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              {filters.endDate ? format(filters.endDate, "PP") : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="single"
              selected={endDate || undefined}
              onSelect={setEndDate}
              disabled={(date) => startDate ? date < startDate : false}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Select
        value={filters.documentType || ""}
        onValueChange={(value) => onUpdateFilters({ documentType: value || null })}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Document Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Types</SelectItem>
          {documentTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type.replace(/([A-Z])/g, ' $1').trim()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.institutionId || ""}
        onValueChange={(value) => onUpdateFilters({ institutionId: value || null })}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Institution" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Institutions</SelectItem>
          {institutions.map((institution) => (
            <SelectItem key={institution.id} value={institution.id}>
              {institution.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" className="ml-auto" onClick={onResetFilters}>
        Reset Filters
      </Button>
    </div>
  );
};
