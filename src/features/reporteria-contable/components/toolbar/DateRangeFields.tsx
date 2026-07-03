import type { ReportFilters } from '../../domain/types';
import { ToolbarField } from './ToolbarField';

interface DateRangeFieldsProps {
  filters: ReportFilters;
  invalidRange: boolean;
  onFilterChange: (name: keyof ReportFilters, value: string) => void;
}

export function DateRangeFields({ filters, invalidRange, onFilterChange }: DateRangeFieldsProps) {
  return (
    <>
      <ToolbarField label="Desde" htmlFor="desde">
        <input
          id="desde"
          type="date"
          value={filters.desde}
          aria-invalid={invalidRange}
          onChange={(event) => onFilterChange('desde', event.target.value)}
        />
      </ToolbarField>
      <ToolbarField label="Hasta" htmlFor="hasta">
        <input
          id="hasta"
          type="date"
          value={filters.hasta}
          aria-invalid={invalidRange}
          onChange={(event) => onFilterChange('hasta', event.target.value)}
        />
      </ToolbarField>
    </>
  );
}
