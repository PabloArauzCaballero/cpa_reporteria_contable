import type { MovimientoContable, ReportTotals } from '../types';
import { roundMoney } from './accountingMath';

export function buildReportTotals(movimientosPeriodo: MovimientoContable[]): ReportTotals {
  const totalDebe = roundMoney(movimientosPeriodo.reduce((total, movement) => total + movement.debe, 0));
  const totalHaber = roundMoney(movimientosPeriodo.reduce((total, movement) => total + movement.haber, 0));
  const transactionIds = new Set(movimientosPeriodo.map((movement) => movement.idTransaccion));

  return {
    totalDebe,
    totalHaber,
    diferencia: roundMoney(totalDebe - totalHaber),
    totalTransacciones: transactionIds.size,
    totalMovimientos: movimientosPeriodo.length,
  };
}
