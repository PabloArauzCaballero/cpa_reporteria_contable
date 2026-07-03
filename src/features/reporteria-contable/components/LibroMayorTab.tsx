import { formatDate, formatMoney } from '../domain/formatters';
import type { LibroMayorCuenta } from '../domain/types';

interface LibroMayorTabProps {
  cuentas: LibroMayorCuenta[];
}

interface MayorGroup {
  id: string;
  title: string;
  subtitle: string;
  total: number;
  cuentas: LibroMayorCuenta[];
}

function groupMajorAccounts(cuentas: LibroMayorCuenta[]): MayorGroup[] {
  const byGroup = new Map<string, LibroMayorCuenta[]>();

  for (const account of cuentas) {
    const key = `${account.codigoGrupoCuenta || 'SIN_CODIGO'}__${account.nombreGrupoCuenta || account.subTipo}`;
    const existing = byGroup.get(key) ?? [];
    existing.push(account);
    byGroup.set(key, existing);
  }

  return Array.from(byGroup.entries())
    .map(([id, accounts]) => {
      const first = accounts[0];
      return {
        id,
        title: first?.nombreGrupoCuenta || first?.subTipo || 'Sin grupo',
        subtitle: first?.subGrupo ? `Subgrupo: ${first.subGrupo}` : '',
        total: accounts.reduce((sum, account) => sum + account.saldoFinal, 0),
        cuentas: accounts.sort((a, b) => a.codigoCuenta.localeCompare(b.codigoCuenta, 'es')),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'es'));
}

function AccountTable({ account }: { account: LibroMayorCuenta }) {
  return (
    <article className="account-card" key={`${account.codigoCuenta}-${account.nombreCuenta}`}>
      <header className="account-card__header">
        <div>
          <strong>
            {account.codigoCuenta} · {account.nombreCuenta}
          </strong>
          <div className="muted">
            {account.subTipo} · Naturaleza {account.naturalezaSaldo}
          </div>
        </div>
        <span className="badge">Saldo final {formatMoney(account.saldoFinal)}</span>
      </header>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Transacción</th>
              <th>Glosa</th>
              <th className="number">Debe</th>
              <th className="number">Haber</th>
              <th className="number">Saldo mov.</th>
              <th className="number">Saldo acum.</th>
            </tr>
          </thead>
          <tbody>
            {account.movimientos.map(({ movimiento, saldoMovimiento, saldoAcumulado }) => (
              <tr key={movimiento.idMovimiento}>
                <td>{formatDate(movimiento.fechaTransaccion)}</td>
                <td>#{movimiento.idTransaccion}</td>
                <td>{movimiento.glosa}</td>
                <td className="number">{formatMoney(movimiento.debe)}</td>
                <td className="number">{formatMoney(movimiento.haber)}</td>
                <td className="number">{formatMoney(saldoMovimiento)}</td>
                <td className="number">{formatMoney(saldoAcumulado)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={3}>Totales cuenta</td>
              <td className="number">{formatMoney(account.totalDebe)}</td>
              <td className="number">{formatMoney(account.totalHaber)}</td>
              <td />
              <td className="number">{formatMoney(account.saldoFinal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
}

export function LibroMayorTab({ cuentas }: LibroMayorTabProps) {
  if (cuentas.length === 0) {
    return <p className="notice">No hay cuentas con movimientos para el Libro Mayor en el periodo seleccionado.</p>;
  }

  return (
    <div className="account-group-tree">
      {groupMajorAccounts(cuentas).map((group) => (
        <details className="account-major-group" key={group.id} open>
          <summary>
            <span>
              <strong>{group.title}</strong>
              {group.subtitle ? <small>{group.subtitle}</small> : null}
            </span>
            <b>{formatMoney(group.total)}</b>
          </summary>
          <div className="account-grid">
            {group.cuentas.map((account) => <AccountTable account={account} key={`${account.codigoCuenta}-${account.nombreCuenta}`} />)}
          </div>
        </details>
      ))}
    </div>
  );
}
