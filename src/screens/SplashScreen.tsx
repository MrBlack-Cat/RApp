import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText, useColors } from '../ui/Themed';

export default function SplashScreen() {
  const c = useColors();
  return (
    <View style={[s.wrap, { backgroundColor: c.accent }]}>
      <ThemedText style={s.logo}>
        Sh<ThemedText style={s.bold}>op</ThemedText><ThemedText style={s.dot}>.</ThemedText>
      </ThemedText>
      <ThemedText style={s.caption}>Loading…</ThemedText>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { flex:1, alignItems:'center', justifyContent:'center' },
  logo: { color:'#fff', fontSize:42, fontWeight:'800', letterSpacing:1 },
  bold: { fontWeight:'900' },
  dot: { color:'#C7F464' },
  caption: { color:'#fff', marginTop:8, opacity:0.9 },
});
