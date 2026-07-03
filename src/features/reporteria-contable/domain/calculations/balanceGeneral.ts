import type { BalanceGeneralResumen, BalanceLinea, MovimientoContable } from '../types';
import { isAlmostZero, roundMoney, sumMoney } from './accountingMath';
import { normalizeText } from './movementFilters';
import { buildEstadoResultados } from './estadoResultados';

function balanceSubGroupOrder(subGrupo: string): number {
  const normalized = normalizeText(subGrupo).replace(/[\s-]+/g, '_');
  if (normalized.includes('no_corriente') || normalized.includes('nocorriente')) return 2;
  if (normalized.includes('corriente')) return 1;
  return 9;
}

function compareBalanceLines(left: BalanceLinea, right: BalanceLinea): number {
  const bySubGroup = balanceSubGroupOrder(left.subGrupo) - balanceSubGroupOrder(right.subGrupo);
  if (bySubGroup !== 0) return bySubGroup;

  if (left.ordenReporte !== right.ordenReporte) return left.ordenReporte - right.ordenReporte;
  return left.codigoCuenta.localeCompare(right.codigoCuenta, 'es', { numeric: true });
}

function buildBalanceLines(movimientos: MovimientoContable[], subTipo: string): BalanceLinea[] {
  const byAccount = new Map<string, BalanceLinea>();

  for (const movement of movimientos.filter((item) => item.subTipo === subTipo)) {
    const key = `${movement.codigoCuenta}__${movement.nombreCuenta}`;
    const existing = byAccount.get(key) ?? {
      codigoCuenta: movement.codigoCuenta,
      nombreCuenta: movement.nombreCuenta,
      codigoGrupoCuenta: movement.codigoGrupoCuenta,
      nombreGrupoCuenta: movement.nombreGrupoCuenta || subTipo,
      subGrupo: movement.subGrupo,
      ordenReporte: movement.ordenReporte,
      grupo: movement.nombreGrupoCuenta || movement.subGrupo || subTipo,
      total: 0,
    };

    existing.total = roundMoney(existing.total + movement.saldoNatural);
    byAccount.set(key, existing);
  }

  return Array.from(byAccount.values())
    .filter((line) => !isAlmostZero(line.total))
    .sort(compareBalanceLines);
}

export function buildBalanceGeneral(movimientosAcumulados: MovimientoContable[]): BalanceGeneralResumen {
  const estadoResultados = buildEstadoResultados(movimientosAcumulados);
  const activos = buildBalanceLines(movimientosAcumulados, 'ACTIVO');
  const pasivos = buildBalanceLines(movimientosAcumulados, 'PASIVO');
  const patrimonio = buildBalanceLines(movimientosAcumulados, 'PATRIMONIO');

  const totalActivo = sumMoney(activos.map((line) => line.total));
  const totalPasivo = sumMoney(pasivos.map((line) => line.total));
  const totalPatrimonioBase = sumMoney(patrimonio.map((line) => line.total));
  const totalPatrimonio = roundMoney(totalPatrimonioBase + estadoResultados.resultadoPeriodo);
  const totalPasivoPatrimonio = roundMoney(totalPasivo + totalPatrimonio);
  const diferencia = roundMoney(totalActivo - totalPasivoPatrimonio);

  return {
    activos,
    pasivos,
    patrimonio,
    resultadoPeriodo: estadoResultados.resultadoPeriodo,
    totalActivo,
    totalPasivo,
    totalPatrimonio,
    totalPasivoPatrimonio,
    diferencia,
    cuadrado: isAlmostZero(diferencia),
  };
}
