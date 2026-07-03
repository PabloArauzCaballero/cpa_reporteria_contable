import type { CuentaEfectivoMetadata, CuentaSubTipo, MovimientoContable, NaturalezaSaldo } from './reporting';

export interface LibroDiarioTransaccion {
  idTransaccion: number;
  fechaTransaccion: string;
  tipoTransaccion: string;
  subTipoTransaccion: string;
  glosa: string;
  movimientos: MovimientoContable[];
  totalDebe: number;
  totalHaber: number;
  diferencia: number;
  cuadrada: boolean;
}

export interface MovimientoMayorCuenta {
  movimiento: MovimientoContable;
  saldoMovimiento: number;
  saldoAcumulado: number;
}

export interface LibroMayorCuenta {
  codigoCuenta: string;
  nombreCuenta: string;
  codigoGrupoCuenta: string;
  nombreGrupoCuenta: string;
  subGrupo: string;
  ordenReporte: number;
  naturalezaSaldo: NaturalezaSaldo;
  subTipo: CuentaSubTipo;
  movimientos: MovimientoMayorCuenta[];
  totalDebe: number;
  totalHaber: number;
  saldoFinal: number;
}

export interface EstadoResultadosCuenta {
  codigoCuenta: string;
  nombreCuenta: string;
  total: number;
}

export interface EstadoResultadosGrupo {
  codigoGrupoCuenta: string;
  nombre: string;
  subGrupo: string;
  ordenReporte: number;
  total: number;
  cuentas: EstadoResultadosCuenta[];
}

export interface EstadoResultadosResumen {
  ingresos: EstadoResultadosGrupo[];
  gastos: EstadoResultadosGrupo[];
  totalIngresos: number;
  totalGastos: number;
  resultadoPeriodo: number;
}

export interface BalanceLinea {
  codigoCuenta: string;
  nombreCuenta: string;
  codigoGrupoCuenta: string;
  nombreGrupoCuenta: string;
  subGrupo: string;
  ordenReporte: number;
  grupo: string;
  total: number;
}

export interface BalanceGeneralResumen {
  activos: BalanceLinea[];
  pasivos: BalanceLinea[];
  patrimonio: BalanceLinea[];
  resultadoPeriodo: number;
  totalActivo: number;
  totalPasivo: number;
  totalPatrimonio: number;
  totalPasivoPatrimonio: number;
  diferencia: number;
  cuadrado: boolean;
}

export type FlujoCajaCategoria = 'OPERACION' | 'INVERSION' | 'FINANCIAMIENTO' | 'SIN_CLASIFICAR';

export interface FlujoCajaLinea {
  categoria: FlujoCajaCategoria;
  concepto: string;
  total: number;
}

export interface FlujoCajaResumen {
  requiereConfiguracion: boolean;
  cashAccountCodes: string[];
  cuentaEfectivoMetadata: CuentaEfectivoMetadata | null;
  cuentasEfectivoMetadata: CuentaEfectivoMetadata[];
  saldoInicial: number;
  operacion: FlujoCajaLinea[];
  inversion: FlujoCajaLinea[];
  financiamiento: FlujoCajaLinea[];
  sinClasificar: FlujoCajaLinea[];
  totalOperacion: number;
  totalInversion: number;
  totalFinanciamiento: number;
  totalSinClasificar: number;
  incrementoNeto: number;
  saldoFinal: number;
}
