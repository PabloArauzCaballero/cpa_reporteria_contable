import type { ReactNode } from 'react';
import { formatMoney } from '../../domain/formatters';

export interface AccountGroupTreeNode {
  id: string;
  title: string;
  subtitle?: string;
  total: number;
  children: ReactNode;
  order?: number;
  subGroupOrder?: number;
}

interface AccountGroupTreeProps {
  groups: AccountGroupTreeNode[];
  emptyMessage: string;
  level?: 'subgroup' | 'group';
}

export function AccountGroupTree({ groups, emptyMessage, level = 'group' }: AccountGroupTreeProps) {
  if (groups.length === 0) {
    return <p className="muted">{emptyMessage}</p>;
  }

  return (
    <div className={`account-tree account-tree--${level}`}>
      {groups.map((group) => (
        <details className={`account-tree__group account-tree__group--${level}`} key={group.id} open>
          <summary className="account-tree__summary">
            <span>
              <strong>{group.title}</strong>
              {group.subtitle ? <small>{group.subtitle}</small> : null}
            </span>
            <b>{formatMoney(group.total)}</b>
          </summary>
          <div className="account-tree__children">{group.children}</div>
        </details>
      ))}
    </div>
  );
}
