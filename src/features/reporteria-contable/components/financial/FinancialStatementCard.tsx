import type { ReactNode } from 'react';
import { formatMoney } from '../../domain/formatters';

interface FinancialStatementCardProps {
  title: string;
  children: ReactNode;
}

interface StatementMoneyLineProps {
  label: ReactNode;
  value: number;
  strong?: boolean;
  total?: boolean;
}

export function FinancialStatementCard({ title, children }: FinancialStatementCardProps) {
  return (
    <article className="statement-card">
      <h3>{title}</h3>
      {children}
    </article>
  );
}

export function StatementMoneyLine({ label, value, strong = false, total = false }: StatementMoneyLineProps) {
  const ValueTag = strong || total ? 'strong' : 'span';

  return (
    <div className={`statement-line ${total ? 'statement-total' : ''}`}>
      <span>{label}</span>
      <ValueTag>{formatMoney(value)}</ValueTag>
    </div>
  );
}

export function EmptyStatementMessage({ children }: { children: ReactNode }) {
  return <p className="muted">{children}</p>;
}
