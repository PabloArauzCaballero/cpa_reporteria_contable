export type CsvCell = string | number;
export type CsvRows = CsvCell[][];

export function escapeCsvValue(value: CsvCell): string {
  const text = String(value);
  if (/[",\n;]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function toCsv(rows: CsvRows): string {
  return rows.map((row) => row.map(escapeCsvValue).join(';')).join('\n');
}

export function downloadCsv(filename: string, rows: CsvRows): void {
  const content = toCsv(rows);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
