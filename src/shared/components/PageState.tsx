interface PageStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageState({ title, message, actionLabel, onAction }: PageStateProps) {
  return (
    <section className="page-state" role="status" aria-live="polite">
      <div className="page-state__mark">CPA</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="button button--primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
