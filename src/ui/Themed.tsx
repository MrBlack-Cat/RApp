import React from 'react';
import { View, Text, type ViewProps, type TextProps } from 'react-native';
import { useThemeMode } from '../theme/ThemeMode';

export type Palette = {
  bg: string;
  text: string;
  card: string;
  border: string;
  subtle: string;
  accent: string;
  pillOnBg: string;
  pillOnBorder: string;

  primary: string; 
  muted: string;  
};

function buildPalette(isDark: boolean): Palette {
  if (isDark) {
    const base = {
      bg:     '#0f172a',
      text:   '#F9FAFB',
      card:   '#111827',
      border: '#1F2937',
      subtle: '#CBD5E1',
      accent: '#7B61FF',
      pillOnBg:     '#2B2350',
      pillOnBorder: '#8E6CEF',
    };
    return { ...base, primary: base.accent, muted: base.subtle };
  }
  const base = {
    bg:     '#ffffff',
    text:   '#111827',
    card:   '#F3F4F6',
    border: '#E5E7EB',
    subtle: '#6B7280',
    accent: '#7B61FF',
    pillOnBg:     '#F3EEFF',
    pillOnBorder: '#8E6CEF',
  };
  return { ...base, primary: base.accent, muted: base.subtle };
}

export function useColors(): Palette {
  const { isDark } = useThemeMode();
  return React.useMemo(() => buildPalette(isDark), [isDark]);
}

export const ThemedView = React.forwardRef<View, ViewProps>(function TView(props, ref) {
  const c = useColors();
  return <View ref={ref} {...props} style={[{ backgroundColor: c.bg }, props.style]} />;
});

export const ThemedCard = React.forwardRef<View, ViewProps>(function TCard(props, ref) {
  const c = useColors();
  return (
    <View
      ref={ref}
      {...props}
      style={[
        {
          backgroundColor: c.card,
          borderColor: c.border,
          borderWidth: 1,
          borderRadius: 12,
        },
        props.style,
      ]}
    />
  );
});

export const ThemedText = React.forwardRef<Text, TextProps>(function TText(props, ref) {
  const c = useColors();
  return <Text ref={ref} {...props} style={[{ color: c.text }, props.style]} />;
});
