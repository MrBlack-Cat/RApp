import React from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { loadScheme, saveScheme, type Scheme } from './colorScheme';

type Ctx = { mode: Scheme; isDark: boolean; setMode: (m: Scheme) => void };
const ThemeModeCtx = React.createContext<Ctx>({ mode: 'system', isDark: false, setMode: () => {} });

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [system, setSystem] = React.useState<ColorSchemeName>(() => Appearance.getColorScheme() ?? 'light');
  const [mode, setModeState] = React.useState<Scheme>('system');

  React.useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem(colorScheme ?? 'light');
    });
    return () => sub.remove();
  }, []);

  React.useEffect(() => {
    (async () => {
      const s = await loadScheme();
      if (s) setModeState(s);
    })();
  }, []);

  const setMode = React.useCallback((m: Scheme) => {
    setModeState(m);
    void saveScheme(m);
  }, []);

  const effective: 'light' | 'dark' = mode === 'system'
    ? ((system ?? 'light') === 'dark' ? 'dark' : 'light')
    : mode;

  return (
    <ThemeModeCtx.Provider value={{ mode, isDark: effective === 'dark', setMode }}>
      {children}
    </ThemeModeCtx.Provider>
  );
}

export const useThemeMode = () => React.useContext(ThemeModeCtx);
