import { PageState } from '../../../shared/components/PageState';
import { ReportContent } from '../components/ReportContent';
import { ReportDiagnosticsDrawer } from '../components/ReportDiagnosticsDrawer';
import { ReportHeader } from '../components/ReportHeader';
import { ReportTabs } from '../components/ReportTabs';
import { ReportToolbar } from '../components/ReportToolbar';
import { downloadReportCsv } from '../domain/exportCsv';
import type { ReportTab } from '../domain/types';
import { useReporteriaContableViewModel } from '../hooks/useReporteriaContableViewModel';

interface ReporteriaContablePageProps {
  allowedTabs: ReportTab[];
}

export function ReporteriaContablePage({ allowedTabs }: ReporteriaContablePageProps) {
  if (allowedTabs.length === 0) {
    return (
      <PageState
        title="No tienes reportes contables habilitados"
        message="Solicita a un administrador que habilite los reportes que necesitas consultar."
      />
    );
  }

  return <ReporteriaContableContent allowedTabs={allowedTabs} />;
}

function ReporteriaContableContent({ allowedTabs }: ReporteriaContablePageProps) {
  const viewModel = useReporteriaContableViewModel(allowedTabs);

  return (
    <div className="report-page">
      <ReportHeader
        lastLoadedAt={viewModel.lastLoadedAt}
        metadata={viewModel.metadata}
        onExportCsv={() => downloadReportCsv({
          activeTab: viewModel.activeTab,
          movimientosPeriodo: viewModel.movimientosPeriodo,
          libroDiario: viewModel.libroDiario,
          libroMayor: viewModel.libroMayor,
          estadoResultados: viewModel.estadoResultados,
          balanceGeneral: viewModel.balanceGeneral,
          flujoCaja: viewModel.flujoCaja,
        })}
        onPrint={() => window.print()}
      />

      <ReportToolbar
        activeTab={viewModel.activeTab}
        filters={viewModel.filters}
        filterOptions={viewModel.filterOptions}
        onFilterChange={viewModel.updateFilter}
        onApplyOrReload={viewModel.applyOrReload}
        onResetFilters={viewModel.resetFilters}
        isLoading={viewModel.isLoading}
        invalidRange={viewModel.invalidRange}
        hasPendingFilters={viewModel.hasPendingFilters}
        isFilterSettling={viewModel.isFilterSettling}
      />

      <ReportDiagnosticsDrawer diagnostics={viewModel.diagnostics} />

      <ReportTabs activeTab={viewModel.activeTab} allowedTabs={allowedTabs} onChange={viewModel.setActiveTab} />

      <ReportContent
        activeTab={viewModel.activeTab}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
        onRetry={() => void viewModel.load()}
        totals={viewModel.totals}
        libroDiario={viewModel.libroDiario}
        libroMayor={viewModel.libroMayor}
        estadoResultados={viewModel.estadoResultados}
        balanceGeneral={viewModel.balanceGeneral}
        flujoCaja={viewModel.flujoCaja}
        monthlyTrend={viewModel.monthlyTrend}
      />
    </div>
  );
}
