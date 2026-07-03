import type { ReportFilters } from '../../domain/types';
import { ToolbarField } from './ToolbarField';

interface BalanceCutoffFieldProps {
  fechaCorte: string;
  onFilterChange: (name: keyof ReportFilters, value: string) => void;
}

export function BalanceCutoffField({ fechaCorte, onFilterChange }: BalanceCutoffFieldProps) {
  return (
    <ToolbarField label="Fecha de corte" htmlFor="fechaCorte">
      <input
        id="fechaCorte"
        type="date"
        value={fechaCorte}
        onChange={(event) => onFilterChange('fechaCorte', event.target.value)}
      />
    </ToolbarField>
  );
}
