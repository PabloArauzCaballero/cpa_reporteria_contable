import type { ReportFilterOptions } from '../../domain/reportFilterOptions';
import type { ReportFilters } from '../../domain/types';
import { FilterSelect } from './FilterSelect';

interface AdvancedFilterPanelProps {
  filters: ReportFilters;
  options: ReportFilterOptions;
  onFilterChange: (name: keyof ReportFilters, value: string) => void;
}

function clearAdvancedFilters(onFilterChange: AdvancedFilterPanelProps['onFilterChange']): void {
  const fields: Array<keyof ReportFilters> = [
    'search',
    'subTipo',
    'tipoTransaccion',
    'subTipoTransaccion',
    'codigoCuenta',
    'nombreCuenta',
    'idCuenta',
    'codigoGrupoCuenta',
    'nombreGrupoCuenta',
    'idGrupoCuenta',
    'tipoReporte',
    'subGrupo',
    'naturalezaSaldo',
    'anio',
    'mes',
    'idTransaccion',
    'idMovimiento',
  ];
  fields.forEach((field) => onFilterChange(field, ''));
}

export function AdvancedFilterPanel({ filters, options, onFilterChange }: AdvancedFilterPanelProps) {
  return (
    <details className="advanced-filters">
      <summary>
        <span>Filtros contables avanzados</span>
        <small>Se preparan con pausa breve. Usa “Aplicar filtros” para confirmar o espera un momento.</small>
      </summary>
      <div className="advanced-filters__header">
        <p>
          Estos filtros se aplican sobre los movimientos ya cargados desde la view. No consultan módulos CRUD ni
          servicios administrativos.
        </p>
        <button type="button" className="ghost-button" onClick={() => clearAdvancedFilters(onFilterChange)}>
          Limpiar filtros avanzados
        </button>
      </div>
      <div className="advanced-filters__grid advanced-filters__grid--wide">
        <FilterSelect label="Año" name="anio" value={filters.anio} options={options.anios} onFilterChange={onFilterChange} />
        <FilterSelect label="Mes" name="mes" value={filters.mes} options={options.meses} onFilterChange={onFilterChange} />
        <FilterSelect label="Tipo transacción" name="tipoTransaccion" value={filters.tipoTransaccion} options={options.tiposTransaccion} onFilterChange={onFilterChange} />
        <FilterSelect label="Subtipo transacción" name="subTipoTransaccion" value={filters.subTipoTransaccion} options={options.subTiposTransaccion} onFilterChange={onFilterChange} />
        <FilterSelect label="Tipo reporte" name="tipoReporte" value={filters.tipoReporte} options={options.tiposReporte} onFilterChange={onFilterChange} />
        <FilterSelect label="Clasificación" name="subTipo" value={filters.subTipo} options={[
          { value: 'ACTIVO', label: 'Activo' },
          { value: 'PASIVO', label: 'Pasivo' },
          { value: 'PATRIMONIO', label: 'Patrimonio' },
          { value: 'INGRESO', label: 'Ingreso' },
          { value: 'GASTO', label: 'Gasto' },
          { value: 'SIN_CLASIFICAR', label: 'Sin clasificar' },
        ]} onFilterChange={onFilterChange} />
        <FilterSelect label="Código cuenta" name="codigoCuenta" value={filters.codigoCuenta} options={options.cuentas} onFilterChange={onFilterChange} />
        <FilterSelect label="Nombre cuenta" name="nombreCuenta" value={filters.nombreCuenta} options={options.nombresCuenta} onFilterChange={onFilterChange} />
        <FilterSelect label="ID cuenta" name="idCuenta" value={filters.idCuenta} options={options.idsCuenta} onFilterChange={onFilterChange} />
        <FilterSelect label="Código grupo" name="codigoGrupoCuenta" value={filters.codigoGrupoCuenta} options={options.gruposCuenta} onFilterChange={onFilterChange} />
        <FilterSelect label="Nombre grupo" name="nombreGrupoCuenta" value={filters.nombreGrupoCuenta} options={options.nombresGrupoCuenta} onFilterChange={onFilterChange} />
        <FilterSelect label="ID grupo" name="idGrupoCuenta" value={filters.idGrupoCuenta} options={options.idsGrupoCuenta} onFilterChange={onFilterChange} />
        <FilterSelect label="Subgrupo" name="subGrupo" value={filters.subGrupo} options={options.subGrupos} onFilterChange={onFilterChange} />
        <FilterSelect label="Naturaleza" name="naturalezaSaldo" value={filters.naturalezaSaldo} options={options.naturalezasSaldo} onFilterChange={onFilterChange} />
        <FilterSelect label="Transacción" name="idTransaccion" value={filters.idTransaccion} options={options.transacciones} onFilterChange={onFilterChange} />
        <FilterSelect label="Movimiento" name="idMovimiento" value={filters.idMovimiento} options={options.movimientos} onFilterChange={onFilterChange} />
      </div>
    </details>
  );
}
