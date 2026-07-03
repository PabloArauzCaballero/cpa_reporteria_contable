import type { ReportTab } from '../domain/types';

const tabs: Array<{ id: ReportTab; label: string }> = [
  { id: 'diario', label: 'Libro diario' },
  { id: 'mayor', label: 'Libro mayor' },
  { id: 'resultados', label: 'Estado de resultados' },
  { id: 'balance', label: 'Balance general' },
  { id: 'flujo', label: 'Flujo de caja' },
];

interface ReportTabsProps {
  activeTab: ReportTab;
  onChange: (tab: ReportTab) => void;
}

export function ReportTabs({ activeTab, onChange }: ReportTabsProps) {
  return (
    <div className="panel tabs" role="tablist" aria-label="Reportes contables">
      {tabs.map((tab) => (
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
