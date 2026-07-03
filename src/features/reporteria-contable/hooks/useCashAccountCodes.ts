import { useCallback, useEffect, useState } from 'react';
import {
  buildInitialCashAccountCodes,
  persistCashAccountCodes,
  toggleCashAccountCode,
} from '../domain/state/cashAccountConfigStorage';

export function useCashAccountCodes(defaultCodes: string[]) {
  const [cashAccountCodes, setCashAccountCodes] = useState<string[]>(() => buildInitialCashAccountCodes(defaultCodes));

  useEffect(() => {
    persistCashAccountCodes(cashAccountCodes);
  }, [cashAccountCodes]);

  const toggleCashAccount = useCallback((code: string) => {
    setCashAccountCodes((current) => toggleCashAccountCode(current, code));
  }, []);

  const resetCashAccounts = useCallback(() => {
    setCashAccountCodes(buildInitialCashAccountCodes(defaultCodes));
  }, [defaultCodes]);

  return {
    cashAccountCodes,
    toggleCashAccount,
    resetCashAccounts,
  };
}
