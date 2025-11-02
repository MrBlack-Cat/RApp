import AsyncStorage from '@react-native-async-storage/async-storage';
export type Scheme = 'light' | 'dark' | 'system';
const KEY = 'color-scheme';

export async function saveScheme(s: Scheme) { await AsyncStorage.setItem(KEY, s); }
export async function loadScheme(): Promise<Scheme | null> {
  const v = await AsyncStorage.getItem(KEY);
  return (v as Scheme) ?? null;
}
