import React from 'react';
import type { SvgProps } from 'react-native-svg';

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
  const active = '#8E6CEF';
  const inactive = '#9CA3AF';
  const c = color ?? (focused ? active : inactive);
  const opacity = focused ? 1 : 0.7;

  return (
    <Icon
      width={size}
      height={size}
      color={c}
      stroke={c}
      fill={mode === 'fill' ? c : 'none'}
      opacity={opacity}
      {...(strokeWidth ? { strokeWidth } : {})}
    />
  );
}
