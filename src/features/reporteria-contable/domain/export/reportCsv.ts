import type {
  BalanceGeneralResumen,
  EstadoResultadosResumen,
  FlujoCajaResumen,
  LibroDiarioTransaccion,
  LibroMayorCuenta,
  MovimientoContable,
  ReportTab,
} from '../types';
import { downloadCsv } from './csvCore';
import {
  buildBalanceRows,
  buildEstadoResultadosRows,
  buildFlujoCajaRows,
  buildLibroDiarioRows,
  buildLibroMayorRows,
  buildMovimientoRows,
} from './reportRows';

interface ReportExportPayload {
  activeTab: ReportTab;
  movimientosPeriodo: MovimientoContable[];
  libroDiario: LibroDiarioTransaccion[];
  libroMayor: LibroMayorCuenta[];
  estadoResultados: EstadoResultadosResumen;
  balanceGeneral: BalanceGeneralResumen;
  flujoCaja: FlujoCajaResumen;
}

function downloadFallbackMovements(movimientosPeriodo: MovimientoContable[]): void {
  const header = [
    'fecha',
    'id_transaccion',
    'id_movimiento',
    'tipo_transaccion',
    'glosa',
    'codigo_cuenta',
    'nombre_cuenta',
    'sub_tipo',
    'debe',
    'haber',
    'saldo_natural',
  ];

  downloadCsv('cpa-movimientos-contables.csv', [header, ...buildMovimientoRows(movimientosPeriodo)]);
}

export function downloadReportCsv(payload: ReportExportPayload): void {
  if (payload.activeTab === 'diario') {
    downloadCsv('cpa-libro-diario.csv', buildLibroDiarioRows(payload.libroDiario));
    return;
  }

  if (payload.activeTab === 'mayor') {
    downloadCsv('cpa-libro-mayor.csv', buildLibroMayorRows(payload.libroMayor));
    return;
  }

  if (payload.activeTab === 'resultados') {
    downloadCsv('cpa-estado-resultados.csv', buildEstadoResultadosRows(payload.estadoResultados));
    return;
  }

  if (payload.activeTab === 'balance') {
    downloadCsv('cpa-balance-general.csv', buildBalanceRows(payload.balanceGeneral));
    return;
  }

  if (payload.activeTab === 'flujo') {
    downloadCsv('cpa-flujo-caja.csv', buildFlujoCajaRows(payload.flujoCaja));
    return;
  }

  downloadFallbackMovements(payload.movimientosPeriodo);
}
