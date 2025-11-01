import AsyncStorage from '@react-native-async-storage/async-storage';

export type Currency = 'USD' | 'EUR' | 'AZN' | 'TRY' | 'RUB';

const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  AZN: 1.70,
  TRY: 34,
  RUB: 95,
};

export async function getRate(): Promise<number> {
  try {
    const cur = (await AsyncStorage.getItem('currency')) as Currency | null;
    return RATES[(cur ?? 'USD') as Currency] ?? 1;
  } catch {
    return 1;
  }
}
