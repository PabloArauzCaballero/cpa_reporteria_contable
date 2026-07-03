interface ToolbarActionsProps {
  isLoading: boolean;
  invalidRange: boolean;
  hasPendingFilters: boolean;
  isFilterSettling: boolean;
  onApplyOrReload: () => void;
  onResetFilters: () => void;
}

function resolvePrimaryLabel(isLoading: boolean, hasPendingFilters: boolean): string {
  if (isLoading) return 'Cargando...';
  return hasPendingFilters ? 'Aplicar filtros' : 'Actualizar';
}

export function ToolbarActions(props: ToolbarActionsProps) {
  return (
    <div className="toolbar__actions">
      <button type="button" className="button button--ghost button--compact" onClick={props.onResetFilters} disabled={props.isLoading}>
        Limpiar
      </button>
      <button type="button" className="button button--primary" onClick={props.onApplyOrReload} disabled={props.isLoading || props.invalidRange}>
        {resolvePrimaryLabel(props.isLoading, props.hasPendingFilters)}
      </button>
      {props.isFilterSettling ? <span className="toolbar__status">Aplicando...</span> : null}
    </div>
  );
}
