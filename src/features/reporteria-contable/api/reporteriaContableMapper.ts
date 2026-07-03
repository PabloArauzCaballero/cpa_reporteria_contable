import type {
  CuentaEfectivoMetadata,
  MovimientoContable,
  ReportFilters,
  ReporteriaContableContext,
  ReporteriaContableMetadata,
} from '../domain/types';
import type {
  CuentaEfectivoMetadataDto,
  MovimientoContableDto,
  ReporteriaContableMetadataDto,
} from './reporteriaContableDto';

const VIEW_ORIGIN = 'contabilidad.v_powerbi_contable_movimiento';

function asNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function asString(value: unknown, fallback = ''): string {
  if (value === undefined || value === null) return fallback;
  return String(value);
}

function asDateString(value: unknown): string {
  const text = asString(value);
  if (!text) return '';
  return text.slice(0, 10);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

export function mapMovimientoContableDto(dto: MovimientoContableDto): MovimientoContable {
  return {
    idTransaccion: asNumber(dto.id_transaccion),
    idMovimiento: asNumber(dto.id_movimiento),
    fechaTransaccion: asDateString(dto.fecha_transaccion),
    periodoInicio: asDateString(dto.periodo_inicio),
    periodoFin: asDateString(dto.periodo_fin),
    anio: asNumber(dto.anio),
    mes: asNumber(dto.mes),
    tipoTransaccion: asString(dto.tipo_transaccion, 'SIN_TIPO'),
    subTipoTransaccion: asString(dto.sub_tipo_transaccion),
    glosa: asString(dto.glosa),
    idCuenta: asNumber(dto.id_cuenta),
    codigoCuenta: asString(dto.codigo_cuenta),
    nombreCuenta: asString(dto.nombre_cuenta, 'Cuenta sin nombre'),
    idGrupoCuenta: asNumber(dto.id_grupo_cuenta),
    codigoGrupoCuenta: asString(dto.codigo_grupo_cuenta),
    nombreGrupoCuenta: asString(dto.nombre_grupo_cuenta),
    tipoReporte: asString(dto.tipo_reporte),
    subTipo: asString(dto.sub_tipo, 'SIN_CLASIFICAR').toUpperCase(),
    subGrupo: asString(dto.sub_grupo),
    ordenReporte: asNumber(dto.orden_reporte),
    debe: asNumber(dto.debe),
    haber: asNumber(dto.haber),
    saldoDeudor: asNumber(dto.saldo_deudor),
    saldoNatural: asNumber(dto.saldo_natural),
    naturalezaSaldo: asString(dto.naturaleza_saldo, 'SIN_CLASIFICAR').toUpperCase(),
  };
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readRecordsFromResponse(response: unknown): unknown[] {
  if (Array.isArray(response)) return response;

  const source = asRecord(response);
  if (!source) return [];

  if (Array.isArray(source.movimientos)) return source.movimientos;
  if (Array.isArray(source.data)) return source.data;
  if (Array.isArray(source.records)) return source.records;
  if (Array.isArray(source.items)) return source.items;
  if (Array.isArray(source.rows)) return source.rows;

  const data = asRecord(source.data);
  if (!data) return [];

  if (Array.isArray(data.movimientos)) return data.movimientos;
  if (Array.isArray(data.records)) return data.records;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.rows)) return data.rows;

  return [];
}

function readMetadataSource(response: unknown): ReporteriaContableMetadataDto {
  const source = asRecord(response);
  if (!source) return {};

  const rootMetadata = asRecord(source.metadata);
  if (rootMetadata) return rootMetadata as ReporteriaContableMetadataDto;

  const data = asRecord(source.data);
  const dataMetadata = asRecord(data?.metadata);
  if (dataMetadata) return dataMetadata as ReporteriaContableMetadataDto;

  return {};
}

function mapCuentaEfectivoDto(value: unknown): CuentaEfectivoMetadata | null {
  const source = asRecord(value) as CuentaEfectivoMetadataDto | null;
  if (!source) return null;

  const codigoCuenta = asString(source.codigo_cuenta ?? source.codigoCuenta).trim();
  if (!codigoCuenta) return null;

  return {
    idCuenta: asNumber(source.id_cuenta ?? source.idCuenta),
    codigoCuenta,
    nombreCuenta: asString(source.nombre_cuenta ?? source.nombreCuenta, 'Cuenta de efectivo'),
  };
}

function mapCuentasEfectivo(metadata: ReporteriaContableMetadataDto): CuentaEfectivoMetadata[] {
  const explicitAccounts = readArray(metadata.cuentas_efectivo ?? metadata.cuentasEfectivo)
    .map(mapCuentaEfectivoDto)
    .filter((account): account is CuentaEfectivoMetadata => account !== null);

  const singleAccount = mapCuentaEfectivoDto(metadata.cuenta_efectivo ?? metadata.cuentaEfectivo);
  const allAccounts = singleAccount ? [singleAccount, ...explicitAccounts] : explicitAccounts;
  const byCode = new Map<string, CuentaEfectivoMetadata>();

  for (const account of allAccounts) {
    byCode.set(account.codigoCuenta, account);
  }

  return Array.from(byCode.values());
}

function buildFallbackMetadata(filters: ReportFilters): ReporteriaContableMetadata {
  return {
    generadoEn: new Date().toISOString(),
    origen: VIEW_ORIGIN,
    desde: filters.desde,
    hasta: filters.hasta,
    fechaCorte: filters.fechaCorte,
    moneda: 'BOB',
    cuentaEfectivo: null,
    cuentasEfectivo: [],
  };
}

export function normalizeMovimientosResponse(response: unknown): MovimientoContable[] {
  return readRecordsFromResponse(response)
    .filter((row): row is MovimientoContableDto => typeof row === 'object' && row !== null)
    .map(mapMovimientoContableDto)
    .filter((movement) => movement.idTransaccion > 0 && movement.idMovimiento > 0 && movement.fechaTransaccion !== '');
}

export function normalizeReporteriaContableResponse(response: unknown, filters: ReportFilters): ReporteriaContableContext {
  const fallback = buildFallbackMetadata(filters);
  const metadataDto = readMetadataSource(response);
  const cuentasEfectivo = mapCuentasEfectivo(metadataDto);

  return {
    metadata: {
      generadoEn: asString(metadataDto.generado_en ?? metadataDto.generadoEn, fallback.generadoEn),
      origen: asString(metadataDto.origen, fallback.origen),
      desde: asDateString(metadataDto.desde) || fallback.desde,
      hasta: asDateString(metadataDto.hasta) || fallback.hasta,
      fechaCorte: asDateString(metadataDto.fecha_corte ?? metadataDto.fechaCorte) || fallback.fechaCorte,
      moneda: asString(metadataDto.moneda, fallback.moneda),
      cuentaEfectivo: cuentasEfectivo[0] ?? null,
      cuentasEfectivo,
    },
    movimientos: normalizeMovimientosResponse(response),
  };
}
