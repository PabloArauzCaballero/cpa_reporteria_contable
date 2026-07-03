import type { MovimientoContable } from './types';

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface ReportFilterOptions {
  anios: FilterSelectOption[];
  meses: FilterSelectOption[];
  tiposTransaccion: FilterSelectOption[];
  subTiposTransaccion: FilterSelectOption[];
  cuentas: FilterSelectOption[];
  nombresCuenta: FilterSelectOption[];
  idsCuenta: FilterSelectOption[];
  gruposCuenta: FilterSelectOption[];
  nombresGrupoCuenta: FilterSelectOption[];
  idsGrupoCuenta: FilterSelectOption[];
  tiposReporte: FilterSelectOption[];
  subGrupos: FilterSelectOption[];
  naturalezasSaldo: FilterSelectOption[];
  transacciones: FilterSelectOption[];
  movimientos: FilterSelectOption[];
}

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function uniqueOptions(values: string[]): FilterSelectOption[] {
  return Array.from(new Set(values.filter((value) => value.trim()).map((value) => value.trim())))
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
    .map((value) => ({ value, label: value }));
}

function accountCodeOptions(movimientos: MovimientoContable[]): FilterSelectOption[] {
  const byCode = new Map<string, string>();
  for (const movement of movimientos) {
    if (!movement.codigoCuenta) continue;
    byCode.set(movement.codigoCuenta, `${movement.codigoCuenta} · ${movement.nombreCuenta}`);
  }
  return Array.from(byCode.entries())
    .sort(([left], [right]) => left.localeCompare(right, 'es', { numeric: true }))
    .map(([value, label]) => ({ value, label }));
}

function accountNameOptions(movimientos: MovimientoContable[]): FilterSelectOption[] {
  const byName = new Map<string, string>();
  for (const movement of movimientos) {
    if (!movement.nombreCuenta) continue;
    byName.set(movement.nombreCuenta, `${movement.nombreCuenta} · ${movement.codigoCuenta}`);
  }
  return Array.from(byName.entries())
    .sort(([left], [right]) => left.localeCompare(right, 'es', { numeric: true }))
    .map(([value, label]) => ({ value, label }));
}

function accountIdOptions(movimientos: MovimientoContable[]): FilterSelectOption[] {
  const byId = new Map<string, string>();
  for (const movement of movimientos) {
    if (!movement.idCuenta) continue;
    byId.set(String(movement.idCuenta), `${movement.idCuenta} · ${movement.codigoCuenta} · ${movement.nombreCuenta}`);
  }
  return Array.from(byId.entries())
    .sort(([left], [right]) => left.localeCompare(right, 'es', { numeric: true }))
    .map(([value, label]) => ({ value, label }));
}

function groupCodeOptions(movimientos: MovimientoContable[]): FilterSelectOption[] {
  const byCode = new Map<string, string>();
  for (const movement of movimientos) {
    const code = movement.codigoGrupoCuenta || movement.nombreGrupoCuenta;
    if (!code) continue;
    byCode.set(code, `${code} · ${movement.nombreGrupoCuenta || 'Sin nombre'}`);
  }
  return Array.from(byCode.entries())
    .sort(([left], [right]) => left.localeCompare(right, 'es', { numeric: true }))
    .map(([value, label]) => ({ value, label }));
}

function groupNameOptions(movimientos: MovimientoContable[]): FilterSelectOption[] {
  return uniqueOptions(movimientos.map((movement) => movement.nombreGrupoCuenta));
}

function groupIdOptions(movimientos: MovimientoContable[]): FilterSelectOption[] {
  const byId = new Map<string, string>();
  for (const movement of movimientos) {
    if (!movement.idGrupoCuenta) continue;
    byId.set(String(movement.idGrupoCuenta), `${movement.idGrupoCuenta} · ${movement.codigoGrupoCuenta} · ${movement.nombreGrupoCuenta}`);
  }
  return Array.from(byId.entries())
    .sort(([left], [right]) => left.localeCompare(right, 'es', { numeric: true }))
    .map(([value, label]) => ({ value, label }));
}

export function buildReportFilterOptions(movimientos: MovimientoContable[]): ReportFilterOptions {
  return {
    anios: uniqueOptions(movimientos.map((movement) => String(movement.anio))),
    meses: uniqueOptions(movimientos.map((movement) => String(movement.mes))).map((option) => ({
      value: option.value,
      label: monthNames[Number(option.value) - 1] ?? option.value,
    })),
    tiposTransaccion: uniqueOptions(movimientos.map((movement) => movement.tipoTransaccion)),
    subTiposTransaccion: uniqueOptions(movimientos.map((movement) => movement.subTipoTransaccion)),
    cuentas: accountCodeOptions(movimientos),
    nombresCuenta: accountNameOptions(movimientos),
    idsCuenta: accountIdOptions(movimientos),
    gruposCuenta: groupCodeOptions(movimientos),
    nombresGrupoCuenta: groupNameOptions(movimientos),
    idsGrupoCuenta: groupIdOptions(movimientos),
    tiposReporte: uniqueOptions(movimientos.map((movement) => movement.tipoReporte)),
    subGrupos: uniqueOptions(movimientos.map((movement) => movement.subGrupo)),
    naturalezasSaldo: uniqueOptions(movimientos.map((movement) => movement.naturalezaSaldo)),
    transacciones: uniqueOptions(movimientos.map((movement) => String(movement.idTransaccion))),
    movimientos: uniqueOptions(movimientos.map((movement) => String(movement.idMovimiento))),
  };
}
