const STORAGE_KEY = 'cpa.reporteriaContable.cashAccountCodes.v1';

function normalizeCodes(codes: string[]): string[] {
  return Array.from(new Set(codes.map((code) => code.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, 'es', { numeric: true }),
  );
}

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function buildInitialCashAccountCodes(defaultCodes: string[]): string[] {
  if (!canUseLocalStorage()) return normalizeCodes(defaultCodes);

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return normalizeCodes(defaultCodes);

    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? normalizeCodes(parsed.map(String)) : normalizeCodes(defaultCodes);
  } catch {
    return normalizeCodes(defaultCodes);
  }
}

export function persistCashAccountCodes(codes: string[]): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCodes(codes)));
}

export function toggleCashAccountCode(currentCodes: string[], code: string): string[] {
  const cleanCode = code.trim();
  if (!cleanCode) return normalizeCodes(currentCodes);

  const currentSet = new Set(currentCodes);
  if (currentSet.has(cleanCode)) currentSet.delete(cleanCode);
  else currentSet.add(cleanCode);

  return normalizeCodes(Array.from(currentSet));
}
