import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeMode } from '../theme/ThemeMode';

export default function ThemeToggle() {
  const { mode, setMode, isDark } = useThemeMode();

  const next = () => setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light');
  const label = mode === 'system' ? 'AUTO' : mode.toUpperCase();

  return (
    <View style={{ marginTop: 4 }}>
      <Pressable
        onPress={next}
        style={{
          alignSelf: 'flex-start',
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 14,
          backgroundColor: isDark ? '#1f2937' : '#eef2ff',
          borderWidth: 1,
          borderColor: isDark ? '#374151' : '#e5e7eb',
        }}
      >
        <Text style={{ fontWeight: '800', color: isDark ? '#93c5fd' : '#2563eb' }}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}
