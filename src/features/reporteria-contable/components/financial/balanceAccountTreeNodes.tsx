import { AccountGroupTree, type AccountGroupTreeNode } from './AccountGroupTree';
import { StatementMoneyLine } from './FinancialStatementCard';
import { normalizeText } from '../../domain/calculations/movementFilters';
import type { BalanceLinea } from '../../domain/types';

function subGroupOrder(subGrupo: string): number {
  const normalized = normalizeText(subGrupo).replace(/[\s-]+/g, '_');
  if (normalized.includes('no_corriente') || normalized.includes('nocorriente')) return 2;
  if (normalized.includes('corriente')) return 1;
  return 9;
}

function normalizeSubGroupTitle(subGrupo: string): string {
  const value = subGrupo.trim();
  if (!value) return 'SIN SUBGRUPO';

  const normalized = normalizeText(value).replace(/[\s-]+/g, '_');
  if (normalized.includes('no_corriente') || normalized.includes('nocorriente')) return 'NO_CORRIENTE';
  if (normalized.includes('corriente')) return 'CORRIENTE';
  return value.toUpperCase();
}

function compareByAccountCode(left: BalanceLinea, right: BalanceLinea): number {
  return left.codigoCuenta.localeCompare(right.codigoCuenta, 'es', { numeric: true });
}

function buildAccountGroupNodes(lines: BalanceLinea[]): AccountGroupTreeNode[] {
  const byGroup = new Map<string, BalanceLinea[]>();

  for (const line of lines) {
    const groupKey = `${line.codigoGrupoCuenta || 'SIN_CODIGO'}__${line.nombreGrupoCuenta || line.grupo || 'SIN_GRUPO'}`;
    const existing = byGroup.get(groupKey) ?? [];
    existing.push(line);
    byGroup.set(groupKey, existing);
  }

  return Array.from(byGroup.entries())
    .map(([id, groupLines]) => {
      const sortedLines = [...groupLines].sort(compareByAccountCode);
      const first = sortedLines[0];
      const groupTotal = sortedLines.reduce((total, line) => total + line.total, 0);

      return {
        id,
        title: first?.nombreGrupoCuenta || first?.grupo || 'Sin grupo de cuenta',
        subtitle: first?.codigoGrupoCuenta ? `Código grupo: ${first.codigoGrupoCuenta}` : undefined,
        total: groupTotal,
        order: first?.ordenReporte ?? 9999,
        children: sortedLines.map((line) => (
          <StatementMoneyLine
            key={`${line.codigoCuenta}-${line.nombreCuenta}`}
            label={`${line.codigoCuenta} · ${line.nombreCuenta}`}
            value={line.total}
          />
        )),
      };
    })
    .sort((left, right) => {
      if ((left.order ?? 9999) !== (right.order ?? 9999)) return (left.order ?? 9999) - (right.order ?? 9999);
      return left.title.localeCompare(right.title, 'es', { numeric: true });
    });
}

export function buildBalanceAccountTreeNodes(lines: BalanceLinea[]): AccountGroupTreeNode[] {
  const bySubGroup = new Map<string, BalanceLinea[]>();

  for (const line of lines) {
    const subGroupTitle = normalizeSubGroupTitle(line.subGrupo);
    const existing = bySubGroup.get(subGroupTitle) ?? [];
    existing.push(line);
    bySubGroup.set(subGroupTitle, existing);
  }

  return Array.from(bySubGroup.entries())
    .map(([subGroupTitle, subGroupLines]) => {
      const accountGroupNodes = buildAccountGroupNodes(subGroupLines);
      const subGroupTotal = subGroupLines.reduce((total, line) => total + line.total, 0);
      const first = subGroupLines[0];

      return {
        id: `subgrupo-${subGroupTitle}`,
        title: subGroupTitle,
        subtitle: `${accountGroupNodes.length} grupo${accountGroupNodes.length === 1 ? '' : 's'} de cuenta`,
        total: subGroupTotal,
        order: first?.ordenReporte ?? 9999,
        subGroupOrder: subGroupOrder(first?.subGrupo ?? subGroupTitle),
        children: <AccountGroupTree groups={accountGroupNodes} emptyMessage="Sin cuentas para este subgrupo." level="group" />,
      };
    })
    .sort((left, right) => {
      if ((left.subGroupOrder ?? 9) !== (right.subGroupOrder ?? 9)) {
        return (left.subGroupOrder ?? 9) - (right.subGroupOrder ?? 9);
      }
      return left.title.localeCompare(right.title, 'es', { numeric: true });
    });
}
