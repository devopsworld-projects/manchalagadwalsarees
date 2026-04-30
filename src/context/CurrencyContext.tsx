import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  /** Approx units per 1 INR (display only, not for billing) */
  rateFromINR: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', label: 'Indian Rupee',     rateFromINR: 1 },
  USD: { code: 'USD', symbol: '$', label: 'US Dollar',        rateFromINR: 0.012 },
  EUR: { code: 'EUR', symbol: '€', label: 'Euro',             rateFromINR: 0.011 },
  GBP: { code: 'GBP', symbol: '£', label: 'British Pound',    rateFromINR: 0.0094 },
  CAD: { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar', rateFromINR: 0.016 },
  AUD: { code: 'AUD', symbol: 'A$', label: 'Australian Dollar', rateFromINR: 0.018 },
};

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  format: (amountInINR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'manchala-currency';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return (stored as CurrencyCode) && CURRENCIES[stored as CurrencyCode] ? (stored as CurrencyCode) : 'INR';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  const currency = CURRENCIES[code];

  const format = (amountInINR: number) => {
    const converted = amountInINR * currency.rateFromINR;
    const fractionDigits = code === 'INR' ? 0 : 2;
    return `${currency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setCode, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
