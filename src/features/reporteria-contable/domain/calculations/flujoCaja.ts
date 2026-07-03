import type {
  CuentaEfectivoMetadata,
  FlujoCajaCategoria,
  FlujoCajaLinea,
  FlujoCajaResumen,
  MovimientoContable,
} from '../types';
import { isAlmostZero, roundMoney, sumMoney } from './accountingMath';

function resolveCashEffect(movement: MovimientoContable): number {
  return roundMoney(movement.debe - movement.haber);
}

function classifyCashFlow(counterparts: MovimientoContable[]): FlujoCajaCategoria {
  if (counterparts.some((movement) => movement.subTipo === 'INGRESO' || movement.subTipo === 'GASTO')) return 'OPERACION';
  if (counterparts.some((movement) => movement.subTipo === 'ACTIVO')) return 'INVERSION';
  if (counterparts.some((movement) => movement.subTipo === 'PASIVO' || movement.subTipo === 'PATRIMONIO')) return 'FINANCIAMIENTO';
  return 'SIN_CLASIFICAR';
}

function addCashFlowLine(lines: Map<string, FlujoCajaLinea>, categoria: FlujoCajaCategoria, concepto: string, total: number): void {
  const key = `${categoria}__${concepto}`;
  const existing = lines.get(key) ?? { categoria, concepto, total: 0 };
  existing.total = roundMoney(existing.total + total);
  lines.set(key, existing);
}

function collectCategoryLines(lines: Map<string, FlujoCajaLinea>, categoria: FlujoCajaCategoria): FlujoCajaLinea[] {
  return Array.from(lines.values())
    .filter((line) => line.categoria === categoria && !isAlmostZero(line.total))
    .sort((a, b) => a.concepto.localeCompare(b.concepto, 'es'));
}

function groupMovementsByTransaction(movimientos: MovimientoContable[]): Map<number, MovimientoContable[]> {
  const byTransaction = new Map<number, MovimientoContable[]>();

  for (const movement of movimientos) {
    const existing = byTransaction.get(movement.idTransaccion) ?? [];
    existing.push(movement);
    byTransaction.set(movement.idTransaccion, existing);
  }

  return byTransaction;
}

function emptyCashFlow(
  cashAccountCodes: string[],
  cuentaEfectivoMetadata: CuentaEfectivoMetadata | null,
  cuentasEfectivoMetadata: CuentaEfectivoMetadata[],
): FlujoCajaResumen {
  return {
    requiereConfiguracion: true,
    cashAccountCodes,
    cuentaEfectivoMetadata,
    cuentasEfectivoMetadata,
    saldoInicial: 0,
    operacion: [],
    inversion: [],
    financiamiento: [],
    sinClasificar: [],
    totalOperacion: 0,
    totalInversion: 0,
    totalFinanciamiento: 0,
    totalSinClasificar: 0,
    incrementoNeto: 0,
    saldoFinal: 0,
  };
}

export function buildFlujoCaja(
  movimientosPeriodo: MovimientoContable[],
  movimientosAcumuladosAntesPeriodo: MovimientoContable[],
  cashAccountCodes: string[],
  cuentaEfectivoMetadata: CuentaEfectivoMetadata | null,
  cuentasEfectivoMetadata: CuentaEfectivoMetadata[],
): FlujoCajaResumen {
  if (cashAccountCodes.length === 0) return emptyCashFlow(cashAccountCodes, cuentaEfectivoMetadata, cuentasEfectivoMetadata);

  const cashCodes = new Set(cashAccountCodes);
  const saldoInicial = sumMoney(
    movimientosAcumuladosAntesPeriodo
      .filter((movement) => cashCodes.has(movement.codigoCuenta))
      .map(resolveCashEffect),
  );

  const lines = new Map<string, FlujoCajaLinea>();
  const movementsByTransaction = groupMovementsByTransaction(movimientosPeriodo);

  for (const rows of movementsByTransaction.values()) {
    const cashMovements = rows.filter((movement) => cashCodes.has(movement.codigoCuenta));
    if (cashMovements.length === 0) continue;

    const counterpartMovements = rows.filter((movement) => !cashCodes.has(movement.codigoCuenta));
    const category = classifyCashFlow(counterpartMovements);
    const cashEffect = sumMoney(cashMovements.map(resolveCashEffect));
    const concept = counterpartMovements[0]?.nombreCuenta || rows[0]?.glosa || 'Movimiento de efectivo';
    addCashFlowLine(lines, category, concept, cashEffect);
  }

  const operacion = collectCategoryLines(lines, 'OPERACION');
  const inversion = collectCategoryLines(lines, 'INVERSION');
  const financiamiento = collectCategoryLines(lines, 'FINANCIAMIENTO');
  const sinClasificar = collectCategoryLines(lines, 'SIN_CLASIFICAR');
  const totalOperacion = sumMoney(operacion.map((line) => line.total));
  const totalInversion = sumMoney(inversion.map((line) => line.total));
  const totalFinanciamiento = sumMoney(financiamiento.map((line) => line.total));
  const totalSinClasificar = sumMoney(sinClasificar.map((line) => line.total));
  const incrementoNeto = roundMoney(totalOperacion + totalInversion + totalFinanciamiento + totalSinClasificar);

  return {
    requiereConfiguracion: false,
    cashAccountCodes,
    cuentaEfectivoMetadata,
    cuentasEfectivoMetadata,
    saldoInicial,
    operacion,
    inversion,
    financiamiento,
    sinClasificar,
    totalOperacion,
    totalInversion,
    totalFinanciamiento,
    totalSinClasificar,
    incrementoNeto,
    saldoFinal: roundMoney(saldoInicial + incrementoNeto),
  };
}
