import type { LoginCredentials } from '../domain/authTypes';
import { LoginForm } from '../components/LoginForm';

interface LoginPageProps {
  isSubmitting: boolean;
  error: string | null;
  onLogin: (credentials: LoginCredentials) => void;
}

export function LoginPage({ isSubmitting, error, onLogin }: LoginPageProps) {
  return (
    <main className="login-page">
      <section className="login-page__panel" aria-label="Acceso a reportería contable">
        <div className="login-page__copy">
          <p className="report-kicker">CPA · Plataforma interna</p>
          <h2>Reportería contable protegida y lista para dirección.</h2>
          <p>
            Consulta segura y de solo lectura para revisar libros contables, estados financieros y Flujo de Caja.
          </p>
          <div className="login-page__badges">
            <span>Libro Diario</span>
            <span>Libro Mayor</span>
            <span>Balance General</span>
            <span>Flujo de Caja</span>
          </div>
        </div>

        <LoginForm
          defaultEmail=""
          defaultPassword=""
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={onLogin}
        />
      </section>
    </main>
  );
}
