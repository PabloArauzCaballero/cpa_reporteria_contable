interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function StatCard({ label, value, helper, tone = 'neutral' }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <small>{helper}</small> : null}
    </article>
  );
}
