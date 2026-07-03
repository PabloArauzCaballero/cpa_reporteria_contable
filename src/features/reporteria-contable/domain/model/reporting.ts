export type ReportTab = 'diario' | 'mayor' | 'resultados' | 'balance' | 'flujo';

export type CuentaSubTipo = 'ACTIVO' | 'PASIVO' | 'PATRIMONIO' | 'INGRESO' | 'GASTO' | 'SIN_CLASIFICAR' | string;

export type NaturalezaSaldo = 'DEUDOR' | 'ACREEDOR' | 'SIN_CLASIFICAR' | string;

export interface CuentaEfectivoMetadata {
  idCuenta: number;
  codigoCuenta: string;
  nombreCuenta: string;
}

export interface ReporteriaContableMetadata {
  generadoEn: string;
  origen: string;
  desde: string;
  hasta: string;
  fechaCorte: string;
  moneda: string;
  cuentaEfectivo: CuentaEfectivoMetadata | null;
  cuentasEfectivo: CuentaEfectivoMetadata[];
}

export interface ReporteriaContableContext {
  metadata: ReporteriaContableMetadata;
  movimientos: MovimientoContable[];
}

export interface MovimientoContable {
  idTransaccion: number;
  idMovimiento: number;
  fechaTransaccion: string;
  periodoInicio: string;
  periodoFin: string;
  anio: number;
  mes: number;
  tipoTransaccion: string;
  subTipoTransaccion: string;
  glosa: string;
  idCuenta: number;
  codigoCuenta: string;
  nombreCuenta: string;
  idGrupoCuenta: number;
  codigoGrupoCuenta: string;
  nombreGrupoCuenta: string;
  tipoReporte: string;
  subTipo: CuentaSubTipo;
  subGrupo: string;
  ordenReporte: number;
  debe: number;
  haber: number;
  saldoDeudor: number;
  saldoNatural: number;
  naturalezaSaldo: NaturalezaSaldo;
}

export interface ReportFilters {
  desde: string;
  hasta: string;
  fechaCorte: string;
  search: string;
  subTipo: string;
  tipoTransaccion: string;
  subTipoTransaccion: string;
  codigoCuenta: string;
  nombreCuenta: string;
  idCuenta: string;
  codigoGrupoCuenta: string;
  nombreGrupoCuenta: string;
  idGrupoCuenta: string;
  tipoReporte: string;
  subGrupo: string;
  naturalezaSaldo: string;
  anio: string;
  mes: string;
  idTransaccion: string;
  idMovimiento: string;
}

export interface ReportTotals {
  totalDebe: number;
  totalHaber: number;
  diferencia: number;
  totalTransacciones: number;
  totalMovimientos: number;
}

export type DiagnosticSeverity = 'ok' | 'warning' | 'danger';

export interface ReportDiagnostic {
  id: string;
  title: string;
  message: string;
  severity: DiagnosticSeverity;
  value?: string;
}

export interface AccountOption {
  codigoCuenta: string;
  nombreCuenta: string;
  subTipo: CuentaSubTipo;
  totalMovimientos: number;
  saldoNatural: number;
  isConfiguredAsCash: boolean;
}

export interface ReportMonthSummary {
  key: string;
  label: string;
  debe: number;
  haber: number;
  ingresos: number;
  gastos: number;
  saldoNatural: number;
}
