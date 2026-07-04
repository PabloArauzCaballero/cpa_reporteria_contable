import type { AuthSession } from '../../../shared/auth/session';
import { sessionHasPermission } from '../../../shared/auth/permissions';
import type { ReportTab } from '../../reporteria-contable/domain/types';

export interface AccountingReportPermission {
  id: ReportTab;
  label: string;
  description: string;
  permissionCodes: string[];
}

export const ACCOUNTING_REPORT_AREA_PERMISSION_CODES = [
  'REPORTERIA.CONTABILIDAD.READ',
  'REPORTERIA.CONTABILIDAD.*',
  'REPORTERIA.CONTABLE.READ',
  'REPORTERIA.CONTABLE.*',
  'CONTABILIDAD.REPORTERIA.READ',
  'CONTABILIDAD.REPORTES.READ',
  'CONTABILIDAD.*',
];

export const ACCOUNTING_REPORT_PERMISSIONS: AccountingReportPermission[] = [
  {
    id: 'diario',
    label: 'Libro diario',
    description: 'Detalle cronológico de asientos y movimientos.',
    permissionCodes: [
      ...ACCOUNTING_REPORT_AREA_PERMISSION_CODES,
      'REPORTERIA.CONTABILIDAD.LIBRO_DIARIO.READ',
      'REPORTERIA.CONTABILIDAD.DIARIO.READ',
      'CONTABILIDAD.LIBRO_DIARIO.READ',
      'CONTABILIDAD.TRANSACCION.READ',
    ],
  },
  {
    id: 'mayor',
    label: 'Libro mayor',
    description: 'Movimientos agrupados por cuenta contable.',
    permissionCodes: [
      ...ACCOUNTING_REPORT_AREA_PERMISSION_CODES,
      'REPORTERIA.CONTABILIDAD.LIBRO_MAYOR.READ',
      'REPORTERIA.CONTABILIDAD.MAYOR.READ',
      'CONTABILIDAD.LIBRO_MAYOR.READ',
      'CONTABILIDAD.CUENTA.READ',
    ],
  },
  {
    id: 'resultados',
    label: 'Estado de resultados',
    description: 'Ingresos, gastos y resultado del periodo.',
    permissionCodes: [
      ...ACCOUNTING_REPORT_AREA_PERMISSION_CODES,
      'REPORTERIA.CONTABILIDAD.ESTADO_RESULTADOS.READ',
      'CONTABILIDAD.ESTADO_RESULTADOS.READ',
    ],
  },
  {
    id: 'balance',
    label: 'Balance general',
    description: 'Activos, pasivos y patrimonio a fecha de corte.',
    permissionCodes: [
      ...ACCOUNTING_REPORT_AREA_PERMISSION_CODES,
      'REPORTERIA.CONTABILIDAD.BALANCE_GENERAL.READ',
      'CONTABILIDAD.BALANCE_GENERAL.READ',
      'CONTABILIDAD.GRUPO_CUENTA.READ',
    ],
  },
  {
    id: 'flujo',
    label: 'Flujo de caja',
    description: 'Entradas, salidas y saldo de efectivo.',
    permissionCodes: [
      ...ACCOUNTING_REPORT_AREA_PERMISSION_CODES,
      'REPORTERIA.CONTABILIDAD.FLUJO_CAJA.READ',
      'CONTABILIDAD.FLUJO_CAJA.READ',
    ],
  },
];

export function getEnabledAccountingReports(session: AuthSession | null): AccountingReportPermission[] {
  return ACCOUNTING_REPORT_PERMISSIONS.filter((report) => sessionHasPermission(session, report.permissionCodes));
}

export function getEnabledAccountingReportTabs(session: AuthSession | null): ReportTab[] {
  return getEnabledAccountingReports(session).map((report) => report.id);
}

export function canOpenAccountingReports(session: AuthSession | null): boolean {
  return getEnabledAccountingReportTabs(session).length > 0;
}
