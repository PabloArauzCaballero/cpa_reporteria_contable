import type { ReportFilters } from '../../domain/types';
import { accountTypeOptions } from './accountTypeOptions';
import { ToolbarField } from './ToolbarField';

interface AccountTypeSelectProps {
  value: string;
  onFilterChange: (name: keyof ReportFilters, value: string) => void;
}

export function AccountTypeSelect({ value, onFilterChange }: AccountTypeSelectProps) {
  return (
    <ToolbarField label="Clasificación" htmlFor="subTipo">
      <select id="subTipo" value={value} onChange={(event) => onFilterChange('subTipo', event.target.value)}>
        {accountTypeOptions.map((option) => (
          <option key={option.value || 'all'} value={option.value}>{option.label}</option>
        ))}
      </select>
    </ToolbarField>
  );
}
