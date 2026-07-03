import type { LibroDiarioTransaccion, MovimientoContable } from '../types';
import { isAlmostZero, roundMoney, sumMoney } from './accountingMath';
import { sortMovements } from './movementFilters';

export function buildLibroDiario(movimientos: MovimientoContable[]): LibroDiarioTransaccion[] {
  const transactions = new Map<number, MovimientoContable[]>();

  for (const movement of [...movimientos].sort(sortMovements)) {
    const existing = transactions.get(movement.idTransaccion) ?? [];
    existing.push(movement);
    transactions.set(movement.idTransaccion, existing);
  }

  return Array.from(transactions.entries()).map(([idTransaccion, rows]) => {
    const first = rows[0];
    const totalDebe = sumMoney(rows.map((row) => row.debe));
    const totalHaber = sumMoney(rows.map((row) => row.haber));
    const diferencia = roundMoney(totalDebe - totalHaber);

    return {
      idTransaccion,
      fechaTransaccion: first?.fechaTransaccion ?? '',
      tipoTransaccion: first?.tipoTransaccion ?? '',
      subTipoTransaccion: first?.subTipoTransaccion ?? '',
      glosa: first?.glosa ?? '',
      movimientos: rows,
      totalDebe,
      totalHaber,
      diferencia,
      cuadrada: isAlmostZero(diferencia),
    };
  });
}
