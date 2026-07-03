import type {
  BalanceGeneralResumen,
  FlujoCajaResumen,
  LibroDiarioTransaccion,
  MovimientoContable,
  ReportDiagnostic,
  ReportTab,
  ReporteriaContableMetadata,
} from './types';
import {
  buildBalanceDiagnostic,
  buildCashFlowDiagnostic,
  buildMetadataDiagnostic,
  buildNoDataDiagnostic,
  buildTransactionBalanceDiagnostic,
  buildUnclassifiedDiagnostic,
} from './diagnostics/reportDiagnosticBuilders';

interface DiagnosticsInput {
  activeTab: ReportTab;
  movimientosVisibles: MovimientoContable[];
  libroDiario: LibroDiarioTransaccion[];
  balanceGeneral: BalanceGeneralResumen;
  flujoCaja: FlujoCajaResumen;
  metadata: ReporteriaContableMetadata | null;
}

function buildDataSourceDiagnostic(): ReportDiagnostic {
  return {
    id: 'source-api',
    title: 'Fuente endpoint view',
    message: 'La pantalla consume únicamente el endpoint especializado conectado a la view contable.',
    severity: 'ok',
    value: 'API',
  };
}

function shouldShowTransactionDiagnostic(activeTab: ReportTab): boolean {
  return activeTab === 'diario' || activeTab === 'mayor';
}

export function buildReportDiagnostics(input: DiagnosticsInput): ReportDiagnostic[] {
  const diagnostics = [
    buildNoDataDiagnostic(input.movimientosVisibles.length, input.activeTab),
  ];

  if (shouldShowTransactionDiagnostic(input.activeTab)) {
    diagnostics.push(buildTransactionBalanceDiagnostic(input.libroDiario));
  }

  diagnostics.push(
    buildBalanceDiagnostic(input.balanceGeneral),
    buildUnclassifiedDiagnostic(input.movimientosVisibles),
    buildCashFlowDiagnostic(input.flujoCaja),
    buildMetadataDiagnostic(input.metadata),
    buildDataSourceDiagnostic(),
  );

  return diagnostics;
}
