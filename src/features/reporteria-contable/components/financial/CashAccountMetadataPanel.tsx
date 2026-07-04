import type { CuentaEfectivoMetadata } from '../../domain/types';

interface CashAccountMetadataPanelProps {
  accounts: CuentaEfectivoMetadata[];
}

export function CashAccountMetadataPanel({ accounts }: CashAccountMetadataPanelProps) {
  if (accounts.length === 0) return null;

  return (
    <section className="cash-config cash-config--readonly" aria-label="Cuentas oficiales de efectivo">
      <div className="cash-config__header">
        <div>
          <span className="report-kicker">Información contable</span>
          <h3>Cuentas de efectivo</h3>
          <p>
            El Flujo de Caja usa estas cuentas como base oficial para identificar entradas y salidas de efectivo.
          </p>
        </div>
        <span className="badge badge--success">Criterio oficial</span>
      </div>

      <div className="cash-config__list cash-config__list--compact">
        {accounts.map((account) => (
          <div className="cash-config__item cash-config__item--readonly" key={account.codigoCuenta}>
            <span>
              <strong>{account.codigoCuenta} · {account.nombreCuenta}</strong>
              <small>Código interno: {account.idCuenta || 'no informado'}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
