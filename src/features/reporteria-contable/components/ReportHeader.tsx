import { formatDate } from '../domain/formatters';
import type { ReporteriaContableMetadata } from '../domain/types';

interface ReportHeaderProps {
  lastLoadedAt: string | null;
  metadata: ReporteriaContableMetadata | null;
  onExportCsv: () => void;
  onPrint: () => void;
}

function formatLoadedAt(value: string | null): string {
  if (!value) return 'Pendiente de carga';
  return `${formatDate(value)} · ${new Date(value).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}`;
}

function metadataLine(metadata: ReporteriaContableMetadata | null): string {
  if (!metadata) return 'Origen pendiente de metadata del endpoint especializado.';
  return `${metadata.origen} · ${metadata.moneda} · corte ${formatDate(metadata.fechaCorte)}`;
}

export function ReportHeader({ lastLoadedAt, metadata, onExportCsv, onPrint }: ReportHeaderProps) {
  return (
    <header className="report-hero" id="reporteria-contable">
      <div className="report-hero__content">
        <div>
          <span className="report-kicker">CPA · Reportería financiera</span>
          <h1>Reportería contable</h1>
          <p>
            Plataforma de reporteria contable: Libro Diario, Libro Mayor, Estado de Resultados, Balance General y Flujo de Caja, construido sobre la vista contable consolidada.
          </p>
          <p className="report-hero__meta">Última carga: {formatLoadedAt(lastLoadedAt)}</p>
        </div>

        <div className="report-hero__actions">
          <span className="badge badge--success">Endpoint view</span>
          <button type="button" className="button button--ghost" onClick={onExportCsv}>
            Exportar reporte
          </button>
          <button type="button" className="button button--light" onClick={onPrint}>
            Imprimir / PDF
          </button>
        </div>
      </div>
    </header>
  );
}
