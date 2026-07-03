import type { EstadoResultadosGrupo, EstadoResultadosResumen, MovimientoContable } from '../types';
import { roundMoney, sumMoney } from './accountingMath';

function resolveStatementGroupKey(movement: MovimientoContable): string {
  return `${movement.codigoGrupoCuenta || 'SIN_CODIGO'}__${movement.nombreGrupoCuenta || movement.subGrupo || 'Sin grupo'}`;
}

function addToStatementGroup(groups: Map<string, EstadoResultadosGrupo>, movement: MovimientoContable): void {
  const groupKey = resolveStatementGroupKey(movement);
  const accountKey = `${movement.codigoCuenta}__${movement.nombreCuenta}`;
  const group = groups.get(groupKey) ?? {
    codigoGrupoCuenta: movement.codigoGrupoCuenta,
    nombre: movement.nombreGrupoCuenta || movement.subGrupo || 'Sin grupo',
    subGrupo: movement.subGrupo,
    ordenReporte: movement.ordenReporte,
    total: 0,
    cuentas: [],
  };
  const existingAccount = group.cuentas.find((account) => `${account.codigoCuenta}__${account.nombreCuenta}` === accountKey);

  if (existingAccount) {
    existingAccount.total = roundMoney(existingAccount.total + movement.saldoNatural);
  } else {
    group.cuentas.push({
      codigoCuenta: movement.codigoCuenta,
      nombreCuenta: movement.nombreCuenta,
      total: movement.saldoNatural,
    });
  }

  group.total = roundMoney(group.total + movement.saldoNatural);
  group.cuentas.sort((a, b) => a.codigoCuenta.localeCompare(b.codigoCuenta, 'es'));
  groups.set(groupKey, group);
}

function sortStatementGroups(groups: Map<string, EstadoResultadosGrupo>): EstadoResultadosGrupo[] {
  return Array.from(groups.values()).sort((a, b) => {
    if (a.ordenReporte !== b.ordenReporte) return a.ordenReporte - b.ordenReporte;
    return a.nombre.localeCompare(b.nombre, 'es');
  });
}

export function buildEstadoResultados(movimientos: MovimientoContable[]): EstadoResultadosResumen {
  const incomeGroups = new Map<string, EstadoResultadosGrupo>();
  const expenseGroups = new Map<string, EstadoResultadosGrupo>();

  for (const movement of movimientos) {
    if (movement.subTipo === 'INGRESO') addToStatementGroup(incomeGroups, movement);
    if (movement.subTipo === 'GASTO') addToStatementGroup(expenseGroups, movement);
  }

  const ingresos = sortStatementGroups(incomeGroups);
  const gastos = sortStatementGroups(expenseGroups);
  const totalIngresos = sumMoney(ingresos.map((group) => group.total));
  const totalGastos = sumMoney(gastos.map((group) => group.total));

  return {
    ingresos,
    gastos,
    totalIngresos,
    totalGastos,
    resultadoPeriodo: roundMoney(totalIngresos - totalGastos),
  };
}
