import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useThemeMode } from '../theme/ThemeMode';
import { ThemedText, useColors } from '../ui/Themed';

export default function ThemeModeSwitch() {
  const { mode, setMode, isDark } = useThemeMode();
  const c = useColors();

  const next = () => setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light');
  const label = mode === 'system' ? 'AUTO' : mode.toUpperCase();

  return (
    <View style={{ marginTop: 4 }}>
      <TouchableOpacity
        onPress={next}
        style={{
          alignSelf: 'flex-start',
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 14,
          backgroundColor: isDark ? '#1f2937' : '#eef2ff',
          borderWidth: 1,
          borderColor: c.border,
        }}
      >
        <ThemedText style={{ fontWeight: '800', color: c.primary }}>{label}</ThemedText>
      </TouchableOpacity>


    </View>
  );
}
