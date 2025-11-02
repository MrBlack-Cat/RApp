import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useCurrency, type Currency } from './CurrencyContext';
import { ThemedText, useColors } from '../ui/Themed';

const OPTIONS: Currency[] = ['USD', 'EUR', 'AZN', 'TRY', 'RUB'];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const c = useColors();

  return (
    <View style={{ marginTop: 12 }}>
      <ThemedText style={{ fontWeight: '800', marginBottom: 8 }}>Currency</ThemedText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {OPTIONS.map(opt => {
          const active = currency === opt;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => setCurrency(opt)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: active ? c.pillOnBorder : c.border,
                backgroundColor: active ? c.pillOnBg : 'transparent',
              }}
            >
              <ThemedText style={{ fontWeight: '700', color: active ? c.pillOnBorder : c.text }}>
                {opt}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
