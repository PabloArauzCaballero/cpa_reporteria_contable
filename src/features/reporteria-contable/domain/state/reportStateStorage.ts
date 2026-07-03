import { getDefaultReportFilters } from '../dateFilters';
import type { ReportFilters, ReportTab } from '../types';

const STORAGE_KEY = 'cpa.reporteriaContable.v8';

interface StoredReportState {
  activeTab?: ReportTab;
  dateFilters?: Partial<Pick<ReportFilters, 'desde' | 'hasta' | 'fechaCorte'>>;
}

function isReportTab(value: unknown): value is ReportTab {
  return value === 'diario' || value === 'mayor' || value === 'resultados' || value === 'balance' || value === 'flujo';
}

function readStoredState(): StoredReportState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as StoredReportState;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

export function buildInitialReportFilters(): ReportFilters {
  const defaults = getDefaultReportFilters();
  const stored = readStoredState().dateFilters ?? {};

  return {
    ...defaults,
    desde: readString(stored.desde, defaults.desde),
    hasta: readString(stored.hasta, defaults.hasta),
    fechaCorte: readString(stored.fechaCorte, defaults.fechaCorte),
  };
}

export function buildInitialReportTab(): ReportTab {
  const stored = readStoredState().activeTab;
  return isReportTab(stored) ? stored : 'diario';
}

export function persistReportState(activeTab: ReportTab, filters: ReportFilters): void {
  const payload: StoredReportState = {
    activeTab,
    dateFilters: {
      desde: filters.desde,
      hasta: filters.hasta,
      fechaCorte: filters.fechaCorte,
    },
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
