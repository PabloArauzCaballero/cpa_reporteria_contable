import type { AuthSession } from '../../../shared/auth/session';
import { getEnabledAccountingReports } from '../domain/reportPermissions';

interface ReporteriaPanelPageProps {
  session: AuthSession | null;
  onOpenContabilidad: () => void;
}

const nextAreas = ['Comercial', 'Académica', 'Operaciones'];

export function ReporteriaPanelPage({ session, onOpenContabilidad }: ReporteriaPanelPageProps) {
  const accountingReports = getEnabledAccountingReports(session);
  const canOpenContabilidad = accountingReports.length > 0;

  return (
    <section className="reporting-home" aria-labelledby="reporting-home-title">
      <div className="reporting-home__hero">
        <div>
          <span className="report-kicker">Panel de reportería</span>
          <h1 id="reporting-home-title">Centro de reportes CPA</h1>
          <p>
            Selecciona el área que deseas revisar. Solo se muestran las opciones habilitadas para tu usuario.
          </p>
        </div>
      </div>

      <div className="reporting-home__grid" aria-label="Áreas disponibles">
        {canOpenContabilidad ? (
          <article className="reporting-card reporting-card--ready">
            <div className="reporting-card__header">
              <span>Reportes financieros</span>
              <strong>Disponible</strong>
            </div>
            <h2>Contabilidad</h2>
            <p>Consulta los reportes contables habilitados para tu usuario.</p>
            <div className="reporting-card__chips" aria-label="Reportes habilitados">
              {accountingReports.map((report) => <span key={report.id}>{report.label}</span>)}
            </div>
            <button type="button" onClick={onOpenContabilidad}>Abrir reportes</button>
          </article>
        ) : (
          <article className="reporting-card reporting-card--empty">
            <div className="reporting-card__header">
              <span>Sin opciones habilitadas</span>
              <strong>Revisión requerida</strong>
            </div>
            <h2>No tienes reportes asignados</h2>
            <p>Solicita a un administrador que habilite los reportes que necesitas consultar.</p>
          </article>
        )}

        <article className="reporting-card reporting-card--empty">
          <div className="reporting-card__header">
            <span>Próximamente</span>
            <strong>Planificado</strong>
          </div>
          <h2>Nuevas áreas</h2>
          <p>Este panel está listo para incorporar nuevos reportes cuando se habiliten.</p>
          <div className="reporting-card__chips" aria-label="Áreas planificadas">
            {nextAreas.map((area) => <span key={area}>{area}</span>)}
          </div>
        </article>
      </div>
    </section>
  );
}
