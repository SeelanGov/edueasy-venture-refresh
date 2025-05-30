import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnalyticsFilters as AnalyticsFiltersType } from '@/hooks/analytics/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersType;
  onUpdateFilters: (filters: Partial<AnalyticsFiltersType>) => void;
  onResetFilters: () => void;
  documentTypes: string[];
  institutions: { id: string; name: string }[];
}

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
    onUpdateFilters({
      startDate: date || null,
    });
    setStartDateOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    onUpdateFilters({
      endDate: date || null,
    });
    setEndDateOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="start-date">Start Date</Label>
        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !filters.startDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? (
                format(filters.startDate, 'PPP')
              ) : (
                <span>Pick a start date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.startDate || undefined}
              onSelect={handleStartDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="end-date">End Date</Label>
        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !filters.endDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? format(filters.endDate, 'PPP') : <span>Pick an end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.endDate || undefined}
              onSelect={handleEndDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="document-type">Document Type</Label>
        <Select
          value={filters.documentType || ''}
          onValueChange={(value) => onUpdateFilters({ documentType: value || null })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {documentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="institution">Institution</Label>
        <Select
          value={filters.institutionId || ''}
          onValueChange={(value) => onUpdateFilters({ institutionId: value || null })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Institutions" />
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
      </div>

      <div className="flex items-end">
        <Button onClick={onResetFilters} variant="outline">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
