import type { AccountOption, MovimientoContable } from '../types';
import { roundMoney } from './accountingMath';

interface AccountAccumulator {
  codigoCuenta: string;
  nombreCuenta: string;
  subTipo: string;
  totalMovimientos: number;
  saldoNatural: number;
}

function createAccountAccumulator(movement: MovimientoContable): AccountAccumulator {
  return {
    codigoCuenta: movement.codigoCuenta,
    nombreCuenta: movement.nombreCuenta,
    subTipo: movement.subTipo || 'SIN_CLASIFICAR',
    totalMovimientos: 0,
    saldoNatural: 0,
  };
}

export function buildAccountOptions(movimientos: MovimientoContable[], selectedCodes: string[]): AccountOption[] {
  const selectedSet = new Set(selectedCodes);
  const accounts = new Map<string, AccountAccumulator>();

  for (const movement of movimientos) {
    const current = accounts.get(movement.codigoCuenta) ?? createAccountAccumulator(movement);
    current.totalMovimientos += 1;
    current.saldoNatural = roundMoney(current.saldoNatural + movement.saldoNatural);
    accounts.set(movement.codigoCuenta, current);
  }

  return Array.from(accounts.values())
    .map((account) => ({
      ...account,
      isConfiguredAsCash: selectedSet.has(account.codigoCuenta),
    }))
    .sort((a, b) => a.codigoCuenta.localeCompare(b.codigoCuenta, 'es', { numeric: true }));
}
