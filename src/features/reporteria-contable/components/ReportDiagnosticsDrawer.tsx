import type { ReportDiagnostic } from '../domain/types';
import { DiagnosticPanel } from './DiagnosticPanel';

interface ReportDiagnosticsDrawerProps {
  diagnostics: ReportDiagnostic[];
}

function countProblems(diagnostics: ReportDiagnostic[]): number {
  return diagnostics.filter((diagnostic) => diagnostic.severity !== 'ok').length;
}

export function ReportDiagnosticsDrawer({ diagnostics }: ReportDiagnosticsDrawerProps) {
  const problems = countProblems(diagnostics);

  return (
    <details className="panel diagnostic-drawer no-print">
      <summary>
        <span>
          <strong>Diagnóstico de calidad contable</strong>
          <small>Panel fuera del reporte principal para no contaminar libros ni estados financieros.</small>
        </span>
        <b>{problems === 0 ? 'Sin alertas' : `${problems} alerta${problems === 1 ? '' : 's'}`}</b>
      </summary>
      <DiagnosticPanel diagnostics={diagnostics} />
    </details>
  );
}
