import { PageState } from '../../../shared/components/PageState';
import type {
  BalanceGeneralResumen,
  EstadoResultadosResumen,
  FlujoCajaResumen,
  LibroDiarioTransaccion,
  LibroMayorCuenta,
  ReportMonthSummary,
  ReportTab,
  ReportTotals,
} from '../domain/types';
import { MonthlyTrendPanel } from './MonthlyTrendPanel';
import { ActiveReportRenderer } from './report-content/ActiveReportRenderer';
import { ReportKpiPanel } from './report-content/ReportKpiPanel';
import { ReportSectionHeader } from './report-content/ReportSectionHeader';

interface ReportContentProps {
  activeTab: ReportTab;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  totals: ReportTotals;
  libroDiario: LibroDiarioTransaccion[];
  libroMayor: LibroMayorCuenta[];
  estadoResultados: EstadoResultadosResumen;
  balanceGeneral: BalanceGeneralResumen;
  flujoCaja: FlujoCajaResumen;
  monthlyTrend: ReportMonthSummary[];
}

export function ReportContent(props: ReportContentProps) {
  if (props.isLoading) {
    return <PageState title="Cargando reportería" message="Preparando movimientos, saldos y agrupaciones contables." />;
  }

  if (props.error) {
    return (
      <PageState
        title="No se pudo cargar la reportería"
        message={props.error}
        actionLabel="Reintentar"
        onAction={props.onRetry}
      />
    );
  }

  return (
    <section className="panel report-section">
      <ReportSectionHeader activeTab={props.activeTab} balanceGeneral={props.balanceGeneral} />
      <ReportKpiPanel totals={props.totals} />
      <MonthlyTrendPanel months={props.monthlyTrend} />
      <ActiveReportRenderer
        activeTab={props.activeTab}
        libroDiario={props.libroDiario}
        libroMayor={props.libroMayor}
        estadoResultados={props.estadoResultados}
        balanceGeneral={props.balanceGeneral}
        flujoCaja={props.flujoCaja}
      />
    </section>
  );
}
