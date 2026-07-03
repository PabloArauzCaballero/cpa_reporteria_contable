import { ReportContent } from '../components/ReportContent';
import { ReportDiagnosticsDrawer } from '../components/ReportDiagnosticsDrawer';
import { ReportHeader } from '../components/ReportHeader';
import { ReportTabs } from '../components/ReportTabs';
import { ReportToolbar } from '../components/ReportToolbar';
import { downloadReportCsv } from '../domain/exportCsv';
import { useReporteriaContableViewModel } from '../hooks/useReporteriaContableViewModel';

export function ReporteriaContablePage() {
  const viewModel = useReporteriaContableViewModel();

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

      <ReportTabs activeTab={viewModel.activeTab} onChange={viewModel.setActiveTab} />

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
