import type { MovimientoContable, ReportFilters } from '../types';

export function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeClassification(value: string): string {
  return normalizeText(value).replace(/[\s-]+/g, '_').toUpperCase();
}

function normalizeExact(value: string | number): string {
  return normalizeText(String(value));
}

export function sortMovements(a: MovimientoContable, b: MovimientoContable): number {
  const byDate = a.fechaTransaccion.localeCompare(b.fechaTransaccion);
  if (byDate !== 0) return byDate;

  const byTransaction = a.idTransaccion - b.idTransaccion;
  if (byTransaction !== 0) return byTransaction;

  return a.idMovimiento - b.idMovimiento;
}

function movementMatchesSearch(movement: MovimientoContable, search: string): boolean {
  const normalizedSearch = normalizeText(search);
  if (!normalizedSearch) return true;

  const searchable = [
    movement.glosa,
    movement.tipoTransaccion,
    movement.subTipoTransaccion,
    movement.codigoCuenta,
    movement.nombreCuenta,
    movement.codigoGrupoCuenta,
    movement.nombreGrupoCuenta,
    movement.tipoReporte,
    movement.subTipo,
    movement.subGrupo,
    movement.naturalezaSaldo,
    String(movement.anio),
    String(movement.mes),
    String(movement.idCuenta),
    String(movement.idGrupoCuenta),
    String(movement.idTransaccion),
    String(movement.idMovimiento),
  ].join(' ');

  return normalizeText(searchable).includes(normalizedSearch);
}

function matchesOptionalText(actual: string, expected: string): boolean {
  return expected ? normalizeExact(actual) === normalizeExact(expected) : true;
}

function matchesOptionalNumber(actual: number, expected: string): boolean {
  return expected ? String(actual) === expected.trim() : true;
}

function movementMatchesAdvancedFilters(movement: MovimientoContable, filters: ReportFilters): boolean {
  const requestedSubTipo = normalizeClassification(filters.subTipo);
  const movementSubTipo = normalizeClassification(movement.subTipo);

  return (
    (!requestedSubTipo || movementSubTipo === requestedSubTipo)
    && matchesOptionalText(movement.tipoTransaccion, filters.tipoTransaccion)
    && matchesOptionalText(movement.subTipoTransaccion, filters.subTipoTransaccion)
    && matchesOptionalText(movement.codigoCuenta, filters.codigoCuenta)
    && matchesOptionalText(movement.nombreCuenta, filters.nombreCuenta)
    && matchesOptionalText(movement.codigoGrupoCuenta, filters.codigoGrupoCuenta)
    && matchesOptionalText(movement.nombreGrupoCuenta, filters.nombreGrupoCuenta)
    && matchesOptionalText(movement.tipoReporte, filters.tipoReporte)
    && matchesOptionalText(movement.subGrupo, filters.subGrupo)
    && matchesOptionalText(movement.naturalezaSaldo, filters.naturalezaSaldo)
    && matchesOptionalNumber(movement.anio, filters.anio)
    && matchesOptionalNumber(movement.mes, filters.mes)
    && matchesOptionalNumber(movement.idCuenta, filters.idCuenta)
    && matchesOptionalNumber(movement.idGrupoCuenta, filters.idGrupoCuenta)
    && matchesOptionalNumber(movement.idTransaccion, filters.idTransaccion)
    && matchesOptionalNumber(movement.idMovimiento, filters.idMovimiento)
  );
}

export function filterMovimientosBySearch(movimientos: MovimientoContable[], search: string): MovimientoContable[] {
  return movimientos.filter((movement) => movementMatchesSearch(movement, search));
}

export function filterMovimientosByReportFilters(movimientos: MovimientoContable[], filters: ReportFilters): MovimientoContable[] {
  return movimientos.filter((movement) => movementMatchesSearch(movement, filters.search) && movementMatchesAdvancedFilters(movement, filters));
}
