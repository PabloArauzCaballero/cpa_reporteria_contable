import { useEffect, useMemo, useState } from 'react';
import { env } from './config/env';
import { LoginPage } from './features/auth/pages/LoginPage';
import { ReporteriaContablePage } from './features/reporteria-contable/pages/ReporteriaContablePage';
import { getEnabledAccountingReportTabs } from './features/reporteria/domain/reportPermissions';
import { ReporteriaPanelPage } from './features/reporteria/pages/ReporteriaPanelPage';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { ReportShell, type ReportShellView } from './shared/layouts/ReportShell';
import { useAuthSession } from './features/auth/hooks/useAuthSession';

export function App() {
  const auth = useAuthSession();
  const [activeView, setActiveView] = useState<ReportShellView>('panel');
  const canOpenReports = !env.authRequired || auth.isAuthenticated;
  const enabledAccountingTabs = useMemo(() => getEnabledAccountingReportTabs(auth.session), [auth.session]);
  const canOpenContabilidad = enabledAccountingTabs.length > 0;

  useEffect(() => {
    if (activeView === 'contabilidad' && !canOpenContabilidad) {
      setActiveView('panel');
    }
  }, [activeView, canOpenContabilidad]);

  function signOut() {
    setActiveView('panel');
    auth.signOut();
  }

  function openContabilidad() {
    if (!canOpenContabilidad) return;
    setActiveView('contabilidad');
  }

  return (
    <ErrorBoundary>
      {canOpenReports ? (
        <ReportShell
          activeView={activeView}
          session={auth.session}
          canOpenContabilidad={canOpenContabilidad}
          onLogout={signOut}
          onOpenPanel={() => setActiveView('panel')}
          onOpenContabilidad={openContabilidad}
        >
          {activeView === 'panel' ? (
            <ReporteriaPanelPage session={auth.session} onOpenContabilidad={openContabilidad} />
          ) : (
            <ReporteriaContablePage allowedTabs={enabledAccountingTabs} />
          )}
        </ReportShell>
      ) : (
        <LoginPage isSubmitting={auth.isAuthenticating} error={auth.authError} onLogin={(credentials) => void auth.signIn(credentials)} />
      )}
    </ErrorBoundary>
  );
}
