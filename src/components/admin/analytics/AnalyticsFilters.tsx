import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type AnalyticsFilters as AnalyticsFiltersType  } from '@/hooks/analytics/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';




import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';







interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersType;
  onUpdateFilters: (filters: Partial<AnalyticsFiltersType>) => void;
  onResetFilters: () => void;
  documentTypes: string[];
  institutions: { id: string; name: string }[];
}

/**
 * AnalyticsFilters
 * @description Function
 */
export const AnalyticsFilters = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  documentTypes,
  institutions,
}: AnalyticsFiltersProps) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleStartDateSelect = (date: Date | undefined) => {
    onUpdateFilters({ startDate: date || null });
    setStartDateOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    onUpdateFilters({ endDate: date || null });
    setEndDateOpen(false);
  };

  const hasActiveFilters =
    filters.startDate || filters.endDate || filters.documentType || filters.institutionId;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="h-8 px-2 text-xs">
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-xs font-medium">
                Start Date
              </Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal text-xs',
                      !filters.startDate && 'text-muted-foreground',
                    )}
                    size="sm">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {filters.startDate ? (
                      format(filters.startDate, 'MMM dd, yyyy')
                    ) : (
                      <span>Pick start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate || undefined}
                    onSelect={handleStartDateSelect}
                    initialFocus
                    className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-xs font-medium">
                End Date
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal text-xs',
                      !filters.endDate && 'text-muted-foreground',
                    )}
                    size="sm">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {filters.endDate ? (
                      format(filters.endDate, 'MMM dd, yyyy')
                    ) : (
                      <span>Pick end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.endDate || undefined}
                    onSelect={handleEndDateSelect}
                    initialFocus
                    className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label htmlFor="document-type" className="text-xs font-medium">
                Document Type
              </Label>
              <Select
                value={filters.documentType || ''}
                onValueChange={(value) => onUpdateFilters({ documentType: value || null })}
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-xs">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <Label htmlFor="institution" className="text-xs font-medium">
                Institution
              </Label>
              <Select
                value={filters.institutionId || ''}
                onValueChange={(value) => onUpdateFilters({ institutionId: value || null })}
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="All Institutions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Institutions</SelectItem>
                  {institutions.map((institution) => (
                    <SelectItem key={institution.id} value={institution.id} className="text-xs">
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
