import type { ReportFilterOptions } from '../domain/reportFilterOptions';
import type { ReportFilters, ReportTab } from '../domain/types';
import { AccountTypeSelect } from './toolbar/AccountTypeSelect';
import { AdvancedFilterPanel } from './toolbar/AdvancedFilterPanel';
import { BalanceCutoffField } from './toolbar/BalanceCutoffField';
import { DateRangeFields } from './toolbar/DateRangeFields';
import { SearchField } from './toolbar/SearchField';
import { ToolbarActions } from './toolbar/ToolbarActions';
import { ToolbarHint } from './toolbar/ToolbarHint';

interface ReportToolbarProps {
  activeTab: ReportTab;
  filters: ReportFilters;
  filterOptions: ReportFilterOptions;
  onFilterChange: (name: keyof ReportFilters, value: string) => void;
  onApplyOrReload: () => void;
  onResetFilters: () => void;
  isLoading: boolean;
  invalidRange: boolean;
  hasPendingFilters: boolean;
  isFilterSettling: boolean;
}

export function ReportToolbar(props: ReportToolbarProps) {
  const isBalance = props.activeTab === 'balance';

  return (
    <section className="panel toolbar" aria-label="Filtros de reportería contable">
      <div className="toolbar__grid toolbar__grid--phase3">
        {isBalance ? (
          <BalanceCutoffField fechaCorte={props.filters.fechaCorte} onFilterChange={props.onFilterChange} />
        ) : (
          <DateRangeFields filters={props.filters} invalidRange={props.invalidRange} onFilterChange={props.onFilterChange} />
        )}
        <SearchField value={props.filters.search} onFilterChange={props.onFilterChange} />
        <AccountTypeSelect value={props.filters.subTipo} onFilterChange={props.onFilterChange} />
        <ToolbarActions
          isLoading={props.isLoading}
          invalidRange={props.invalidRange && !isBalance}
          hasPendingFilters={props.hasPendingFilters}
          isFilterSettling={props.isFilterSettling}
          onApplyOrReload={props.onApplyOrReload}
          onResetFilters={props.onResetFilters}
        />
      </div>
      <AdvancedFilterPanel filters={props.filters} options={props.filterOptions} onFilterChange={props.onFilterChange} />
      <ToolbarHint isBalance={isBalance} invalidRange={props.invalidRange} hasPendingFilters={props.hasPendingFilters} />
    </section>
  );
}
