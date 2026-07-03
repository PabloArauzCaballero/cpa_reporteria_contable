import { formatMoney } from '../domain/formatters';
import type { BalanceGeneralResumen, BalanceLinea } from '../domain/types';
import { AccountGroupTree } from './financial/AccountGroupTree';
import { buildBalanceAccountTreeNodes } from './financial/balanceAccountTreeNodes';
import { FinancialStatementCard, StatementMoneyLine } from './financial/FinancialStatementCard';

interface BalanceGeneralTabProps {
  resumen: BalanceGeneralResumen;
}

function BalanceLines({ title, lines, total }: { title: string; lines: BalanceLinea[]; total: number }) {
  return (
    <FinancialStatementCard title={title}>
      <AccountGroupTree
        groups={buildBalanceAccountTreeNodes(lines)}
        emptyMessage="Sin saldos para esta sección."
        level="subgroup"
      />
      <StatementMoneyLine label={`Total ${title.toLowerCase()}`} value={total} total />
    </FinancialStatementCard>
  );
}

function PasivoPatrimonioCard({ resumen }: { resumen: BalanceGeneralResumen }) {
  return (
    <FinancialStatementCard title="Pasivo + Patrimonio">
      <h4>Pasivo</h4>
      <AccountGroupTree
        groups={buildBalanceAccountTreeNodes(resumen.pasivos)}
        emptyMessage="Sin saldos de pasivo."
        level="subgroup"
      />
      <StatementMoneyLine label="Total pasivo" value={resumen.totalPasivo} total />

      <h4>Patrimonio</h4>
      <AccountGroupTree
        groups={buildBalanceAccountTreeNodes(resumen.patrimonio)}
        emptyMessage="Sin saldos de patrimonio."
        level="subgroup"
      />
      <StatementMoneyLine label="Resultado acumulado no cerrado" value={resumen.resultadoPeriodo} />
      <StatementMoneyLine label="Total patrimonio" value={resumen.totalPatrimonio} total />
    </FinancialStatementCard>
  );
}

function BalanceCheckCard({ resumen }: { resumen: BalanceGeneralResumen }) {
  return (
    <FinancialStatementCard title="Comprobación">
      <StatementMoneyLine label="Total activo" value={resumen.totalActivo} strong />
      <StatementMoneyLine label="Total pasivo + patrimonio" value={resumen.totalPasivoPatrimonio} strong />
      <StatementMoneyLine label="Diferencia" value={resumen.diferencia} total />
      <span className={`badge ${resumen.cuadrado ? 'badge--success' : 'badge--danger'}`}>
        {resumen.cuadrado ? 'Balance cuadrado' : 'Revisar descuadre'}
      </span>
    </FinancialStatementCard>
  );
}

export function BalanceGeneralTab({ resumen }: BalanceGeneralTabProps) {
  return (
    <div className="statement-grid">
      <BalanceLines title="Activo" lines={resumen.activos} total={resumen.totalActivo} />
      <PasivoPatrimonioCard resumen={resumen} />
      <BalanceCheckCard resumen={resumen} />
      <FinancialStatementCard title="Criterio aplicado">
        <p className="muted">
          Activos y pasivos se ordenan por liquidez: primero corriente y luego no corriente. Cada subgrupo despliega
          internamente sus grupos de cuenta y cada grupo despliega sus cuentas contables.
        </p>
        <p className="muted">
          El balance usa saldos acumulados hasta la fecha de corte y agrega el resultado no cerrado al patrimonio para
          validar el cuadre.
        </p>
        <p className="muted">Diferencia actual: {formatMoney(resumen.diferencia)}.</p>
      </FinancialStatementCard>
    </div>
  );
}
