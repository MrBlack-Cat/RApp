// // src/theme/ThemeProvider.tsx
// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { useColorScheme } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export type Mode = 'light' | 'dark' | 'system';

// export interface ThemeColors {
//   bg: string;
//   text: string;
//   card: string;
// }

// const LIGHT: ThemeColors = { bg: '#FFFFFF', text: '#111827', card: '#F3F4F6' };
// const DARK:  ThemeColors = { bg: '#0B1220', text: '#F9FAFB', card: '#111827' };

// type Ctx = {
//   theme: ThemeColors;
//   /** true, если реальный режим сейчас тёмный (учитывает system) */
//   isDark: boolean;
//   mode: Mode;
//   setMode: (m: Mode) => void;
// };

// const ThemeCtx = createContext<Ctx>({
//   theme: LIGHT,
//   isDark: false,
//   mode: 'system',
//   setMode: () => {},
// });

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const system = useColorScheme(); // 'light' | 'dark' | null
//   const [mode, setMode] = useState<Mode>('system');

//   useEffect(() => {
//     AsyncStorage.getItem('themeMode').then(v => v && setMode(v as Mode));
//   }, []);

//   useEffect(() => {
//     AsyncStorage.setItem('themeMode', mode);
//   }, [mode]);

//   const value = useMemo<Ctx>(() => {
//     const current = mode === 'system' ? (system ?? 'light') : mode;
//     const darkNow = current === 'dark';
//     return {
//       theme: darkNow ? DARK : LIGHT,
//       isDark: darkNow,
//       mode,
//       setMode,
//     };
//   }, [mode, system]);

//   return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
// }

// export const useTheme = () => useContext(ThemeCtx);
