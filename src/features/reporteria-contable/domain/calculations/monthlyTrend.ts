import type { MovimientoContable, ReportMonthSummary } from '../types';
import { roundMoney } from './accountingMath';

export function buildMonthlyTrend(movimientos: MovimientoContable[]): ReportMonthSummary[] {
  const byMonth = new Map<string, ReportMonthSummary>();

  for (const movement of movimientos) {
    const month = String(movement.mes).padStart(2, '0');
    const key = `${movement.anio}-${month}`;
    const existing = byMonth.get(key) ?? {
      key,
      label: `${month}/${movement.anio}`,
      debe: 0,
      haber: 0,
      ingresos: 0,
      gastos: 0,
      saldoNatural: 0,
    };

    existing.debe = roundMoney(existing.debe + movement.debe);
    existing.haber = roundMoney(existing.haber + movement.haber);
    existing.saldoNatural = roundMoney(existing.saldoNatural + movement.saldoNatural);
    if (movement.subTipo === 'INGRESO') existing.ingresos = roundMoney(existing.ingresos + movement.saldoNatural);
    if (movement.subTipo === 'GASTO') existing.gastos = roundMoney(existing.gastos + movement.saldoNatural);
    byMonth.set(key, existing);
  }

  return Array.from(byMonth.values()).sort((a, b) => a.key.localeCompare(b.key, 'es'));
}
