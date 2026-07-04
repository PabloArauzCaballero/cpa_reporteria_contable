import { useCallback, useEffect, useMemo, useState } from 'react';
import { getReporteriaContableContext } from '../api/reporteriaContableApi';
import { getDefaultReportFilters, hasInvalidRange } from '../domain/dateFilters';
import { buildReportDiagnostics } from '../domain/reportDiagnostics';
import { buildReportFilterOptions } from '../domain/reportFilterOptions';
import { buildReportTotals } from '../domain/calculations/reportTotals';
import {
  buildBalanceGeneral,
  buildEstadoResultados,
  buildFlujoCaja,
  buildLibroDiario,
  buildLibroMayor,
  buildMonthlyTrend,
} from '../domain/reportCalculations';
import { buildInitialReportFilters, persistReportState } from '../domain/state/reportStateStorage';
import {
  selectAccumulatedCutoffMovements,
  selectMovementsBeforePeriod,
  selectPeriodMovements,
  selectPeriodMovementsWithoutTextFilter,
  selectMovementsForActiveReport,
} from '../domain/reportMovementSelectors';
import type { MovimientoContable, ReportFilters, ReportTab, ReporteriaContableMetadata } from '../domain/types';
import { buildAutoAlignedDateRange, buildFilterSignature, readCashAccountsFromMetadata, resolveInitialTab } from '../domain/viewModelHelpers';

const FILTER_APPLY_DELAY_MS = 750;

