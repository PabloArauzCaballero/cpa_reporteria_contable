interface ToolbarHintProps {
  isBalance: boolean;
  invalidRange: boolean;
  hasPendingFilters: boolean;
}

function resolveToolbarHint(isBalance: boolean, invalidRange: boolean, hasPendingFilters: boolean): string {
  if (invalidRange && !isBalance) return 'Corrige el rango: la fecha desde no puede ser mayor que la fecha hasta.';
  if (hasPendingFilters) return 'Hay filtros pendientes. Se aplicarán automáticamente en unos instantes o puedes aplicarlos ahora.';
  if (isBalance) return 'El balance general se calcula acumulado hasta la fecha de corte y respeta filtros contables visibles.';
  return 'Los filtros se guardan y se aplican con una pausa breve para evitar recargas instantáneas.';
}

export function ToolbarHint({ isBalance, invalidRange, hasPendingFilters }: ToolbarHintProps) {
  return (
    <p className={`toolbar__hint ${invalidRange && !isBalance ? 'toolbar__hint--danger' : ''}`}>
      {resolveToolbarHint(isBalance, invalidRange, hasPendingFilters)}
    </p>
  );
}
