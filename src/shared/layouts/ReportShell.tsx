import type { ReactNode } from 'react';
import type { AuthSession } from '../auth/session';

interface ReportShellProps {
  children: ReactNode;
  session: AuthSession | null;
  onLogout: () => void;
}

export function ReportShell({ children, session, onLogout }: ReportShellProps) {
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
          <a className="sidebar__link sidebar__link--active" href="#reporteria-contable">
            <span>▦</span>
            Reportería contable
          </a>
          <a className="sidebar__link" href="#libro-diario">
            <span>◷</span>
            Libro diario
          </a>
          <a className="sidebar__link" href="#eeff">
            <span>◫</span>
            Estados financieros
          </a>
        </nav>

        <section className="sidebar-session" aria-label="Sesión activa">
          <span>Sesión interna</span>
          <strong>{session?.userName ?? 'Usuario autorizado'}</strong>
          <small>{session?.userEmail ?? 'Acceso autorizado'}</small>
          <button type="button" onClick={onLogout}>Cerrar sesión</button>
        </section>

        <footer className="sidebar__footer">
          <span>Consulta solo lectura</span>
          <strong>Reportes · CPA</strong>
        </footer>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
