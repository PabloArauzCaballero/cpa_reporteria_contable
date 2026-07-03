import type { BalanceGeneralResumen, ReportTab } from '../../domain/types';
import { resolveReportDescription, resolveReportTitle } from './reportContentMeta';

interface ReportSectionHeaderProps {
  activeTab: ReportTab;
  balanceGeneral: BalanceGeneralResumen;
}

export function ReportSectionHeader({ activeTab, balanceGeneral }: ReportSectionHeaderProps) {
  return (
    <div className="section-heading">
      <div>
        <h2>{resolveReportTitle(activeTab)}</h2>
        <p>{resolveReportDescription(activeTab)}</p>
      </div>
      {activeTab === 'balance' ? (
        <span className={`badge ${balanceGeneral.cuadrado ? 'badge--success' : 'badge--danger'}`}>
          {balanceGeneral.cuadrado ? 'Cuadrado' : 'Con diferencia'}
        </span>
      ) : null}
    </div>
  );
}
