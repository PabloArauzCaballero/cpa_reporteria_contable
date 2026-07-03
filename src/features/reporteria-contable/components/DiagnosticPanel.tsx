import type { ReportDiagnostic } from '../domain/types';

interface DiagnosticPanelProps {
  diagnostics: ReportDiagnostic[];
}

function resolveSeverityLabel(severity: ReportDiagnostic['severity']): string {
  if (severity === 'danger') return 'Crítico';
  if (severity === 'warning') return 'Atención';
  return 'Correcto';
}

export function DiagnosticPanel({ diagnostics }: DiagnosticPanelProps) {
  return (
    <section className="diagnostic-grid" aria-label="Diagnóstico de calidad contable">
      {diagnostics.map((diagnostic) => (
        <article className={`diagnostic-card diagnostic-card--${diagnostic.severity}`} key={diagnostic.id}>
          <div>
            <span>{resolveSeverityLabel(diagnostic.severity)}</span>
            <strong>{diagnostic.title}</strong>
            <p>{diagnostic.message}</p>
          </div>
          {diagnostic.value ? <b>{diagnostic.value}</b> : null}
        </article>
      ))}
    </section>
  );
}
