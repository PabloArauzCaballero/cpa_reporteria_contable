import type { CuentaEfectivoMetadata } from '../../domain/types';

interface CashAccountMetadataPanelProps {
  accounts: CuentaEfectivoMetadata[];
}

export function CashAccountMetadataPanel({ accounts }: CashAccountMetadataPanelProps) {
  if (accounts.length === 0) return null;

  return (
    <section className="cash-config cash-config--readonly" aria-label="Cuenta de efectivo desde metadata">
      <div className="cash-config__header">
        <div>
          <span className="report-kicker">Metadata del endpoint</span>
          <h3>Cuentas de efectivo oficiales</h3>
          <p>
            El Flujo de Caja usa estas cuentas devueltas por el endpoint especializado. No depende del CRUD ni
            de configuración manual del navegador.
          </p>
        </div>
        <span className="badge badge--success">Fuente oficial</span>
      </div>

      <div className="cash-config__list cash-config__list--compact">
        {accounts.map((account) => (
          <div className="cash-config__item cash-config__item--readonly" key={account.codigoCuenta}>
            <span>
              <strong>{account.codigoCuenta} · {account.nombreCuenta}</strong>
              <small>ID cuenta: {account.idCuenta || 'no informado'}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
