export interface MovimientoContableDto {
  id_transaccion?: unknown;
  id_movimiento?: unknown;
  fecha_transaccion?: unknown;
  periodo_inicio?: unknown;
  periodo_fin?: unknown;
  anio?: unknown;
  mes?: unknown;
  tipo_transaccion?: unknown;
  sub_tipo_transaccion?: unknown;
  glosa?: unknown;
  id_cuenta?: unknown;
  codigo_cuenta?: unknown;
  nombre_cuenta?: unknown;
  id_grupo_cuenta?: unknown;
  codigo_grupo_cuenta?: unknown;
  nombre_grupo_cuenta?: unknown;
  tipo_reporte?: unknown;
  sub_tipo?: unknown;
  sub_grupo?: unknown;
  orden_reporte?: unknown;
  debe?: unknown;
  haber?: unknown;
  saldo_deudor?: unknown;
  saldo_natural?: unknown;
  naturaleza_saldo?: unknown;
}

export interface CuentaEfectivoMetadataDto {
  id_cuenta?: unknown;
  idCuenta?: unknown;
  codigo_cuenta?: unknown;
  codigoCuenta?: unknown;
  nombre_cuenta?: unknown;
  nombreCuenta?: unknown;
}

export interface ReporteriaContableMetadataDto {
  generado_en?: unknown;
  generadoEn?: unknown;
  origen?: unknown;
  desde?: unknown;
  hasta?: unknown;
  fecha_corte?: unknown;
  fechaCorte?: unknown;
  moneda?: unknown;
  cuenta_efectivo?: unknown;
  cuentaEfectivo?: unknown;
  cuentas_efectivo?: unknown;
  cuentasEfectivo?: unknown;
}
