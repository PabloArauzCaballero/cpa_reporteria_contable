import type {
  BalanceGeneralResumen,
  EstadoResultadosResumen,
  FlujoCajaResumen,
  LibroDiarioTransaccion,
  LibroMayorCuenta,
  ReportTab,
} from '../../domain/types';
import { BalanceGeneralTab } from '../BalanceGeneralTab';
import { EstadoResultadosTab } from '../EstadoResultadosTab';
import { FlujoCajaTab } from '../FlujoCajaTab';
import { LibroDiarioTab } from '../LibroDiarioTab';
import { LibroMayorTab } from '../LibroMayorTab';

interface ActiveReportRendererProps {
  activeTab: ReportTab;
  libroDiario: LibroDiarioTransaccion[];
  libroMayor: LibroMayorCuenta[];
  estadoResultados: EstadoResultadosResumen;
  balanceGeneral: BalanceGeneralResumen;
  flujoCaja: FlujoCajaResumen;
}

export function ActiveReportRenderer(props: ActiveReportRendererProps) {
  if (props.activeTab === 'diario') return <LibroDiarioTab transacciones={props.libroDiario} />;
  if (props.activeTab === 'mayor') return <LibroMayorTab cuentas={props.libroMayor} />;
  if (props.activeTab === 'resultados') return <EstadoResultadosTab resumen={props.estadoResultados} />;
  if (props.activeTab === 'balance') return <BalanceGeneralTab resumen={props.balanceGeneral} />;
  return <FlujoCajaTab resumen={props.flujoCaja} />;
}
