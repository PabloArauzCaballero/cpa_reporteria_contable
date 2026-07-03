import { env } from './config/env';
import { LoginPage } from './features/auth/pages/LoginPage';
import { ReporteriaContablePage } from './features/reporteria-contable/pages/ReporteriaContablePage';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { ReportShell } from './shared/layouts/ReportShell';
import { useAuthSession } from './features/auth/hooks/useAuthSession';

export function App() {
  const auth = useAuthSession();
  const canOpenReports = !env.authRequired || auth.isAuthenticated;

  return (
    <ErrorBoundary>
      {canOpenReports ? (
        <ReportShell session={auth.session} onLogout={auth.signOut}>
          <ReporteriaContablePage />
        </ReportShell>
      ) : (
        <LoginPage isSubmitting={auth.isAuthenticating} error={auth.authError} onLogin={(credentials) => void auth.signIn(credentials)} />
      )}
    </ErrorBoundary>
  );
}
