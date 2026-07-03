import { isInsideDateRange, isOnOrBefore } from './dateFilters';
import { filterMovimientosByReportFilters } from './reportCalculations';
import type { MovimientoContable, ReportFilters, ReportTab } from './types';

function isBeforeDate(value: string, reference: string): boolean {
  return value.slice(0, 10) < reference;
}

export function selectPeriodMovementsWithoutTextFilter(
  movimientos: MovimientoContable[],
  filters: Pick<ReportFilters, 'desde' | 'hasta'>,
): MovimientoContable[] {
  return movimientos.filter((movement) => isInsideDateRange(movement.fechaTransaccion, filters.desde, filters.hasta));
}

export function selectPeriodMovements(
  movimientosPeriodoSinFiltroTexto: MovimientoContable[],
  filters: ReportFilters,
): MovimientoContable[] {
  return filterMovimientosByReportFilters(movimientosPeriodoSinFiltroTexto, filters);
}

export function selectAccumulatedCutoffMovements(movimientos: MovimientoContable[], filters: ReportFilters): MovimientoContable[] {
  const movementsUntilCutoff = movimientos.filter((movement) => isOnOrBefore(movement.fechaTransaccion, filters.fechaCorte));
  return filterMovimientosByReportFilters(movementsUntilCutoff, filters);
}

export function selectMovementsBeforePeriod(
  movimientos: MovimientoContable[],
  filters: Pick<ReportFilters, 'desde'>,
): MovimientoContable[] {
  return movimientos.filter((movement) => isBeforeDate(movement.fechaTransaccion, filters.desde));
}

export function selectMovementsForActiveReport(
  activeTab: ReportTab,
  movimientosPeriodo: MovimientoContable[],
  movimientosAcumuladosCorte: MovimientoContable[],
): MovimientoContable[] {
  return activeTab === 'balance' ? movimientosAcumuladosCorte : movimientosPeriodo;
}
