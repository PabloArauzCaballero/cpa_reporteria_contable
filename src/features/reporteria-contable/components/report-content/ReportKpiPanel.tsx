import { StatCard } from '../../../../shared/components/StatCard';
import { formatMoney } from '../../domain/formatters';
import { MONEY_EPSILON } from '../../domain/calculations/accountingMath';
import type { ReportTotals } from '../../domain/types';

interface ReportKpiPanelProps {
  totals: ReportTotals;
}

export function ReportKpiPanel({ totals }: ReportKpiPanelProps) {
  return (
    <div className="stat-grid">
      <StatCard label="Total debe" value={formatMoney(totals.totalDebe)} />
      <StatCard label="Total haber" value={formatMoney(totals.totalHaber)} />
      <StatCard
        label="Diferencia"
        value={formatMoney(totals.diferencia)}
        tone={Math.abs(totals.diferencia) <= MONEY_EPSILON ? 'success' : 'danger'}
      />
      <StatCard
        label="Movimientos"
        value={String(totals.totalMovimientos)}
        helper={`${totals.totalTransacciones} transacciones`}
      />
    </div>
  );
}
