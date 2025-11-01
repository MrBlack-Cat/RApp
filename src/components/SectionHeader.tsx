import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function SectionHeader({title, action}:{title:string; action?:React.ReactNode}) {
  return (
    <View style={s.wrap}>
      <Text style={s.title}>{title}</Text>
      {action}
    </View>
  );
}
const s = StyleSheet.create({
  wrap:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:10 },
  title:{ fontSize:18, fontWeight:'700' },
});
