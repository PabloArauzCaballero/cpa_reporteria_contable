import { useEffect, useMemo, useState } from 'react';
import { formatDate, formatMoney } from '../domain/formatters';
import type { LibroDiarioTransaccion } from '../domain/types';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

interface LibroDiarioTabProps {
  transacciones: LibroDiarioTransaccion[];
}

function transactionSummary(transaction: LibroDiarioTransaccion): string {
  return `${formatDate(transaction.fechaTransaccion)} · Transacción #${transaction.idTransaccion}`;
}

function LibroDiarioPager(props: {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  return (
    <div className="pagination-bar">
      <span>
        Página <strong>{props.page}</strong> de <strong>{props.totalPages}</strong> · {props.totalRecords} transacciones
      </span>
      <label>
        Transacciones por página
        <select value={props.pageSize} onChange={(event) => props.onPageSizeChange(Number(event.target.value))}>
          {PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
      <div className="pagination-bar__actions">
        <button type="button" onClick={() => props.onPageChange(props.page - 1)} disabled={props.page <= 1}>Anterior</button>
        <button type="button" onClick={() => props.onPageChange(props.page + 1)} disabled={props.page >= props.totalPages}>Siguiente</button>
      </div>
    </div>
  );
}

function LibroDiarioTransaction({ transaction, defaultOpen }: { transaction: LibroDiarioTransaccion; defaultOpen: boolean }) {
  return (
    <details className="transaction-card" open={defaultOpen}>
      <summary className="transaction-card__header">
        <div>
          <strong>{transactionSummary(transaction)}</strong>
          <span>{transaction.glosa || 'Sin glosa registrada'}</span>
        </div>
        <div className="transaction-card__totals">
          <span className={`badge ${transaction.cuadrada ? 'badge--success' : 'badge--danger'}`}>
            {transaction.cuadrada ? 'Cuadrada' : `Diferencia ${formatMoney(transaction.diferencia)}`}
          </span>
          <b>{formatMoney(transaction.totalDebe)} / {formatMoney(transaction.totalHaber)}</b>
        </div>
      </summary>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cuenta</th>
              <th>Tipo</th>
              <th className="number">Debe</th>
              <th className="number">Haber</th>
            </tr>
          </thead>
          <tbody>
            {transaction.movimientos.map((movement) => (
              <tr key={movement.idMovimiento}>
                <td>{movement.codigoCuenta}</td>
                <td>{movement.nombreCuenta}</td>
                <td>{movement.subTipo}</td>
                <td className="number">{formatMoney(movement.debe)}</td>
                <td className="number">{formatMoney(movement.haber)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={3}>Total transacción</td>
              <td className="number">{formatMoney(transaction.totalDebe)}</td>
              <td className="number">{formatMoney(transaction.totalHaber)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function LibroDiarioTab({ transacciones }: LibroDiarioTabProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(transacciones.length / pageSize));

  useEffect(() => setPage(1), [transacciones, pageSize]);
  useEffect(() => setPage((current) => Math.min(current, totalPages)), [totalPages]);

  const visibleTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return transacciones.slice(start, start + pageSize);
  }, [page, pageSize, transacciones]);

  if (transacciones.length === 0) {
    return <p className="notice">No hay movimientos para mostrar en el Libro Diario con los filtros actuales.</p>;
  }

  return (
    <div id="libro-diario" className="libro-diario-tree">
      <LibroDiarioPager page={page} pageSize={pageSize} totalPages={totalPages} totalRecords={transacciones.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
      {visibleTransactions.map((transaction, index) => (
        <LibroDiarioTransaction transaction={transaction} defaultOpen={index === 0} key={transaction.idTransaccion} />
      ))}
      <LibroDiarioPager page={page} pageSize={pageSize} totalPages={totalPages} totalRecords={transacciones.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
