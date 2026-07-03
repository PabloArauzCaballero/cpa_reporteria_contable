import type { LibroMayorCuenta, MovimientoContable } from '../types';
import { roundMoney, sumMoney } from './accountingMath';
import { sortMovements } from './movementFilters';

export function buildLibroMayor(movimientos: MovimientoContable[]): LibroMayorCuenta[] {
  const byAccount = new Map<string, MovimientoContable[]>();

  for (const movement of [...movimientos].sort(sortMovements)) {
    const key = `${movement.codigoCuenta}__${movement.nombreCuenta}`;
    const existing = byAccount.get(key) ?? [];
    existing.push(movement);
    byAccount.set(key, existing);
  }

  return Array.from(byAccount.values())
    .map((rows) => {
      let accumulated = 0;
      const movements = rows.map((movement) => {
        accumulated = roundMoney(accumulated + movement.saldoNatural);
        return {
          movimiento: movement,
          saldoMovimiento: movement.saldoNatural,
          saldoAcumulado: accumulated,
        };
      });

      const first = rows[0];
      return {
        codigoCuenta: first?.codigoCuenta ?? '',
        nombreCuenta: first?.nombreCuenta ?? '',
        codigoGrupoCuenta: first?.codigoGrupoCuenta ?? '',
        nombreGrupoCuenta: first?.nombreGrupoCuenta ?? '',
        subGrupo: first?.subGrupo ?? '',
        ordenReporte: first?.ordenReporte ?? 0,
        naturalezaSaldo: first?.naturalezaSaldo ?? '',
        subTipo: first?.subTipo ?? '',
        movimientos: movements,
        totalDebe: sumMoney(rows.map((row) => row.debe)),
        totalHaber: sumMoney(rows.map((row) => row.haber)),
        saldoFinal: accumulated,
      };
    })
    .sort((a, b) => {
      if (a.ordenReporte !== b.ordenReporte) return a.ordenReporte - b.ordenReporte;
      return a.codigoCuenta.localeCompare(b.codigoCuenta, 'es');
    });
}
