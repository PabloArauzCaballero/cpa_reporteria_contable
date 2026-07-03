import type { ReportTab } from '../../domain/types';

export function resolveReportTitle(activeTab: ReportTab): string {
  if (activeTab === 'diario') return 'Libro diario';
  if (activeTab === 'mayor') return 'Libro mayor';
  if (activeTab === 'resultados') return 'Estado de resultados';
  if (activeTab === 'balance') return 'Balance general';
  return 'Flujo de caja';
}

export function resolveReportDescription(activeTab: ReportTab): string {
  if (activeTab === 'balance') return 'Vista acumulada a fecha de corte con comprobación activo contra pasivo y patrimonio.';
  if (activeTab === 'flujo') return 'Clasificación del movimiento de efectivo por operación, inversión y financiamiento.';
  return 'Vista por rango de fechas basada en los movimientos contables activos.';
}
