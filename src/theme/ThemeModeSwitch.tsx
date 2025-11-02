import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { useThemeMode } from '../theme/ThemeMode';
import type { Scheme } from '../theme/colorScheme';
import { Sun, Moon, Settings2 } from 'lucide-react-native';

export default function ThemeModeSwitch() {
  const { mode, isDark, setMode } = useThemeMode();

  const cycle = () => {
    const next: Scheme = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
    setMode(next);
  };

  const label =
    mode === 'system' ? 'Auto' :
    mode === 'dark'   ? 'Dark' :
                        'Light';

  return (
    <Pressable
      onPress={cycle}
      className={`self-start flex-row items-center rounded-2xl px-3 py-2
                  ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
    >
      <View className="flex-row items-center gap-2">
        <View className={`w-8 h-8 rounded-full items-center justify-center
                          ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
          {mode === 'system' ? (
            <Settings2 size={18} color={isDark ? '#e5e7eb' : '#0f172a'} />
          ) : mode === 'dark' ? (
            <Moon size={18} color={isDark ? '#e5e7eb' : '#0f172a'} />
          ) : (
            <Sun size={18} color={isDark ? '#e5e7eb' : '#0f172a'} />
          )}
        </View>
        <Text className={`${isDark ? 'text-slate-50' : 'text-slate-900'} font-semibold`}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
