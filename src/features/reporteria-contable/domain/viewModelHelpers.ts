import { getDefaultReportFilters, isInsideDateRange, resolveMovementDateRange } from './dateFilters';
import { buildInitialReportTab } from './state/reportStateStorage';
import type { CuentaEfectivoMetadata, MovimientoContable, ReportFilters, ReportTab, ReporteriaContableMetadata } from './types';

const FALLBACK_TAB: ReportTab = 'diario';

export function readCashAccountsFromMetadata(metadata: ReporteriaContableMetadata | null): CuentaEfectivoMetadata[] {
  if (!metadata) return [];
  return metadata.cuentasEfectivo.length > 0
    ? metadata.cuentasEfectivo
    : metadata.cuentaEfectivo
      ? [metadata.cuentaEfectivo]
      : [];
}

export function buildFilterSignature(filters: ReportFilters): string {
  return JSON.stringify(filters);
}

function isDefaultDateRange(filters: ReportFilters): boolean {
  const defaults = getDefaultReportFilters();
  return filters.desde === defaults.desde
    && filters.hasta === defaults.hasta
    && filters.fechaCorte === defaults.fechaCorte;
}

export function shouldAutoAlignInitialDateRange(filters: ReportFilters, movimientos: MovimientoContable[]): boolean {
  if (!isDefaultDateRange(filters) || movimientos.length === 0) return false;
  return !movimientos.some((movement) => isInsideDateRange(movement.fechaTransaccion, filters.desde, filters.hasta));
}

export function buildAutoAlignedDateRange(filters: ReportFilters, movimientos: MovimientoContable[]): Partial<ReportFilters> | null {
  if (!shouldAutoAlignInitialDateRange(filters, movimientos)) return null;
  return resolveMovementDateRange(movimientos);
}

export function resolveInitialTab(allowedTabs: ReportTab[]): ReportTab {
  const storedTab = buildInitialReportTab();
  if (allowedTabs.includes(storedTab)) return storedTab;
  return allowedTabs[0] ?? FALLBACK_TAB;
}
