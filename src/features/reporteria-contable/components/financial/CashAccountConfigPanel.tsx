import { formatMoney } from '../../domain/formatters';
import type { AccountOption } from '../../domain/types';

interface CashAccountConfigPanelProps {
  accounts: AccountOption[];
  selectedCodes: string[];
  onToggleAccount: (code: string) => void;
  onResetAccounts: () => void;
}

function shouldSuggestCashAccount(account: AccountOption): boolean {
  const text = `${account.codigoCuenta} ${account.nombreCuenta}`.toLowerCase();
  return text.includes('caja') || text.includes('banco') || text.includes('efectivo');
}

function sortAccountsForConfiguration(accounts: AccountOption[]): AccountOption[] {
  return [...accounts].sort((a, b) => {
    if (a.isConfiguredAsCash !== b.isConfiguredAsCash) return a.isConfiguredAsCash ? -1 : 1;
    if (shouldSuggestCashAccount(a) !== shouldSuggestCashAccount(b)) return shouldSuggestCashAccount(a) ? -1 : 1;
    return a.codigoCuenta.localeCompare(b.codigoCuenta, 'es', { numeric: true });
  });
}

export function CashAccountConfigPanel({
  accounts,
  selectedCodes,
  onToggleAccount,
  onResetAccounts,
}: CashAccountConfigPanelProps) {
  const orderedAccounts = sortAccountsForConfiguration(accounts);

  return (
    <section className="cash-config" aria-label="Configuración de cuentas de efectivo">
      <div className="cash-config__header">
        <div>
          <span className="report-kicker">Configuración local</span>
          <h3>Cuentas de efectivo para flujo de caja</h3>
          <p>
            Marca caja, bancos o equivalentes. La selección se guarda en este navegador y mejora el cálculo
            del flujo sin modificar la base de datos.
          </p>
        </div>
        <button type="button" className="button button--ghost button--compact button--on-light" onClick={onResetAccounts}>
          Restaurar .env
        </button>
      </div>

      <div className="cash-config__summary">
        <strong>{selectedCodes.length}</strong>
        <span>cuentas configuradas como efectivo</span>
      </div>

      {orderedAccounts.length === 0 ? (
        <p className="muted">No hay cuentas disponibles con los filtros actuales.</p>
      ) : (
        <div className="cash-config__list">
          {orderedAccounts.map((account) => (
            <label className="cash-config__item" key={account.codigoCuenta}>
              <input
                type="checkbox"
                checked={account.isConfiguredAsCash}
                onChange={() => onToggleAccount(account.codigoCuenta)}
              />
              <span>
                <strong>{account.codigoCuenta} · {account.nombreCuenta}</strong>
                <small>
                  {account.subTipo || 'Sin clasificar'} · {account.totalMovimientos} movimientos · saldo{' '}
                  {formatMoney(account.saldoNatural)}
                </small>
              </span>
              {shouldSuggestCashAccount(account) ? <b>Sugerida</b> : null}
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
