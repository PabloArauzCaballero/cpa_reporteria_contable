import type { ReportFilters } from '../../domain/types';
import { ToolbarField } from './ToolbarField';

interface SearchFieldProps {
  value: string;
  onFilterChange: (name: keyof ReportFilters, value: string) => void;
}

export function SearchField({ value, onFilterChange }: SearchFieldProps) {
  return (
    <ToolbarField label="Buscar" htmlFor="search">
      <input
        id="search"
        type="search"
        placeholder="Cuenta, glosa, grupo o tipo"
        value={value}
        onChange={(event) => onFilterChange('search', event.target.value)}
      />
    </ToolbarField>
  );
}
