import type { ReactNode } from 'react';
import type { AuthSession } from '../auth/session';

export type ReportShellView = 'panel' | 'contabilidad';

interface ReportShellProps {
  children: ReactNode;
  activeView: ReportShellView;
  session: AuthSession | null;
  canOpenContabilidad: boolean;
  onLogout: () => void;
  onOpenPanel: () => void;
  onOpenContabilidad: () => void;
}

export function ReportShell(props: ReportShellProps) {
  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Navegación principal">
        <div className="brand-card">
          <div className="brand-card__logo">CPA</div>
          <div>
            <strong>Plataforma CPA</strong>
            <span>Centro de Preparación Académica</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <button
            className={props.activeView === 'panel' ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
            type="button"
            onClick={props.onOpenPanel}
          >
            <span>▦</span>
            Panel de reportería
          </button>

          {props.canOpenContabilidad ? (
            <button
              className={props.activeView === 'contabilidad' ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
              type="button"
              onClick={props.onOpenContabilidad}
            >
              <span>◫</span>
              Contabilidad
            </button>
          ) : null}
        </nav>

        <section className="sidebar-session" aria-label="Sesión activa">
          <span>Sesión interna</span>
          <strong>{props.session?.userName ?? 'Usuario autorizado'}</strong>
          <small>{props.session?.userEmail ?? 'Acceso autorizado'}</small>
          <button type="button" onClick={props.onLogout}>Cerrar sesión</button>
        </section>

        <footer className="sidebar__footer">
          <span>Consulta solo lectura</span>
          <strong>Reportes · CPA</strong>
        </footer>
      </aside>

      <main className="content">{props.children}</main>
    </div>
  );
}
