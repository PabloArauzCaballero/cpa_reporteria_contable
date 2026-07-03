const currencyFormatter = new Intl.NumberFormat('es-BO', {
  style: 'currency',
  currency: 'BOB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('es-BO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('es-BO', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function formatMoney(value: number): string {
  return currencyFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return dateFormatter.format(date);
}

export function formatSignedMoney(value: number): string {
  if (value === 0) return formatMoney(0);
  return value > 0 ? `+${formatMoney(value)}` : formatMoney(value);
}
