import React from 'react';
import type { SvgProps } from 'react-native-svg';
import { useColors } from '../ui/Themed';

type Props = {
  Icon: React.FC<SvgProps>;
  focused: boolean;
  color?: string;
  size?: number;
  mode?: 'stroke' | 'fill';
  strokeWidth?: number;
};

export default function TabIcon({
  Icon,
  focused,
  color,
  size = 24,
  mode = 'stroke',
  strokeWidth,
}: Props) {
  const c = useColors();
  const tint = color ?? (focused ? c.primary : c.muted);
  const opacity = focused ? 1 : 0.8;

  return (
    <Icon
      width={size}
      height={size}
      color={tint}
      stroke={mode === 'stroke' ? tint : 'none'}
      fill={mode === 'fill' ? tint : 'none'}
      opacity={opacity}
      {...(strokeWidth ? { strokeWidth } : {})}
    />
  );
}
