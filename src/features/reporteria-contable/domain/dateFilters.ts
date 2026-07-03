import type { MovimientoContable, ReportFilters } from './types';

export function toInputDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function createEmptySpecificFilters(): Omit<ReportFilters, 'desde' | 'hasta' | 'fechaCorte'> {
  return {
    search: '',
    subTipo: '',
    tipoTransaccion: '',
    subTipoTransaccion: '',
    codigoCuenta: '',
    nombreCuenta: '',
    idCuenta: '',
    codigoGrupoCuenta: '',
    nombreGrupoCuenta: '',
    idGrupoCuenta: '',
    tipoReporte: '',
    subGrupo: '',
    naturalezaSaldo: '',
    anio: '',
    mes: '',
    idTransaccion: '',
    idMovimiento: '',
  };
}

export function getDefaultReportFilters(): ReportFilters {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), 0, 1);
  return {
    desde: toInputDate(firstDay),
    hasta: toInputDate(today),
    fechaCorte: toInputDate(today),
    ...createEmptySpecificFilters(),
  };
}

export function isInsideDateRange(value: string, desde: string, hasta: string): boolean {
  const target = value.slice(0, 10);
  return target >= desde && target <= hasta;
}

export function isOnOrBefore(value: string, hasta: string): boolean {
  return value.slice(0, 10) <= hasta;
}

export function hasInvalidRange(filters: Pick<ReportFilters, 'desde' | 'hasta'>): boolean {
  return filters.desde > filters.hasta;
}

export function resolveMovementDateRange(movimientos: MovimientoContable[]): Pick<ReportFilters, 'desde' | 'hasta' | 'fechaCorte'> | null {
  const dates = movimientos
    .map((movement) => movement.fechaTransaccion.slice(0, 10))
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .sort();

  if (dates.length === 0) return null;

  const desde = dates[0];
  const hasta = dates[dates.length - 1];
  return { desde, hasta, fechaCorte: hasta };
}
