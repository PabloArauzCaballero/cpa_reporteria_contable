import { formatMoney } from '../domain/formatters';
import type { ReportMonthSummary } from '../domain/types';

interface MonthlyTrendPanelProps {
  months: ReportMonthSummary[];
}

function resolveMaxValue(months: ReportMonthSummary[]): number {
  const values = months.flatMap((month) => [month.debe, month.haber, month.ingresos, month.gastos]).map(Math.abs);
  const max = Math.max(...values, 0);
  return max > 0 ? max : 1;
}

function buildBarWidth(value: number, maxValue: number): string {
  return `${Math.max(4, Math.round((Math.abs(value) / maxValue) * 100))}%`;
}

export function MonthlyTrendPanel({ months }: MonthlyTrendPanelProps) {
  if (months.length <= 1) return null;

  const maxValue = resolveMaxValue(months);

  return (
    <section className="trend-panel" aria-label="Resumen mensual del periodo">
      <div className="section-heading section-heading--compact">
        <div>
          <h3>Lectura mensual</h3>
          <p>Resumen de debe, haber, ingresos y gastos por mes dentro del rango cargado.</p>
        </div>
      </div>

      <div className="trend-grid">
        {months.map((month) => (
          <article className="trend-card" key={month.key}>
            <strong>{month.label}</strong>
            <div className="trend-line">
              <span>Debe</span>
              <i style={{ width: buildBarWidth(month.debe, maxValue) }} />
              <b>{formatMoney(month.debe)}</b>
            </div>
            <div className="trend-line">
              <span>Haber</span>
              <i style={{ width: buildBarWidth(month.haber, maxValue) }} />
              <b>{formatMoney(month.haber)}</b>
            </div>
            <div className="trend-line">
              <span>Ingresos</span>
              <i style={{ width: buildBarWidth(month.ingresos, maxValue) }} />
              <b>{formatMoney(month.ingresos)}</b>
            </div>
            <div className="trend-line">
              <span>Gastos</span>
              <i style={{ width: buildBarWidth(month.gastos, maxValue) }} />
              <b>{formatMoney(month.gastos)}</b>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
