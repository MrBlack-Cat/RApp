import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Currency = 'USD' | 'EUR' | 'AZN' | 'TRY' | 'RUB';

const SYMBOL: Record<Currency, string> = {
  USD: '$', EUR: '€', AZN: '₼', TRY: '₺', RUB: '₽'
};

const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  AZN: 1.70,
  TRY: 34,
  RUB: 95,
};

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => Promise<void>;
  symbol: string;
  format: (amountInUSD: number) => string; 
  loading: boolean;
};

const KEY = 'currency';

const CurrencyContext = createContext<Ctx>({
  currency: 'USD',
  setCurrency: async () => {},
  symbol: '$',
  format: (n) => `$${(Number(n)||0).toFixed(2)}`,
  loading: true,
});

export const CurrencyProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [currency, setCur] = useState<Currency>('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(KEY);
      if (saved) setCur(saved as Currency);
      setLoading(false);
    })();
  }, []);

  const setCurrency = useCallback(async (c: Currency) => {
    setCur(c);
    await AsyncStorage.setItem(KEY, c);
  }, []);

  const symbol = SYMBOL[currency];
  const rate = RATES[currency] ?? 1;

  const format = useCallback((amountUSD: number) => {
    const n = (Number(amountUSD) || 0) * rate;
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n);
    } catch {
      return `${SYMBOL[currency]}${n.toFixed(2)}`;
    }
  }, [currency, rate]);

  const value = useMemo(
    () => ({ currency, setCurrency, symbol, format, loading }),
    [currency, setCurrency, symbol, format, loading]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => useContext(CurrencyContext);
