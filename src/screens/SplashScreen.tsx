import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={s.wrap}>
      <Text style={s.logo}>
        Sh
        <Text style={s.bold}>op</Text>
        <Text style={s.dot}>.</Text>
      </Text>
      <Text style={s.caption}>Loading…</Text>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { flex:1, backgroundColor:'#7B61FF', alignItems:'center', justifyContent:'center' },
  logo: { color:'#fff', fontSize:42, fontWeight:'800', letterSpacing:1 },
  bold: { fontWeight:'900' },
  dot: { color:'#C7F464' },
  caption: { color:'#fff', marginTop:8, opacity:0.8 },
});
