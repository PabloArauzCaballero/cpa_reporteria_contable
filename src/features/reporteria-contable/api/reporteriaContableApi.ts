import { env } from '../../../config/env';
import { get } from '../../../shared/api/httpClient';
import type { ReportFilters, ReporteriaContableContext } from '../domain/types';
import { normalizeReporteriaContableResponse } from './reporteriaContableMapper';

export interface ReporteriaContableQuery {
  desde: string;
  hasta: string;
  fechaCorte: string;
}

function appendQueryParams(path: string, query: ReporteriaContableQuery): string {
  const params = new URLSearchParams();
  params.set('desde', query.desde);
  params.set('hasta', query.hasta);
  params.set('fechaCorte', query.fechaCorte);
  params.set('fecha_corte', query.fechaCorte);
  params.set('modo', 'acumulado');
  params.set('includeAcumulado', 'true');
  params.set('include_acumulado', 'true');

  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}${params.toString()}`;
}

function queryToFilters(query: ReporteriaContableQuery): ReportFilters {
  return {
    desde: query.desde,
    hasta: query.hasta,
    fechaCorte: query.fechaCorte,
    search: '',
    subTipo: '',
    tipoTransaccion: '',
    subTipoTransaccion: '',
    codigoCuenta: '',
    nombreCuenta: '',
    idCuenta: '',
    codigoGrupoCuenta: '',
    nombreGrupoCuenta: '',
    idGrupoCuenta: '',
    tipoReporte: '',
    subGrupo: '',
    naturalezaSaldo: '',
    anio: '',
    mes: '',
    idTransaccion: '',
    idMovimiento: '',
  };
}

export async function getReporteriaContableContext(query: ReporteriaContableQuery): Promise<ReporteriaContableContext> {
  const filters = queryToFilters(query);
  const response = await get<unknown>(appendQueryParams(env.reporteriaContableEndpoint, query));
  return normalizeReporteriaContableResponse(response, filters);
}
