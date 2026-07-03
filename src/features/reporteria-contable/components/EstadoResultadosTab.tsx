import { formatMoney } from '../domain/formatters';
import type { EstadoResultadosGrupo, EstadoResultadosResumen } from '../domain/types';
import { AccountGroupTree, type AccountGroupTreeNode } from './financial/AccountGroupTree';
import { FinancialStatementCard, StatementMoneyLine } from './financial/FinancialStatementCard';

interface EstadoResultadosTabProps {
  resumen: EstadoResultadosResumen;
}

function mapStatementGroups(groups: EstadoResultadosGrupo[]): AccountGroupTreeNode[] {
  return groups.map((group) => ({
    id: `${group.codigoGrupoCuenta || 'SIN_CODIGO'}__${group.nombre}`,
    title: group.nombre,
    subtitle: group.subGrupo ? `Subgrupo: ${group.subGrupo}` : undefined,
    total: group.total,
    children: group.cuentas.map((account) => (
      <StatementMoneyLine
        key={`${group.nombre}-${account.codigoCuenta}`}
        label={`${account.codigoCuenta} · ${account.nombreCuenta}`}
        value={account.total}
      />
    )),
  }));
}

function StatementGroup({ title, groups }: { title: string; groups: EstadoResultadosGrupo[] }) {
  return (
    <FinancialStatementCard title={title}>
      <AccountGroupTree groups={mapStatementGroups(groups)} emptyMessage="Sin movimientos en esta sección." />
    </FinancialStatementCard>
  );
}

export function EstadoResultadosTab({ resumen }: EstadoResultadosTabProps) {
  return (
    <div className="statement-grid" id="eeff">
      <StatementGroup title="Ingresos" groups={resumen.ingresos} />
      <StatementGroup title="Gastos" groups={resumen.gastos} />
      <FinancialStatementCard title="Resumen del periodo">
        <StatementMoneyLine label="Total ingresos" value={resumen.totalIngresos} strong />
        <StatementMoneyLine label="Total gastos" value={resumen.totalGastos} strong />
        <StatementMoneyLine label="Utilidad / pérdida del periodo" value={resumen.resultadoPeriodo} total />
      </FinancialStatementCard>
      <FinancialStatementCard title="Criterio aplicado">
        <p className="muted">
          Ingresos y gastos se calculan con saldo natural. Los ingresos se muestran por naturaleza acreedora y
          los gastos por naturaleza deudora para evitar invertir signos en la presentación financiera.
        </p>
        <p className="muted">Resultado del periodo: {formatMoney(resumen.resultadoPeriodo)}.</p>
      </FinancialStatementCard>
    </div>
  );
}
