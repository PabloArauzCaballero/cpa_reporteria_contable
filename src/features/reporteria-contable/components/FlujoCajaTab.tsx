import { formatMoney, formatSignedMoney } from '../domain/formatters';
import type { FlujoCajaLinea, FlujoCajaResumen } from '../domain/types';
import { CashAccountMetadataPanel } from './financial/CashAccountMetadataPanel';
import { EmptyStatementMessage, FinancialStatementCard } from './financial/FinancialStatementCard';

interface FlujoCajaTabProps {
  resumen: FlujoCajaResumen;
}

function FlowSection({ title, lines, total }: { title: string; lines: FlujoCajaLinea[]; total: number }) {
  return (
    <FinancialStatementCard title={title}>
      {lines.length === 0 ? <EmptyStatementMessage>Sin movimientos clasificados.</EmptyStatementMessage> : null}
      {lines.map((line) => (
        <div className="statement-line" key={`${line.categoria}-${line.concepto}`}>
          <span>{line.concepto}</span>
          <span>{formatSignedMoney(line.total)}</span>
        </div>
      ))}
      <div className="statement-line statement-total">
        <span>Total {title.toLowerCase()}</span>
        <strong>{formatSignedMoney(total)}</strong>
      </div>
    </FinancialStatementCard>
  );
}

export function FlujoCajaTab({ resumen }: FlujoCajaTabProps) {
  const metadataAccounts = resumen.cuentasEfectivoMetadata.length > 0
    ? resumen.cuentasEfectivoMetadata
    : resumen.cuentaEfectivoMetadata
      ? [resumen.cuentaEfectivoMetadata]
      : [];

  if (resumen.requiereConfiguracion) {
    return (
      <div className="notice">
        <strong>Metadata de cuenta de efectivo pendiente.</strong>
        <p>
          El endpoint especializado debe devolver <code>metadata.cuentaEfectivo</code> o{' '}
          <code>metadata.cuentasEfectivo</code>. Sin esa metadata, el frontend no calcula Flujo de Caja
          para evitar resultados inventados.
        </p>
      </div>
    );
  }

  return (
    <>
      <CashAccountMetadataPanel accounts={metadataAccounts} />

      <div className="statement-grid">
        <FinancialStatementCard title="Resumen de efectivo">
          <div className="statement-line">
            <span>Saldo inicial estimado</span>
            <strong>{formatMoney(resumen.saldoInicial)}</strong>
          </div>
          <div className="statement-line">
            <span>Incremento neto de efectivo</span>
            <strong>{formatSignedMoney(resumen.incrementoNeto)}</strong>
          </div>
          <div className="statement-line statement-total">
            <span>Saldo final estimado</span>
            <strong>{formatMoney(resumen.saldoFinal)}</strong>
          </div>
          <p className="muted">
            Cuentas de efectivo oficiales: {resumen.cashAccountCodes.join(', ')}.
          </p>
        </FinancialStatementCard>

        <FlowSection title="Actividades de operación" lines={resumen.operacion} total={resumen.totalOperacion} />
        <FlowSection title="Actividades de inversión" lines={resumen.inversion} total={resumen.totalInversion} />
        <FlowSection title="Actividades de financiamiento" lines={resumen.financiamiento} total={resumen.totalFinanciamiento} />
        {resumen.sinClasificar.length > 0 ? <FlowSection title="Sin clasificar" lines={resumen.sinClasificar} total={resumen.totalSinClasificar} /> : null}
      </div>
    </>
  );
}
