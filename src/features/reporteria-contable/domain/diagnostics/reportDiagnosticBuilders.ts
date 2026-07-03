import type {
  BalanceGeneralResumen,
  FlujoCajaResumen,
  LibroDiarioTransaccion,
  MovimientoContable,
  ReportDiagnostic,
  ReportTab,
  ReporteriaContableMetadata,
} from '../types';
import { formatMoney } from '../formatters';

function resolveVisibleScopeLabel(activeTab: ReportTab): string {
  if (activeTab === 'balance') return 'a la fecha de corte';
  return 'para el periodo y filtros seleccionados';
}

export function buildNoDataDiagnostic(totalMovements: number, activeTab: ReportTab): ReportDiagnostic {
  if (totalMovements > 0) {
    return {
      id: 'data-available',
      title: 'Datos cargados',
      message: `La reportería tiene movimientos contables disponibles ${resolveVisibleScopeLabel(activeTab)}.`,
      severity: 'ok',
      value: String(totalMovements),
    };
  }

  return {
    id: 'data-empty',
    title: 'Sin movimientos',
    message: `No se encontraron movimientos ${resolveVisibleScopeLabel(activeTab)}. Revisa fechas, búsqueda o conexión API.`,
    severity: 'warning',
    value: '0',
  };
}

export function buildTransactionBalanceDiagnostic(libroDiario: LibroDiarioTransaccion[]): ReportDiagnostic {
  const unbalanced = libroDiario.filter((transaction) => !transaction.cuadrada);
  if (unbalanced.length === 0) {
    return {
      id: 'transactions-balanced',
      title: 'Asientos cuadrados',
      message: 'Todas las transacciones visibles tienen total debe igual a total haber.',
      severity: 'ok',
      value: 'OK',
    };
  }

  return {
    id: 'transactions-unbalanced',
    title: 'Asientos con diferencia',
    message: 'Existen transacciones visibles donde el debe y el haber no coinciden.',
    severity: 'danger',
    value: String(unbalanced.length),
  };
}

export function buildBalanceDiagnostic(balanceGeneral: BalanceGeneralResumen): ReportDiagnostic {
  if (balanceGeneral.cuadrado) {
    return {
      id: 'balance-ok',
      title: 'Balance cuadrado',
      message: 'Activo coincide con pasivo más patrimonio considerando el resultado acumulado.',
      severity: 'ok',
      value: 'OK',
    };
  }

  return {
    id: 'balance-difference',
    title: 'Balance con diferencia',
    message: 'El balance general tiene diferencia a la fecha de corte.',
    severity: 'danger',
    value: formatMoney(balanceGeneral.diferencia),
  };
}

export function buildUnclassifiedDiagnostic(movimientosPeriodo: MovimientoContable[]): ReportDiagnostic {
  const unclassified = movimientosPeriodo.filter((movement) => movement.subTipo === 'SIN_CLASIFICAR' || movement.naturalezaSaldo === 'SIN_CLASIFICAR');
  if (unclassified.length === 0) {
    return {
      id: 'classification-ok',
      title: 'Clasificación contable',
      message: 'No se detectaron cuentas sin clasificación natural en el periodo visible.',
      severity: 'ok',
      value: 'OK',
    };
  }

  return {
    id: 'classification-warning',
    title: 'Cuentas sin clasificar',
    message: 'Hay movimientos cuya cuenta no tiene clasificación completa.',
    severity: 'warning',
    value: String(unclassified.length),
  };
}

export function buildCashFlowDiagnostic(flujoCaja: FlujoCajaResumen): ReportDiagnostic {
  if (flujoCaja.requiereConfiguracion) {
    return {
      id: 'cash-config-missing',
      title: 'Cuenta de efectivo pendiente',
      message: 'El endpoint debe devolver metadata.cuentaEfectivo o metadata.cuentasEfectivo.',
      severity: 'warning',
      value: 'Metadata',
    };
  }

  return {
    id: 'cash-config-metadata',
    title: 'Efectivo desde metadata',
    message: 'El flujo de caja usa la cuenta de efectivo devuelta por el endpoint especializado.',
    severity: 'ok',
    value: flujoCaja.cashAccountCodes.join(', '),
  };
}

export function buildMetadataDiagnostic(metadata: ReporteriaContableMetadata | null): ReportDiagnostic {
  if (metadata) {
    return {
      id: 'metadata-ok',
      title: 'Metadata del endpoint',
      message: `Origen: ${metadata.origen}. Moneda: ${metadata.moneda}.`,
      severity: 'ok',
      value: metadata.moneda,
    };
  }

  return {
    id: 'metadata-missing',
    title: 'Metadata pendiente',
    message: 'La respuesta debe incluir metadata de origen, fechas, moneda y cuenta de efectivo.',
    severity: 'warning',
    value: 'Pendiente',
  };
}
