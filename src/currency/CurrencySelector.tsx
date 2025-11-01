import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCurrency, type Currency } from './CurrencyContext';

const OPTIONS: Currency[] = ['USD','EUR','AZN','TRY','RUB'];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <View style={s.wrap}>
      <Text style={s.label}>Currency</Text>
      <View style={s.row}>
        {OPTIONS.map(c => (
          <TouchableOpacity key={c} onPress={() => setCurrency(c)} style={[s.pill, currency === c && s.pillOn]}>
            <Text style={[s.pillTxt, currency === c && s.pillTxtOn]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:{ marginTop:12 },
  label:{ fontWeight:'800', marginBottom:8 },
  row:{ flexDirection:'row', flexWrap:'wrap', gap:8 },
  pill:{ paddingHorizontal:12, paddingVertical:8, borderRadius:20, borderWidth:1, borderColor:'#ddd' },
  pillOn:{ borderColor:'#8E6CEF', backgroundColor:'#F3EEFF' },
  pillTxt:{ fontWeight:'700', color:'#333' },
  pillTxtOn:{ color:'#8E6CEF' },
});
