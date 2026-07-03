import type {
  BalanceGeneralResumen,
  EstadoResultadosResumen,
  FlujoCajaLinea,
  FlujoCajaResumen,
  LibroDiarioTransaccion,
  LibroMayorCuenta,
  MovimientoContable,
} from '../types';
import type { CsvRows } from './csvCore';

export function buildMovimientoRows(movimientos: MovimientoContable[]): CsvRows {
  return movimientos.map((movement) => [
    movement.fechaTransaccion,
    movement.idTransaccion,
    movement.idMovimiento,
    movement.tipoTransaccion,
    movement.glosa,
    movement.codigoCuenta,
    movement.nombreCuenta,
    movement.subTipo,
    movement.debe,
    movement.haber,
    movement.saldoNatural,
  ]);
}

export function buildLibroDiarioRows(libroDiario: LibroDiarioTransaccion[]): CsvRows {
  const rows: CsvRows = [[
    'fecha',
    'id_transaccion',
    'glosa',
    'codigo_cuenta',
    'nombre_cuenta',
    'sub_tipo',
    'debe',
    'haber',
    'diferencia_transaccion',
  ]];

  for (const transaction of libroDiario) {
    for (const movement of transaction.movimientos) {
      rows.push([
        transaction.fechaTransaccion,
        transaction.idTransaccion,
        transaction.glosa,
        movement.codigoCuenta,
        movement.nombreCuenta,
        movement.subTipo,
        movement.debe,
        movement.haber,
        transaction.diferencia,
      ]);
    }
  }

  return rows;
}

export function buildLibroMayorRows(libroMayor: LibroMayorCuenta[]): CsvRows {
  const rows: CsvRows = [[
    'codigo_cuenta',
    'nombre_cuenta',
    'fecha',
    'id_transaccion',
    'glosa',
    'debe',
    'haber',
    'saldo_movimiento',
    'saldo_acumulado',
  ]];

  for (const account of libroMayor) {
    for (const row of account.movimientos) {
      rows.push([
        account.codigoCuenta,
        account.nombreCuenta,
        row.movimiento.fechaTransaccion,
        row.movimiento.idTransaccion,
        row.movimiento.glosa,
        row.movimiento.debe,
        row.movimiento.haber,
        row.saldoMovimiento,
        row.saldoAcumulado,
      ]);
    }
  }

  return rows;
}

export function buildEstadoResultadosRows(resumen: EstadoResultadosResumen): CsvRows {
  const rows: CsvRows = [['seccion', 'grupo', 'codigo_cuenta', 'nombre_cuenta', 'total']];

  for (const group of resumen.ingresos) {
    for (const account of group.cuentas) rows.push(['INGRESOS', group.nombre, account.codigoCuenta, account.nombreCuenta, account.total]);
    rows.push(['TOTAL_INGRESOS_GRUPO', group.nombre, '', '', group.total]);
  }

  rows.push(['TOTAL_INGRESOS', '', '', '', resumen.totalIngresos]);

  for (const group of resumen.gastos) {
    for (const account of group.cuentas) rows.push(['GASTOS', group.nombre, account.codigoCuenta, account.nombreCuenta, account.total]);
    rows.push(['TOTAL_GASTOS_GRUPO', group.nombre, '', '', group.total]);
  }

  rows.push(['TOTAL_GASTOS', '', '', '', resumen.totalGastos]);
  rows.push(['RESULTADO_PERIODO', '', '', '', resumen.resultadoPeriodo]);
  return rows;
}

export function buildBalanceRows(resumen: BalanceGeneralResumen): CsvRows {
  const rows: CsvRows = [['seccion', 'grupo', 'codigo_cuenta', 'nombre_cuenta', 'total']];

  for (const line of resumen.activos) rows.push(['ACTIVO', line.grupo, line.codigoCuenta, line.nombreCuenta, line.total]);
  rows.push(['TOTAL_ACTIVO', '', '', '', resumen.totalActivo]);

  for (const line of resumen.pasivos) rows.push(['PASIVO', line.grupo, line.codigoCuenta, line.nombreCuenta, line.total]);
  rows.push(['TOTAL_PASIVO', '', '', '', resumen.totalPasivo]);

  for (const line of resumen.patrimonio) rows.push(['PATRIMONIO', line.grupo, line.codigoCuenta, line.nombreCuenta, line.total]);
  rows.push(['RESULTADO_ACUMULADO', '', '', '', resumen.resultadoPeriodo]);
  rows.push(['TOTAL_PATRIMONIO', '', '', '', resumen.totalPatrimonio]);
  rows.push(['TOTAL_PASIVO_PATRIMONIO', '', '', '', resumen.totalPasivoPatrimonio]);
  rows.push(['DIFERENCIA', '', '', '', resumen.diferencia]);
  return rows;
}

function appendCashLines(rows: CsvRows, section: string, lines: FlujoCajaLinea[]): void {
  for (const line of lines) rows.push([section, line.concepto, line.total]);
}

export function buildFlujoCajaRows(resumen: FlujoCajaResumen): CsvRows {
  const rows: CsvRows = [['seccion', 'concepto', 'total']];

  rows.push(['SALDO_INICIAL', 'Saldo inicial de efectivo', resumen.saldoInicial]);
  appendCashLines(rows, 'OPERACION', resumen.operacion);
  rows.push(['TOTAL_OPERACION', 'Flujo neto operación', resumen.totalOperacion]);
  appendCashLines(rows, 'INVERSION', resumen.inversion);
  rows.push(['TOTAL_INVERSION', 'Flujo neto inversión', resumen.totalInversion]);
  appendCashLines(rows, 'FINANCIAMIENTO', resumen.financiamiento);
  rows.push(['TOTAL_FINANCIAMIENTO', 'Flujo neto financiamiento', resumen.totalFinanciamiento]);
  appendCashLines(rows, 'SIN_CLASIFICAR', resumen.sinClasificar);
  rows.push(['INCREMENTO_NETO', 'Incremento neto de efectivo', resumen.incrementoNeto]);
  rows.push(['SALDO_FINAL', 'Saldo final de efectivo', resumen.saldoFinal]);
  return rows;
}
