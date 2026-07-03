import type { ReportFilters } from '../../domain/types';
import type { FilterSelectOption } from '../../domain/reportFilterOptions';
import { ToolbarField } from './ToolbarField';

interface FilterSelectProps {
  label: string;
  name: keyof ReportFilters;
  value: string;
  options: FilterSelectOption[];
  placeholder?: string;
  onFilterChange: (name: keyof ReportFilters, value: string) => void;
}

export function FilterSelect({ label, name, value, options, placeholder = 'Todos', onFilterChange }: FilterSelectProps) {
  return (
    <ToolbarField label={label} htmlFor={name}>
      <select id={name} value={value} onChange={(event) => onFilterChange(name, event.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>{option.label}</option>
        ))}
      </select>
    </ToolbarField>
  );
}