export function useReporteriaContableViewModel(allowedTabs: ReportTab[]) {
  const [activeTab, setActiveTabState] = useState<ReportTab>(() => resolveInitialTab(allowedTabs));
  const [draftFilters, setDraftFilters] = useState<ReportFilters>(buildInitialReportFilters);
  const [filters, setFilters] = useState<ReportFilters>(draftFilters);
  const [isFilterSettling, setIsFilterSettling] = useState(false);
  const [movimientos, setMovimientos] = useState<MovimientoContable[]>([]);
  const [metadata, setMetadata] = useState<ReporteriaContableMetadata | null>(null);
  const [lastLoadedAt, setLastLoadedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedTab = allowedTabs.includes(activeTab) ? activeTab : resolveInitialTab(allowedTabs);
  const draftInvalidRange = hasInvalidRange(draftFilters);
  const appliedInvalidRange = hasInvalidRange(filters);
  const hasPendingFilters = buildFilterSignature(draftFilters) !== buildFilterSignature(filters);

  const setActiveTab = useCallback((tab: ReportTab): void => {
    if (!allowedTabs.includes(tab)) return;
    setActiveTabState(tab);
  }, [allowedTabs]);

  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTabState(resolveInitialTab(allowedTabs));
    }
  }, [activeTab, allowedTabs]);

  const load = useCallback(async () => {
    if (appliedInvalidRange) {
      setError('La fecha desde no puede ser mayor que la fecha hasta.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const context = await getReporteriaContableContext({
        desde: filters.desde,
        hasta: filters.hasta,
        fechaCorte: filters.fechaCorte,
      });

      setMovimientos(context.movimientos);
      setMetadata(context.metadata);
      setLastLoadedAt(context.metadata.generadoEn || new Date().toISOString());

      const dateRange = buildAutoAlignedDateRange(filters, context.movimientos);
      if (dateRange) {
        setDraftFilters((current) => ({ ...current, ...dateRange }));
        setFilters((current) => ({ ...current, ...dateRange }));
      }
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'No se pudo cargar la información contable.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [appliedInvalidRange, filters.desde, filters.fechaCorte, filters.hasta]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!hasPendingFilters) {
      setIsFilterSettling(false);
      return undefined;
    }

    setIsFilterSettling(true);
    const timeoutId = window.setTimeout(() => {
      setFilters(draftFilters);
      setIsFilterSettling(false);
    }, FILTER_APPLY_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [draftFilters, hasPendingFilters]);

  useEffect(() => {
    persistReportState(selectedTab, draftFilters);
  }, [selectedTab, draftFilters]);

  const metadataCashAccounts = useMemo(() => readCashAccountsFromMetadata(metadata), [metadata]);
  const cashAccountCodes = useMemo(() => metadataCashAccounts.map((account) => account.codigoCuenta), [metadataCashAccounts]);
  const filterOptions = useMemo(() => buildReportFilterOptions(movimientos), [movimientos]);

  const movimientosPeriodoBase = useMemo(() => selectPeriodMovementsWithoutTextFilter(movimientos, filters), [filters, movimientos]);
  const movimientosPeriodo = useMemo(() => selectPeriodMovements(movimientosPeriodoBase, filters), [filters, movimientosPeriodoBase]);
  const movimientosAcumuladosCorte = useMemo(() => selectAccumulatedCutoffMovements(movimientos, filters), [filters, movimientos]);
  const movimientosAntesPeriodo = useMemo(() => selectMovementsBeforePeriod(movimientos, filters), [filters, movimientos]);

  const libroDiario = useMemo(() => buildLibroDiario(movimientosPeriodo), [movimientosPeriodo]);
  const libroMayor = useMemo(() => buildLibroMayor(movimientosPeriodo), [movimientosPeriodo]);
  const estadoResultados = useMemo(() => buildEstadoResultados(movimientosPeriodo), [movimientosPeriodo]);
  const balanceGeneral = useMemo(() => buildBalanceGeneral(movimientosAcumuladosCorte), [movimientosAcumuladosCorte]);
  const flujoCaja = useMemo(
    () => buildFlujoCaja(movimientosPeriodo, movimientosAntesPeriodo, cashAccountCodes, metadataCashAccounts[0] ?? null, metadataCashAccounts),
    [cashAccountCodes, metadataCashAccounts, movimientosAntesPeriodo, movimientosPeriodo],
  );
  const monthlyTrend = useMemo(() => buildMonthlyTrend(movimientosPeriodo), [movimientosPeriodo]);
  const activeReportMovements = useMemo(
    () => selectMovementsForActiveReport(selectedTab, movimientosPeriodo, movimientosAcumuladosCorte),
    [selectedTab, movimientosAcumuladosCorte, movimientosPeriodo],
  );
  const totals = useMemo(() => buildReportTotals(activeReportMovements), [activeReportMovements]);

  const diagnostics = useMemo(() => buildReportDiagnostics({
    activeTab: selectedTab,
    movimientosVisibles: activeReportMovements,
    libroDiario,
    balanceGeneral,
    flujoCaja,
    metadata,
  }), [activeReportMovements, selectedTab, balanceGeneral, flujoCaja, libroDiario, metadata]);

  function updateFilter(name: keyof ReportFilters, value: string): void {
    setDraftFilters((current) => ({ ...current, [name]: value }));
  }

  function applyOrReload(): void {
    if (draftInvalidRange) return;
    if (hasPendingFilters) {
      setFilters(draftFilters);
      setIsFilterSettling(false);
      return;
    }
    void load();
  }

  function resetFilters(): void {
    const defaults = getDefaultReportFilters();
    setDraftFilters(defaults);
    setFilters(defaults);
  }

  return {
    activeTab: selectedTab,
    setActiveTab,
    filters: draftFilters,
    updateFilter,
    resetFilters,
    applyOrReload,
    filterOptions,
    hasPendingFilters,
    isFilterSettling,
    isLoading,
    error,
    invalidRange: draftInvalidRange,
    lastLoadedAt,
    load,
    metadata,
    movimientosPeriodo,
    movimientosAcumuladosCorte,
    libroDiario,
    libroMayor,
    estadoResultados,
    balanceGeneral,
    flujoCaja,
    monthlyTrend,
    diagnostics,
    totals,
  };
}
