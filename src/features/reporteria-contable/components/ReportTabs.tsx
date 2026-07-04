import { ACCOUNTING_REPORT_PERMISSIONS } from '../../reporteria/domain/reportPermissions';
import type { ReportTab } from '../domain/types';

interface ReportTabsProps {
  activeTab: ReportTab;
  allowedTabs: ReportTab[];
  onChange: (tab: ReportTab) => void;
}

export function ReportTabs({ activeTab, allowedTabs, onChange }: ReportTabsProps) {
  const visibleTabs = ACCOUNTING_REPORT_PERMISSIONS.filter((tab) => allowedTabs.includes(tab.id));

  return (
    <div className="panel tabs" role="tablist" aria-label="Reportes contables">
      {visibleTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-button ${activeTab === tab.id ? 'tab-button--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
